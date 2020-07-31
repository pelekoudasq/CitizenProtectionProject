import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import '../css/incidents.css'
import '../css/incidentshistory.css'
import SideMenu from './SideMenu'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import Incident from './Incident'
import Gmap from './Gmap'
import { CustomInput, Col, Row, Button, Form, FormGroup, Label} from 'reactstrap'
import { TextField } from '@material-ui/core';
import Clear from '../icons/clear_filter.png'

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
			visiblePosts: 0,
			isloading: false,
			filter_text: "", //represents the text based query of the user
			filter_start_date: "" ,
			filter_end_date:"",
			filter_priority: [],
			filter_status: [], //true holds for pending incidents, false holds for closed
			filter_auth: [],
			no_result: false,
			no_posts: true,
			postsDone: false
		}
		this.loadmore = this.loadmore.bind(this)
		this.apply_filter = this.apply_filter.bind(this);	
		this.filterPriority = this.filterPriority.bind(this);
		this.filterState = this.filterState.bind(this);
		this.clear_filters = this.clear_filters.bind(this);
		this.handleAuthState = this.handleAuthState.bind(this);
		
	}	

	componentDidMount()
	{	
        let coordinate = {}; //object of coordinates
		let coordinates = [] //array of objects of coordinates
		let usertype =  localStorage.getItem("usertype");
		let auth_type = localStorage.getItem("authoritytype")

		if (Number(usertype) === 0 || (Number(usertype) === 3 && auth_type === "null"))//api call for control center
		{	
			incidentService.get_all_incidents(this.state.visiblePosts, 9)
			.then( response => {
				this.setState({
					incidents: response,
					no_posts: false,
					visiblePosts: this.state.visiblePosts + 8
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
		else if(Number(usertype) === 2 ) //api call for employees
		{	
			incidentService.get_user_accepted_incidents()
			.then( response => {
				if(response.length !==0)
				{
					this.setState({
						incidents: response.incidents.reverse(),
						no_posts: false
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
		else if(Number(usertype) === 1) //api call for authorities departments
		{	
			incidentService.get_all_department_incidents()
			
			.then( response => {
				if(response.length !==0)
				{
					this.setState({
						incidents: response,
						no_posts: false
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
		else if(Number(usertype) === 3)
		{
			let temp_incidents = []
			incidentService.get_all_incidents(this.state.visiblePosts, 100)
			.then( response => {
				response.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
					if(incident.auth.includes(Number(auth_type)))
					{
						coordinate = {}
						coordinate['lat'] = incident.location['latitude']
						coordinate['lng'] = incident.location['longitude']    
						coordinate['priority'] = incident.priority

						/* Push it to the array of coordinates */
						coordinates.push(coordinate)
						temp_incidents.push(incident)
					}
				})
				this.setState({
					coordinates: coordinates,
					postsDone: true,
					incidents: temp_incidents,
					isloading: false,
					no_posts: false
				})
			});	
		}
	}

	loadmore()
	{
		this.setState({
			isloading: true
		})
		this.setState({
			visiblePosts: this.state.visiblePosts + 9
		})

		let coordinate = {} //object of coordinates
        let coordinates = [] //array of objects of coordinates

		incidentService.get_all_incidents(this.state.visiblePosts, 9)
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
					incidents: total_incidents,
					postDone: false
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

	filterPriority(buttonName) 
	{
		let newChecked = `${buttonName}`;
        let new_priority = [];
        if(this.state.filter_priority.indexOf(newChecked) === -1){
            new_priority = [...this.state.filter_priority, newChecked];
        }
        else
        {     
            let index = this.state.filter_priority.indexOf(newChecked);
			if (index !== -1) 
				this.state.filter_priority.splice(index, 1);
            new_priority = this.state.filter_priority
        }

        if(Object.keys(new_priority).length > 0)            
        {
            this.setState({
                filter_priority: new_priority
            });
        }
        else
        {
            this.setState({
                filter_priority: new_priority
            });
        }
	}
	
	filterState(buttonName) 
	{
		let newChecked = `${buttonName}`;
        let new_state = [];
        if(this.state.filter_status.indexOf(newChecked) === -1){
            new_state = [...this.state.filter_status, newChecked];
        }
        else
        {     
            let index = this.state.filter_status.indexOf(newChecked);
			if (index !== -1) 
				this.state.filter_status.splice(index, 1);
            new_state = this.state.filter_status
        }

        if(Object.keys(new_state).length > 0)            
        {
            this.setState({
                filter_status: new_state
            });
        }
        else
        {
            this.setState({
                filter_status: new_state
            });
        }
	}
	handleAuthState(buttonName) 
	{
		let newChecked = `${buttonName}`;
        let new_state = [];
        if(this.state.filter_auth.indexOf(newChecked) === -1){
            new_state = [...this.state.filter_auth, newChecked];
        }
        else
        {     
            let index = this.state.filter_auth.indexOf(newChecked);
			if (index !== -1) 
				this.state.filter_auth.splice(index, 1);
            new_state = this.state.filter_auth
        }

        if(Object.keys(new_state).length > 0)            
        {
            this.setState({
                filter_auth: new_state
            });
        }
        else
        {
            this.setState({
                filter_auth: new_state
            });
        }
	}
	
	handleTextArea = event => {
        const {name,value} = event.target;
        this.setState({
            [name]: value
        })
	};

	apply_filter(event) 
	{		
		this.setState({
			isloading: true,
			no_result: false
		})

		let coordinate = {} //object of coordinates
		let coordinates = [] //array of objects of coordinates
		let usertype =  localStorage.getItem("usertype");
		let user_id = localStorage.getItem("userid");
		let auth_type = localStorage.getItem("authoritytype")
		let temp_incidents = []

		// console.log("filtra auth einai ", this.state.filter_auth)
		incidentService.get_filtered_incidents(this.state.filter_text, this.state.filter_priority, this.state.filter_status, this.state.filter_auth ,this.state.filter_start_date,  this.state.filter_end_date)
		.then (response => {
			// console.log("response without filter is ", response)
			if (response.length !== 0)
			{
				response.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
					if (Number(usertype) === 0 || (Number(usertype) === 3 && auth_type === "null"))
					{
						coordinate = {}
						coordinate['lat'] = incident.location['latitude']
						coordinate['lng'] = incident.location['longitude']    
						coordinate['priority'] = incident.priority

						/* Push it to the array of coordinates */
						coordinates.push(coordinate)
						temp_incidents.push(incident)
					}
					else if(Number(usertype) === 2 || Number(usertype) === 1)
					{
						if((incident.auth.includes(0) && incident.officers.includes(user_id)) || (incident.auth.includes(0) && incident.departments.includes(user_id)) ||
						(incident.auth.includes(1) && incident.officers.includes(user_id)) || (incident.auth.includes(1) && incident.departments.includes(user_id)) ||
						(incident.auth.includes(2) && incident.officers.includes(user_id)) || (incident.auth.includes(2) && incident.departments.includes(user_id)) ||
						(incident.auth.includes(3) && incident.officers.includes(user_id)) || (incident.auth.includes(3) && incident.departments.includes(user_id)))
						{
							coordinate = {}
							coordinate['lat'] = incident.location['latitude']
							coordinate['lng'] = incident.location['longitude']    
							coordinate['priority'] = incident.priority

							/* Push it to the array of coordinates */
							coordinates.push(coordinate)
							temp_incidents.push(incident)
						}
					}
					else if((Number(usertype) === 3))
					{
						if(incident.auth.includes(Number(auth_type)))
						{
							coordinate = {}
							coordinate['lat'] = incident.location['latitude']
							coordinate['lng'] = incident.location['longitude']    
							coordinate['priority'] = incident.priority
	
							/* Push it to the array of coordinates */
							coordinates.push(coordinate)
							temp_incidents.push(incident)
						}
					}

				})
				// console.log("incidents after filter are ", temp_incidents)
				this.setState({
					coordinates: coordinates,
					postsDone: true,
					incidents: temp_incidents,
					isloading: false
				})


			}
			else if(response.length === 0)
			{
				this.setState({
					postsDone: true,
					isloading: false,
					no_result: true
				})
			}
		})

		event.preventDefault();
	}

	clear_filters()
	{
		this.setState({
			filter_status: [],
			filter_start_date: "" ,
			filter_end_date:"",
			filter_priority: []
		})
	}

	refresh()
	{
		window.location.reload(false);
	}

	render()
	{
		let incidents = this.state.incidents
		let usertype =  localStorage.getItem("usertype")
		let auth_type = localStorage.getItem("authoritytype")

		return(
			<div>
        		<SideMenu/>
				<div className = "container-fluid">
					<div className = "row">
						<div className = "col-md-3">
							<Link to="/">
							<button className="btn btn-link" >
							<FontAwesomeIcon className="iconBack" icon={ faArrowLeft }/>
							</button>
							</Link>
							<h5 className = "head_ltitleInfo">Φίλτρα</h5>
						</div>
						
						<div className = "col-md-5">
							<h5  style={{marginTop: '6px', marginLeft: '27%'}}>Ιστορικό Συμβάντων</h5>
						</div>

						<div className="col-md-3">	
							<form onSubmit={this.apply_filter}> 
								<input type="text" value={this.state.filter_text} onChange={this.handleTextArea} name="filter_text" placeholder="Αναζήτηση Συμβάντων. . ." id = "search_bar" style={{width: '90%', marginTop: '0px', marginLeft:'25%'}}></input>																
							</form>
						</div>
					</div>
				</div>
        		<div className = "hrz_lineBack" style = {{marginTop: '2px'}}></div>	

        		{this.state.isloading && <div className="load-spin"></div>}

				<br/>
				<div className="row ml-4 pl-5"  style={{position: 'absolute'}}>
					<div className="col-sm-2 py-1 pr-0" style={{position: 'absolute',  marginLeft: '50%', marginTop: '-40%'}}>
						<div className="dropdown-divider"></div>
						<fieldset disabled={this.state.no_posts}>
						<Form>
						<Row >
							<Col sm={4} style={{marginLeft: '-35%'}}>
								<FormGroup>
								<Label><h6 style={{marginLeft: '-5%'}}>Προτεραιότητα</h6></Label>
								<div innerref={this.state.filter_priority}> 
									<CustomInput type="checkbox" id="1" label="Χαμηλή" onClick={this.filterPriority.bind(this, "1")} />
									<CustomInput type="checkbox" id="2" label="Μέτρια"  onClick={this.filterPriority.bind(this, "2")}/>
									<CustomInput type="checkbox" id="3" label="Υψηλή"  onClick={this.filterPriority.bind(this, "3")}/>
								</div>
								</FormGroup>
							</Col>
							<Col sm={4} style={{marginLeft: '-50%'}}>
							<FormGroup>
								<Label><h6>Κατάσταση</h6></Label>
								<div innerref={this.state.filter_status}> 
									<CustomInput type="checkbox" id="4" label="Κλειστά" onClick={this.filterState.bind(this, "4")} />
									<CustomInput type="checkbox" id="5" label="Εκκρεμή"  onClick={this.filterState.bind(this, "5")}/>
									<CustomInput type="checkbox" id="6" label="Όλα"  onClick={this.filterState.bind(this, "6")}/>
								</div>
							</FormGroup>
							</Col>
							{(Number(usertype) === 0 || (Number(usertype) === 3 && auth_type === "null")) && // Only Control Center and Goverment Employees may filter incidents by authorities
							<Col sm={6} style={{marginLeft: '-49%'}}>
                                <FormGroup>
									<Label><h6>Φορείς</h6></Label>
									<div innerref={this.state.filter_auth}> 
										<CustomInput type="checkbox" id="7" label="Ε.Κ.Α.Β." onClick={this.handleAuthState.bind(this, "7")}/>
										<CustomInput type="checkbox" id="8" label="ΕΛ.ΑΣ."  onClick={this.handleAuthState.bind(this, "8")}/>
										<CustomInput type="checkbox" id="9" label="Λιμενικό"  onClick={this.handleAuthState.bind(this, "9")}/>
										<CustomInput type="checkbox" id="10" label="Πυρoσβεστική"  onClick={this.handleAuthState.bind(this, "10")}/>
									</div>
                                </FormGroup>
                        	</Col>}
							<br/><br/><br/><br/>
							<div className="row">
								<div className="col-md-5">
									<h6>Ημερομηνία</h6>
								</div>
								<div className="col-md-5">
									<img src={Clear} alt='' className = "clear_filter_icon" onClick={this.clear_filters}/>
								</div>
							</div>
							<div>
								<TextField
									style={{width: "90%"}}
									id="start_date"
									label="Από"
									value={this.state.filter_start_date}
									name="filter_start_date"
									type="date"
									onChange={this.handleTextArea}
									InputLabelProps={{ //value={this.state.filter_text} onChange={this.handleTextArea} name="filter_text"
									shrink: true,
									}}
								/>
							</div>
							<br/>
							<div>
							<TextField
								style={{width: "90%"}}
								id="end_date"
								label="Έως"
								type="date"
								value={this.state.filter_end_date}
								name="filter_end_date"
								onChange={this.handleTextArea}
								InputLabelProps={{
								shrink: true,
								}}
							/>
							</div>
							<br/>
							<button type="submit" className="btn btn-primary" onClick={this.apply_filter}>Αναζήτηση</button>
						</Row>
						</Form>
						</fieldset>
					</div>
				</div>      			

				<div className = "vertical_line"></div>
	
				{this.state.no_result && (<p>Δε βρέθηκαν Αποτελέσματα στην Αναζήτησή σας</p>)}
				
				{(!this.state.no_posts && !this.state.no_result) && ( 
					<div className = "container-fluid">	
						<div className = "row">
							<div className = "col-sm-2" style={{marginLeft: '19%'}}>
								<FontAwesomeIcon icon={ faExclamationTriangle } style={{width: '50px', marginTop: '8px'}} />
							</div>
							<div className = "col-lg-2" style={{marginLeft: '-15.5%'}}>
								<p style={{fontSize:'19px'}}>Ημερομηνία</p>
							</div>
							<div className = "col-lg-2" style={{marginLeft: '-5%'}}>
								<p style={{fontSize:'19px'}}>Διεύθυνση</p>
							</div>        			        			
							<div className = "col-lg-1" style={{marginLeft: '3%'}}>
								<p style={{fontSize:'20px'}}>Τίτλος</p>
							</div>    
						</div>
						<div className = 'incidents_line' style={{opacity: '1.0'}}></div>
					</div>
				)}

				{(this.state.coordinates.length > 0 && !this.state.isloading && !this.state.no_result) && (
					<Gmap coordinates = {this.state.coordinates} size={{ width:'30%', height:'60%', marginLeft:'69%', position: 'absolute'}}/>
				)}  
				{this.state.no_posts && (
					<div>
						<h4 className='text-center'><br/><br/><br/>
						Δεν υπάρχουν Διαθέσιμα Συμβάντα
						</h4>
						<h4 className='text-center'>Ανανεώστε τη Σελίδα για να ενημερωθείτε για νέα Συμβάντα</h4>
						<div className='text-center'>
							<button onClick = {this.refresh} className="refresh_btn"></button>
						</div>

					</div>
				)}	
				{!this.state.no_result && !this.state.no_posts && ( 
					<div className = "scrolls">
						{incidents.map((incident) => {//Loop through every row of the json file and get the attributes
							return (
								<div key = {incident._id}>
									<Incident // Render the same Component with different values each time 
										incident = {incident}
										style = {{marginLeft: '30%'}} 
									/>
								</div>
							)     			
						})}	
					</div>
				)}

				{!this.state.no_result && !this.state.no_posts && (<div className = "incs_line"></div>)}
				<br/>

				{((!this.state.postsDone) &&(!this.state.no_posts) && ((Number(usertype) === 0 || Number(usertype) === 3 ))) && //if no more posts left, then dont display
					(<Button id = "load" className = "loadmore" onClick = {this.loadmore} style = {{position: 'absolute', marginLeft: '36%', marginTop: '1%'}}>Φόρτωση Περισσοτέρων</Button>
				)}

			</div>
		)
	}
}

export default Incidents