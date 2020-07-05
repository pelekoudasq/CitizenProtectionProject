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
			visiblePosts: 5,
			isloading: false,
			query: React.createRef(), //represents the text based query of the user
			filter_date: React.createRef(),
			filter_priority: [],
			filter_state: [] //true holds for pending incidents, false holds for closed
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

		incidentService.get_active_incidents(this.state.visiblePosts, 7)
		.then( response => {
			this.setState({
				incidents: response,
				visiblePosts: this.state.visiblePosts + 7
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

	apply_filter(event) //Generic function for
	{
		// const {name, value, type, checked} = event.target
		// type==="checkbox" ? this.setState this.setState({
		// 	[name]: value
		// })
	}

	loadmore()
	{
		this.setState({
			isloading: true
		})
		this.setState({
			visiblePosts: this.state.visiblePosts + 7
		})

		let coordinate = {} //object of coordinates
        let coordinates = [] //array of objects of coordinates

		incidentService.get_active_incidents(this.state.visiblePosts, 7)
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
        if(this.state.filter_state.indexOf(newChecked) === -1){
            new_state = [...this.state.filter_state, newChecked];
        }
        else
        {     
            let index = this.state.filter_state.indexOf(newChecked);
			if (index !== -1) 
				this.state.filter_state.splice(index, 1);
            new_state = this.state.filter_state
        }

        if(Object.keys(new_state).length > 0)            
        {
            this.setState({
                filter_state: new_state
            });
        }
        else
        {
            this.setState({
                filter_state: new_state
            });
        }
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
							<form>
								<input type="search" placeholder="Αναζήτηση Συμβάντων. . ." id = "search_bar" style={{width: '80%', marginTop: '-5px'}}></input>																
							</form>
						</div>
					</div>
				</div>
        		<div className = "hrz_lineBack" style = {{marginTop: '2px'}}></div>	

        		{this.state.isloading &&
                    <div className="load-spin"></div>
                }

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
								<div innerref={this.state.filter_state}> 
									<CustomInput type="checkbox" id="4" label="Κλειστά" onClick={this.filterState.bind(this, "4")} />
									<CustomInput type="checkbox" id="5" label="Εκκρεμή"  onClick={this.filterState.bind(this, "5")}/>
									<CustomInput type="checkbox" id="6" label="Όλα"  onClick={this.filterState.bind(this, "5")}/>
								</div>
							</FormGroup>
							</Col>
							<br/><br/><br/><br/>
							<h6>Ημερομηνία</h6>
							<form noValidate>
							<TextField
								id="date"
								label="Birthday"
								type="date"
								defaultValue="2017-05-24"
								InputLabelProps={{
								shrink: true,
								}}
							/>
							</form>
							<br/>
							<button type="submit" className="btn btn-primary">Αναζήτηση</button>
						</Row>
						</Form>
					</div>
				</div>      			

				<div className = "vertical_line"></div>
	
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
				
				{(this.state.coordinates.length > 0 && !this.state.isloading) && (
					<Gmap coordinates = {this.state.coordinates} size={{ width:'25%', height:'55%', marginLeft:'73%', position: 'absolute'}}/>
				)}  

				<div className = 'incidents_line' style={{opacity: '1.0'}}></div>
				
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

				<div className = "incs_line"></div>
				<br/>

				{(!this.state.postsDone) && //if no more posts left, the dont display
					(<Button id = "load" className = "loadmore" onClick = {this.loadmore} style = {{position: 'absolute', marginLeft: '35%'}}>Φόρτωση Περισσοτέρων</Button>
				)}
			</div>
		)
	}
}

export default Incidents