import React, {Component} from 'react'
import '../css/controlpanel.css'
import high from '../icons/high.png'
import low from '../icons/low.png'
import medium from '../icons/medium.png'
import Modal from 'react-modal';
import { Button }from 'reactstrap'


Modal.setAppElement('#root');

const customStyles = {
  content : {
    top: '20%',
    left: '10%',
    right:'10%',
    bottom:'20%',
  }
};

class Incident extends Component 
{
	constructor(props)
	{
		super(props);

		this.state = {
			showModal: false
		};

		this.OpenModal = this.OpenModal.bind(this);
    	this.CloseModal = this.CloseModal.bind(this);
 	}
  
  	OpenModal () {
    	this.setState({ showModal: true});
  	}
  
  	CloseModal (e) {
  		e.stopPropagation();
    	this.setState({ 
    		showModal: false
    	});
    	console.log("this modal is", this.state.showModal)
  	};

  render()
  {

	let icon
	if(this.props.priority === "Χαμηλή")
		icon = low
	else if(this.props.priority === "Μέτρια")
		icon = medium

	if(this.props.priority === "Υψηλή")
		icon = high

  	return(
  		<div>
			<div>
				<div>
				<br/>
				<div className="row" id="inc_box" onClick={this.OpenModal}>
					<Modal
            			overlayClassName={{
               		 		base: 'Modal-overlay'
            			}}
           				isOpen={this.state.showModal}
           				contentLabel="onRequestClose Example"
           				onRequestClose={this.CloseModal}
           				style={customStyles}
        			>
          				<p>Περισσότερες Πληροφορίες Συμβάντος</p>
          				<Button onClick={this.CloseModal}>Κλείσιμο</Button>
        			</Modal>

					<div  className="col-md-1" style={{marginLeft: '8%'}}>
						<img src={icon} alt= '' />
					</div>
					<div className="col-lg-2">{this.props.date}</div>
					<div className="col-lg-2">{this.props.location}</div>
					<div className="col-lg-2">{this.props.title}</div>
    			</div>
    		</div>
    			<br/>
    			<div className = 'incident_line'></div>
			</div>
		</div>
  	);
  }
}


export default Incident


