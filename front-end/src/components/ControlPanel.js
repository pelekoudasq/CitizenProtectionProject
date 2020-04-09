import React, {Component} from 'react'
import '../css/controlpanel.css'

class ControlPanel extends Component
{
	render()
	{
		return(
			<div>
				<h3 className = "head_ltitle">Τρέχοντα Συμβάντα</h3>
				<h3 className = "head_rtitle">Χάρτης Συμβάντων</h3>
				<div className = "hrz_line"></div>
			</div>
			)
	}
}

export default ControlPanel