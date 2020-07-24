import React, {Component} from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
// import { Link } from 'react-router-dom'
import '../css/controlpanel.css'
import SideMenu from './SideMenu'
import Incident from './Incident'
import Gmap from './Gmap'
import { withRouter } from 'react-router'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button }from 'reactstrap'

import { incidentService } from '../services/incidents.service';

class ControlPanel extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			incidents: [],
			showModal: false,
			coordinates: [],
			visiblePosts: 0,
			isloading: false,
			postsDone: false,
			no_posts:false
		}
		this.loadmore = this.loadmore.bind(this)
	}	


	componentDidMount()
	{	
		let usertype =  localStorage.getItem("usertype");
		let coordinate = {}; //object of coordinates
		let coordinates = [] //array of objects of coordinates

		this.setState({
			no_posts:true
		})

		if(Number(usertype) === 0) //api call for control center
		{	
			incidentService.get_active_incidents(this.state.visiblePosts, 9)
			.then( response => {
				console.log("Response from control center is",response)
				this.setState({
					incidents: response,
					visiblePosts: this.state.visiblePosts + 9,
					no_posts:false
				})
				
				this.state.incidents.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
						/*define the new coordinate */
						coordinate = {}
						coordinate['lat'] = incident.location['latitude']
						coordinate['lng'] = incident.location['longtitude']    
						coordinate['priority'] = incident.priority
	
						/* Push it to the array of coordinates */
						coordinates.push(coordinate)
					})
	
				this.setState({
					coordinates: coordinates
				})
			});	
		}
		else if(Number(usertype) === 2) //api call for employees
		{	
			incidentService.get_user_requested_incidents()
			.then( response => {
				if(response.incidents.length !==0)
				{
					this.setState({
						incidents: response.incidents,
						visiblePosts: this.state.visiblePosts + 7,
						no_posts:false

					})
					
					this.state.incidents.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
							/*define the new coordinate */
							coordinate = {}
							coordinate['lat'] = incident.location['latitude']
							coordinate['lng'] = incident.location['longtitude']    
							coordinate['priority'] = incident.priority
		
							/* Push it to the array of coordinates */
							coordinates.push(coordinate)
						})
		
					this.setState({
						coordinates: coordinates
					})
				}
				else if(response.incidents.length === 0)
				{
					console.log("To response einai adeio!!!")
					this.setState=({
						no_posts: true,
						postsDone: true
					})
				}
			});	
		}
		else if(Number(usertype) === 1) //api call for departments
		{	
			incidentService.get_department_incidents(this.state.visiblePosts, 9)
			.then( response => {
				console.log("Eimai apo atpf me response", response)
				if(response.length !==0)
				{
					this.setState({
						incidents: response,
						visiblePosts: this.state.visiblePosts + 7,
						no_posts:false
					})
					
					this.state.incidents.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
							/*define the new coordinate */
							coordinate = {}
							coordinate['lat'] = incident.location['latitude']
							coordinate['lng'] = incident.location['longtitude']    
							coordinate['priority'] = incident.priority
		
							/* Push it to the array of coordinates */
							coordinates.push(coordinate)
						})
		
					this.setState({
						coordinates: coordinates
					})
				}
				else if(response.incidents.length === 0)
				{
					console.log("To response einai adeio!!!")
					this.setState=({
						no_posts: true,
						postsDone: true
					})
				}
			});	
		}
	}

	refresh()
	{
		window.location.reload(false);
	}

	loadmore()
	{
		this.setState({
			isloading: true
		})
		this.setState({
			visiblePosts: this.state.visiblePosts + 10
		})
		let coordinate = {} //object of coordinates
        let coordinates = [] //array of objects of coordinates

		incidentService.get_active_incidents(this.state.visiblePosts, 10)
		.then (response => {
			if (response.length !== 0)
			{
				this.setState ({
					isloading: false
				})

				this.setState(prevState => ({
					incidents: [...prevState.incidents, ...response]
				}))

				this.state.incidents.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
					/*define the new coordinate */
					coordinate = {}
					coordinate['lat'] = incident.location['latitude']
					coordinate['lng'] = incident.location['longtitude']    
					coordinate['priority'] = incident.priority

					/* Push it to the array of coordinates */
					coordinates.push(coordinate)
				})
				this.setState(prevState => ({
					coordinates: [...prevState.coordinates, ...coordinates]
				}))


			}
			else if(response.length === 0)
			{
				this.setState({
					incidents: [...this.state.incidents],
					postsDone: true,
					isloading: false
				})
			}
		})

	}

	render()
	{
		let incidents = this.state.incidents
		let usertype =  localStorage.getItem("usertype");

		return(
			<div>
				<SideMenu />
				<div className="container">
					<div className="row" style={{marginTop: '10px', marginLeft: '-25%'}}>
						<div className="col-md"></div>
						<div className="col-md">
							<h5>Τρέχοντα Συμβάντα</h5>
						</div>
						<div className="col-md" style={{marginLeft: '10%'}}>
							<button onClick = {this.refresh} className="refresh_btn">Ανανέωση</button>
						</div>
						<div className="col-md"  style={{marginLeft: '10%'}}>
							<h5>Χάρτης Συμβάντων</h5>
						</div>
					</div>
				</div>
				<div className = "hrz_line"  style = {{marginTop: '0.6%'}}></div>
        		<br/><br/><br/>
      			
        		{this.state.isloading && <div className="load-spin"></div>}

				{!this.state.no_posts &&
					<div className = "container-fluid" style={{marginTop: "-20px"}}>	
						<div className = "row">
							<div className = "col-sm-2" style={{marginLeft: '7%'}}>
								<FontAwesomeIcon icon={ faExclamationTriangle } style={{width: '50px', marginTop: '8px'}} />
							</div>
							<div className = "col-lg-2" style={{marginLeft: '-15.5%'}}>
								<p style={{fontSize:'19px'}}>Ημερομηνία</p>
							</div>
							<div className = "col-lg-2" style={{marginLeft: '-5%'}}>
								<p style={{fontSize:'19px'}}>Διεύθυνση</p>
							</div>        			        			
							<div className = "col-lg-1" style={{marginLeft: '4%'}}>
								<p style={{fontSize:'20px'}}>Τίτλος</p>
							</div>    
						</div>
					</div>
				}
				
				{(this.state.coordinates.length > 0 && !this.state.isloading) && (
					<Gmap coordinates = {this.state.coordinates} size={{ width:'35%', height:'65%', marginLeft:'63%', position: 'absolute'}}/>
                )}  

        		{!this.state.no_posts && <div className = 'incident_line' style={{opacity: '1.0'}}></div>}
        		
				{this.state.no_posts ? (
					<div>
						<p><br/><br/><br/>
						Δεν υπάρχουν Διαθέσιμα Συμβάντα
						</p>
						<p>Ανανεώστε τη Σελίδα για να ενημερωθείτε για νέα Συμβάντα</p>
					</div>
				) : ( 
					<div className = "scroll">
						{incidents.map((incident) => { //Loop through every row of the jsonfile and get the attributes
							return (
								<div key = {incident._id}>
									<Incident //Render the same Component with different values each time 
										incident = {incident}
										usertype = {usertype}
										style = {{marginLeft: '14%'}} 
									/>
								</div>
							)     			
						})}
					</div>
				)}

				{!this.state.no_posts && <div className = "inc_line" style= {{position: 'absolute'}}></div>}
				<br/>

				{(!this.state.postsDone && !this.state.no_posts) && //if no more posts left, then dont display
        			(<Button id = "load" className = "loadmore" onClick = {this.loadmore} style = {{position: 'absolute', marginLeft: '25%'}}>Φόρτωση Περισσοτέρων</Button>)}
            </div>
		)
	}
}

export default withRouter(ControlPanel);