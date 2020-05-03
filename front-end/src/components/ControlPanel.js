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
			visiblePosts: 4,
			isloading: false

		}
		this.loadmore = this.loadmore.bind(this)
		this.handleClick = this.handleClick.bind(this)
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

	handleClick()
	{
		this.props.history.push('/incidents')
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
      			
        		{this.state.isloading ?
                    <div className="load-spin"></div> : console.log("")
                }


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
        		

               	{this.state.coordinates.length > 0 && !this.state.isloading ? (
					<Gmap coordinates = {this.state.coordinates.slice(0, this.state.visiblePosts)} />
                ) : (
                   <p> </p>
                )}  

        		<div className = "scroll">
		    		{incidents.slice(0, this.state.visiblePosts).map((incident, index) => { /*Loop through every row of the jsonfile and get the attributes*/
		    			return (
		    				<div key = {incidents.id}>
		        				<Incident /* Render the same Component with different values each time */
		        					key = {incident.id}
		        					priority = {incident.priority} 
		        					date ={incident.date}
		        					location = {incident.location['address']}
		        					title = {incident.title}
		        					onClick = {this.handleClick}
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
        			<p> </p>
        		)}

                </div>
		)
	}
}

export default withRouter(ControlPanel);