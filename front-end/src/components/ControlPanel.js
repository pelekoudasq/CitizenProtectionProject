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
		// this.get_user_response = this.get_user_response.bind(this)
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
				// console.log("Response from control center is",response)
				this.setState({
					incidents: response,
					visiblePosts: this.state.visiblePosts + 9,
					no_posts:false
				})
				
				this.state.incidents.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
						/*define the new coordinate */
						coordinate = {}
						coordinate['lat'] = incident.location['latitude']
						coordinate['lng'] = incident.location['longitude']    
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
				console.log("O naftis exei usertype " ,usertype)
				console.log("Ta peristatika tou nafti einai ", response)
				if(response.incidents && response.incidents.length !==0)
				{
					console.log()
					this.setState({
						incidents: response.incidents,
						visiblePosts: this.state.visiblePosts + 7,
						no_posts:false

					})
					
					this.state.incidents.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
							/*define the new coordinate */
							coordinate = {}
							coordinate['lat'] = incident.location['latitude']
							coordinate['lng'] = incident.location['longitude']    
							coordinate['priority'] = incident.priority
		
							/* Push it to the array of coordinates */
							coordinates.push(coordinate)
						})
		
					this.setState({
						coordinates: coordinates
					})
				}
				else if(response.incidents && response.incidents.length === 0)
				{
					this.setState=({
						no_posts: true,
						postsDone: true
					})
				}
			});	
		}
		else if(Number(usertype) === 1)
		{	
			incidentService.get_department_incidents(this.state.visiblePosts, 9)
			.then( response => {
				console.log("Atpf", response)
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
							coordinate['lng'] = incident.location['longitude']    
							coordinate['priority'] = incident.priority
		
							/* Push it to the array of coordinates */
							coordinates.push(coordinate)
						})
		
					this.setState({
						coordinates: coordinates
					})
				}
				else if(response.length === 0)
				{
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
				let rev_incidents = response
				let incs_temp = this.state.incidents
				let total_incidents = incs_temp.concat(rev_incidents)
				//  [this.state.incidents, rev_incidents]
				
				// console.log(rev_response)
				this.setState({
					incidents: total_incidents
				})

				this.state.incidents.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
					/*define the new coordinate */
					coordinate = {}
					coordinate['lat'] = incident.location['latitude']
					coordinate['lng'] = incident.location['longitude']    
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
				{!this.state.no_posts &&
					<div className="container">
						<div className="row" style={{marginTop: '10px', marginLeft: '4%'}}>
							<div className="col-md-6 text-center my-0">
								<h5>Τρέχοντα Συμβάντα</h5>
							</div>
							<div className="col-md-3 offset-sm-3 text-right my-0">
								<h5>Χάρτης Συμβάντων</h5>
							</div>
						</div>
					</div>
				}
				{ !this.state.no_posts && <div className = "hrz_line mt-0"></div>}

      			
        		{this.state.isloading && <div className="load-spin"></div>}

				{!this.state.no_posts &&
					<div className = "container-fluid ml-5 mt-2"  style={{width: '96%'}}>	
						<div className = "row ml-1">
							<div className = "col-sm-1 align-self-center" >
								<FontAwesomeIcon icon={ faExclamationTriangle } style={{width: '50px', marginTop: '8px', float: 'right'}}/>
							</div>
							<div className = "col-sm-1 align-self-center">
								<p style={{fontSize:'19px', marginBottom: '0'}} className="text-center">Ημερομηνία</p>
							</div>
							<div className = "col-sm-2 pl-5 mr-5 align-self-center">
								<p style={{fontSize:'19px', marginBottom: '0'}}>Διεύθυνση</p>
							</div>        			        			
							<div className = "col-sm-1 ml-5 mr-4 align-self-center">
								<p style={{fontSize:'19px', marginBottom: '0'}} className="text-right ">Τίτλος</p>
							</div>
							<div className="col-lg-1 align-self-center" style={{marginLeft: "2%"}}>
								<button onClick = {this.refresh} className="refresh_btn"></button>
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
						<h4 className='text-center'><br/><br/><br/>
						Δεν υπάρχουν Διαθέσιμα Συμβάντα
						</h4>
						<h4 className='text-center'>Ανανεώστε τη Σελίδα για να ενημερωθείτε για νέα Συμβάντα</h4>
						<div className='text-center'>
							<button onClick = {this.refresh} className="refresh_btn"></button>
						</div>

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
        			(<Button id = "load" className = "loadmore" onClick = {this.loadmore} style = {{position: 'absolute', marginLeft: '27%'}}>Φόρτωση Περισσοτέρων</Button>)}
            </div>
		)
	}
}

export default withRouter(ControlPanel);