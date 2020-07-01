import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import '../css/incidents.css';
import '../css/incidentshistory.css';
import SideMenu from './SideMenu'


class Incidents extends Component
{
	render()
	{
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
			</div>

		)
	}
}


export default Incidents
