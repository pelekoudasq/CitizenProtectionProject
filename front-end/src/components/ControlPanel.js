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

class ControlPanel extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			incidents: [],
			showModal: false,
			coordinates: [],
			visiblePosts: 5,
			isloading: false

		}
		this.loadmore = this.loadmore.bind(this)
		
	}	

	authHeader() 
	{
	    // return authorization header with jwt token
	    const token = localStorage.getItem('token');
	    if (token) {
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

        let coordinate = {}; //object of coordinates
        let coordinates = [] //array of objects of coordinates

		fetch(`https:localhost:9000/incidents/all`, requestOptions)
            .then(response => response.json())
            .then(response => {

            	this.setState({
            		incidents: response,
            	})
            	//console.log(this.state.incidents)
            	
            	this.state.incidents.map(incident => { /*Loop through every row of the jsonfile and get the attributes*/
						/*define the new coordinate */
        				coordinate = {}
						coordinate['lat'] = incident.location['latitude']
						coordinate['lng'] = incident.location['longtitude']    
						coordinate['priority'] = incident.priority

						/* Push it to the array of coordinates */
						coordinates.push(coordinate)
		    		})

            	console.log(this.state.incidents[0].location.address);
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

		await this.sleep(300).then(() => {

			this.setState ({
				isloading: false
			})
			this.setState((prev) => {
				return {visiblePosts: prev.visiblePosts + 5}
			})
		})

	}


	render()
	{
		let incidents = this.state.incidents
		return(
			<div className = "hide-scroll">
				<SideMenu /> 
		        <h5 className = "head_ltitle">Τρέχοντα Συμβάντα</h5>
		        <h5 className = "head_rtitle">Χάρτης Συμβάντων</h5>
        		<div className = "hrz_line"></div>
        		<br/><br/><br/>
      			
        		{this.state.isloading ?
                    <div className="load-spin"></div> : console.log("")
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

                </div>
		)
	}
}

export default withRouter(ControlPanel);