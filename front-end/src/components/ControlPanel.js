import React, {Component} from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
// import { Link } from 'react-router-dom'
import '../css/controlpanel.css';
import SideMenu from './SideMenu'

class ControlPanel extends Component
{

	componentDidMount()
	{
		fetch(`https:localhost:9000/incidents/all`)
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
			</div>
			)
	}
}

export default ControlPanel