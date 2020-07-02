import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import '../css/incidents.css';
import SideMenu from './SideMenu'
import { Button }from 'reactstrap'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import Incident from './Incident'
import Gmap from './Gmap'

import { incidentService } from '../services/incidents.service';

class Incidents extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			incidents: [],
			showModal: false,
			coordinates: [],
			visiblePosts: 5,
			isloading: false,
		}
		this.loadmore = this.loadmore.bind(this)
		
	}	

	componentDidMount()
	{	
        let coordinate = {}; //object of coordinates
        let coordinates = [] //array of objects of coordinates

		incidentService.get_incidents(this.state.visiblePosts, 5)
		.then( response => {
			this.setState({
				incidents: response,
			})
			//console.log(this.state.incidents)
			
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

	sleep(ms) 
	{
	    return new Promise(resolve => setTimeout(resolve, ms));
   	}

	async loadmore()
	{
		this.setState({
			isloading: true
		})
		this.setState((prev) => {
			return {visiblePosts: prev.visiblePosts + 5}
		})

		incidentService.get_incidents(this.state.visiblePosts, 5)
		.then (response => {
			if (response.title !== null)
			{
				console.log("Beo sto if")
				this.setState ({
					isloading: false
				})
				this.setState(prevState => ({
					incidents: [...prevState.incidents, response]
				}))
			}
			else
			{
				this.setState(prevState => ({
					incidents: [prevState.incidents]
				}))
			}
		})

	}


	render()
	{
		let incidents = this.state.incidents
		return(
			<div className = "hide-scroll">
        		<SideMenu/>
		        <h5 className = "head_ltitle">Τρέχοντα Συμβάντα</h5>
		        <h5 className = "head_rtitle">Χάρτης Συμβάντων</h5>
        		<div className = "hrz_line"></div>
        		<br/><br/><br/>
				
        		{this.state.isloading &&
                    <div className="load-spin"></div>
                }

				<div className = "container-fluid" style={{marginLeft: '7.2%'}}>	
        		<div className = "row">
        			<div className = "col-sm-1">
        				<FontAwesomeIcon icon={ faExclamationTriangle } style={{width: '50px', marginTop: '15px'}} />
        			</div>
        			<div className = "col-lg-2">
        				<p style={{fontSize:'22px'}}>Ημερομηνία</p>
        			</div>
        			<div className = "col-lg-2">
        				<p style={{fontSize:'22px'}}>Διεύθυνση</p>
        			</div>        			        			
        			<div className = "col-lg-1">
        				<p style={{fontSize:'23px'}}>Τίτλος</p>
        			</div>    
        		</div>
				</div>
				
				{this.state.coordinates.length > 0 && !this.state.isloading ? (
					<Gmap coordinates = {this.state.coordinates.slice(0, this.state.visiblePosts)} />
                ) : (
                   <p> </p>
                )}  
        		<div className = 'incident_line' style={{opacity: '1.0'}}></div>
        		
        		<div className = "scroll">
		    		{incidents.slice(0, this.state.visiblePosts).map((incident, index) => { /*Loop through every row of the jsonfile and get the attributes*/
		    			return (
		    				<div key = {incident._id}>
		        				<Incident /* Render the same Component with different values each time */
		       						incident = {incident}
								/>
							</div>
						)     			
		    		})}
				</div>
				<div className = "inc_line" style= {{position: 'absolute'}}></div>
				<br/>

				{(incidents.length > 5 && incidents.length > this.state.visiblePosts) ?
        			(<Button id = "load" className = "loadmore" onClick = {this.loadmore} style = {{position: 'absolute', marginLeft: '25%'}}>Φόρτωση Περισσοτέρων</Button>
        			) : (
        			<p></p>
        		)}
				<div className="row ml-4 pl-5"  style={{position: 'absolute'}}>
					<div class="col-sm-2 py-1 pr-0">
						<br/>
						<h5>Φίλτρα</h5>
						<div class="dropdown-divider"></div>
						<form>
							<br/>
							Προτεραιότητα
							<div class="dropdown-divider"></div>
							<div className="form-check">
								<input type="checkbox" className="form-check-input" id="prio-1"/>
								<label className="form-check-label" for="prio-1">Υψηλή</label>
								<br/>
								<input type="checkbox" className="form-check-input" id="prio-2"/>
								<label className="form-check-label" for="prio-2">Μεσαία</label>
								<br/>
								<input type="checkbox" className="form-check-input" id="prio-3"/>
								<label className="form-check-label" for="prio-3">Χαμηλή</label>
							</div>
							<br/>
							Κατάσταση
							<div class="dropdown-divider"></div>
							<div className="form-check">
								<input type="checkbox" className="form-check-input" id="state-1"/>
								<label className="form-check-label" for="state-1">Εκκρεμή</label>
								<br/>
								<input type="checkbox" className="form-check-input" id="state-2"/>
								<label className="form-check-label" for="state-2">Κλειστά</label>
							</div>
							<br/>
							Ημερομηνία
							<div class="dropdown-divider"></div>
							<input type="date" id="birthday" name="birthday"/>
							<button type="submit" className="btn btn-primary">Αναζήτηση</button>
							<br/>
						</form>
					</div>
				</div>      			
			</div>
		)
	}
}

export default Incidents