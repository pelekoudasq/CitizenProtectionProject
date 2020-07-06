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
			no_result: false
		}
		this.loadmore = this.loadmore.bind(this)
		this.apply_filter = this.apply_filter.bind(this);	
		this.filterPriority = this.filterPriority.bind(this);
		this.filterState = this.filterState.bind(this);
	}	

	componentDidMount()
	{	
        let coordinate = {}; //object of coordinates
        let coordinates = [] //array of objects of coordinates

		incidentService.get_active_incidents(this.state.visiblePosts, 8)
		.then( response => {
			this.setState({
				incidents: response,
				visiblePosts: this.state.visiblePosts + 8
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
			visiblePosts: this.state.visiblePosts + 8
		})

		let coordinate = {} //object of coordinates
        let coordinates = [] //array of objects of coordinates

		incidentService.get_active_incidents(this.state.visiblePosts, 8)
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
	
	handleTextArea = event => {
        const {name,value} = event.target;
        this.setState({
            [name]: value
        })
	};

	apply_filter(event) 
	{
		console.log(this.state.filter_text)
		console.log(this.state.filter_priority)
		console.log(this.state.filter_status)
		console.log(this.state.filter_start_date)
		console.log(this.state.filter_end_date)

		this.setState({
			isloading: true,
			no_result: false
		})

		let coordinate = {} //object of coordinates
        let coordinates = [] //array of objects of coordinates

		incidentService.get_filtered_incidents(this.state.filter_text, this.state.filter_priority, this.state.filter_status, this.state.filter_date)
		.then (response => {
			if (response.length !== 0)
			{
				this.setState ({
					isloading: false
				})

				this.setState({
					incidents: response
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
					coordinates: coordinates,
					postsDone: true
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

	render()
	{
		let incidents = this.state.incidents
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
							<h5 className = "head_ltitleInfo">Ιστορικό Συμβάντων</h5>
						</div>

						<div className="col-md-3">	
							<form onSubmit={this.apply_filter}> 
								<input type="text" value={this.state.filter_text} onChange={this.handleTextArea} name="filter_text" placeholder="Αναζήτηση Συμβάντων. . ." id = "search_bar" style={{width: '80%', marginTop: '-5px'}}></input>																
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
									<CustomInput type="checkbox" id="6" label="Όλα"  onClick={this.filterState.bind(this, "5")}/>
								</div>
							</FormGroup>
							</Col>
							<br/><br/><br/><br/>
							<h6>Ημερομηνία</h6>
							<div>
								<TextField
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
					</div>
				</div>      			

				<div className = "vertical_line"></div>
	
				{this.state.no_result ? (<p>Δε βρέθηκαν Αποτελέσματα στην Αναζήτησή σας</p>) : ( 
					<div className = "container-fluid">	
						<div className = "row">
							<div className = "col-sm-2" style={{marginLeft: '19%'}}>
								<FontAwesomeIcon icon={ faExclamationTriangle } style={{width: '50px', marginTop: '15px'}} />
							</div>
							<div className = "col-lg-2" style={{marginLeft: '-11%'}}>
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
				)}

				{(this.state.coordinates.length > 0 && !this.state.isloading && !this.state.no_result) && (
					<Gmap coordinates = {this.state.coordinates} size={{ width:'25%', height:'55%', marginLeft:'73%', position: 'absolute'}}/>
				)}  

				<div className = 'incidents_line' style={{opacity: '1.0'}}></div>
					
				{!this.state.no_result && ( 
					<div className = "scrolls">
						{incidents.map((incident) => {//Loop through every row of the json file and get the attributes
							return (
								<div key = {incident._id}>
									<Incident // Render the same Component with different values each time 
										incident = {incident}
										style = {{marginLeft: '28%'}} 
									/>
								</div>
							)     			
						})}	
					</div>
				)}

				{!this.state.no_result && (<div className = "incs_line"></div>)}
				<br/>

				{(!this.state.postsDone) && //if no more posts left, the dont display
					(<Button id = "load" className = "loadmore" onClick = {this.loadmore} style = {{position: 'absolute', marginLeft: '35%'}}>Φόρτωση Περισσοτέρων</Button>
				)}

			</div>
		)
	}
}

export default Incidents