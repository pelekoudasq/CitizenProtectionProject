import React, {Component} from 'react'
import { CustomInput, Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import '../css/incidents.css';
import SideMenu from './SideMenu'


class Incidents extends Component
{
	render()
	{
		return(
			<div>
        		<SideMenu/>
				<Link to="/">
		        <button className="btn btn-link" >
		        <FontAwesomeIcon className="iconBack" icon={ faArrowLeft }/>
		        </button>
		        </Link>

		        <h5 className = "head_ltitleInfo">Τρέχοντα Συμβάντα</h5>
        		<div className = "hrz_lineBack"></div>

			</div>
			)
	}
}

export default Incidents