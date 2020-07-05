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
			postsDone: false
		}
		this.loadmore = this.loadmore.bind(this)
	}	


	componentDidMount()
	{	
        let coordinate = {}; //object of coordinates
        let coordinates = [] //array of objects of coordinates

		incidentService.get_active_incidents(this.state.visiblePosts, 6)
		.then( response => {
			this.setState({
				incidents: response,
				visiblePosts: this.state.visiblePosts + 6
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

	loadmore()
	{
		this.setState({
			isloading: true
		})
		this.setState({
			visiblePosts: this.state.visiblePosts + 6
		})
		let coordinate = {} //object of coordinates
        let coordinates = [] //array of objects of coordinates

		incidentService.get_active_incidents(this.state.visiblePosts, 6)
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
		return(
			<div>
				<SideMenu /> 
		        <h5 className = "head_ltitle">Τρέχοντα Συμβάντα</h5>
		        <h5 className = "head_rtitle">Χάρτης Συμβάντων</h5>
        		<div className = "hrz_line"></div>
        		<br/><br/><br/>
      			
        		{this.state.isloading && <div className="load-spin"></div>}

				<div className = "container-fluid">	
					<div className = "row">
						<div className = "col-sm-2">
							<FontAwesomeIcon icon={ faExclamationTriangle } style={{width: '50px', marginTop: '15px', marginLeft: '50%'}} />
						</div>
						<div className = "col-lg-2" style={{marginLeft: '-4%'}}>
							<p style={{fontSize:'22px'}}>Ημερομηνία</p>
						</div>
						<div className = "col-lg-2" style={{marginLeft: '-4%'}}>
							<p style={{fontSize:'22px'}}>Διεύθυνση</p>
						</div>        			        			
						<div className = "col-lg-1" style={{marginLeft: '4%'}}>
							<p style={{fontSize:'23px'}}>Τίτλος</p>
						</div>    
					</div>
				</div>
				
				{(this.state.coordinates.length > 0 && !this.state.isloading) && (
					<Gmap coordinates = {this.state.coordinates} size={{ width:'35%', height:'65%', marginLeft:'63%', position: 'absolute'}}/>
                )}  
        		<div className = 'incident_line' style={{opacity: '1.0'}}></div>
        		
        		<div className = "scroll">
		    		{incidents.map((incident) => { //Loop through every row of the jsonfile and get the attributes
		    			return (
		    				<div key = {incident._id}>
		        				<Incident //Render the same Component with different values each time 
									incident = {incident}
									style = {{marginLeft: '14%'}}   
								/>
							</div>
						)     			
		    		})}
				</div>
				<div className = "inc_line" style= {{position: 'absolute'}}></div>
				<br/>

				{(!this.state.postsDone) && //if no more posts left, the dont display
        			(<Button id = "load" className = "loadmore" onClick = {this.loadmore} style = {{position: 'absolute', marginLeft: '25%'}}>Φόρτωση Περισσοτέρων</Button>)}
            </div>
		)
	}
}

export default withRouter(ControlPanel);