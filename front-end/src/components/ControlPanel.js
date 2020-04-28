import React, {Component} from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
// import { Link } from 'react-router-dom'
import '../css/controlpanel.css'
import SideMenu from './SideMenu'
import Incident from './Incident'
import { withRouter } from 'react-router'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class ControlPanel extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			incidents: [ ],
			showModal:false
		}

	}	

	authHeader() 
	{
	    // return authorization header with jwt token
	    const token = localStorage.getItem('token');
	    if (token) {
	    	console.log(token)
	        return { Authorization: `Bearer ${token}` };
	    } 
	    else 
	    {
	        return {};
	    }
	}


	componentDidMount()
	{	
		let requestOptions = {
            method: 'GET',
            headers: this.authHeader(),

        }

		fetch(`https:localhost:9000/incidents/all`, requestOptions)
            .then(response => response.json())
            .then(json => {

            	this.setState({
            		incidents: json
            	})
            	console.log(this.state.incidents)
        	});	
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

        		<div className = "row">
        			<div className = "col-md-1" style={{marginLeft: '8%'}}>
        				<FontAwesomeIcon icon={ faExclamationTriangle } style={{width: '50px', marginTop: '15px'}} />
        			</div>
        			<div className = "col-lg-2">
        				<p style={{fontSize:'25px'}}>Ημερομηνία</p>
        			</div>
        			<div className = "col-lg-2">
        				<p style={{fontSize:'25px'}}>Διεύθυνση</p>
        			</div>        			        			
        			<div className = "col-lg-1">
        				<p style={{fontSize:'25px'}}>Τίτλος</p>
        			</div>    
        		</div>
        		<div className = 'incident_line' style={{opacity: '1.0'}}></div>

        		{incidents.map((incident, index) => { /*Loop through every row of the jsonfile and get the attributes*/
        			return (
        				<li key = {incidents.id}>
	        				<Incident /* Render the same Component with different values each time */
	        					key = {incidents.id}
	        					priority = {incident.priority} 
	        					date ={incident.date}
	        					location = {incident.location['address']}
	        					title = {incident.title}
							/>
						</li>
					)     			
        		})}
                />
			</div>
			)
	}
}

export default withRouter(ControlPanel);