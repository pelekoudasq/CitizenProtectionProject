import React, {Component} from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
// import { Link } from 'react-router-dom'
import '../css/controlpanel.css'
import SideMenu from './SideMenu'
import { withRouter } from 'react-router'
import dash from '../icons/dash.png'

class ControlPanel extends Component
{
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
		const token = localStorage.getItem('token');
		let requestOptions = {
            method: 'GET',
            headers: this.authHeader(),

        }

		fetch(`https:localhost:9000/incidents/all`, requestOptions)
            .then(res => res.json())
            .then(result => 
            	console.log(result))
	}

	render()
	{
		return(
			<div>
        		<SideMenu/>
		        <h5 className = "head_ltitle">Τρέχοντα Συμβάντα</h5>
		        <h5 className = "head_rtitle">Χάρτης Συμβάντων</h5>
        		<div className = "hrz_line"></div>
        		<img className="dash_img"
                            src={dash}
                            alt=''
                />
			</div>
			)
	}
}

export default withRouter(ControlPanel);