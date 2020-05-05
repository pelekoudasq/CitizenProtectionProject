import React, {Component} from 'react'
import '../css/controlpanel.css'
import high from '../icons/high.png'
import low from '../icons/low.png'
import medium from '../icons/medium.png'
import Modal from 'react-modal';
import { Button }from 'reactstrap'
import { withRouter } from 'react-router';


Modal.setAppElement('#root');

const customStyles = {
  content : {
    top: '20%',
    left: '20%',
    right:'20%',
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
    			<br/>
    			<div className="row" id="inc_box" onClick={this.OpenModal}>
    				<Modal
            			overlayClassName={{
               		 		base: 'Modal-overlay'
            			}}
           				isOpen={this.state.showModal}
           				contentLabel="onRequestClose"
           				onRequestClose={this.CloseModal}
           				style={customStyles}
        			>
          				<p>Προεπισκόπηση Συμβάντος</p>
                        <p>{this.props.title}</p>

                        <p>{this.props.loacation}</p>
                        <div id="container">
                            <Button style = {{marginTop: '26%', backgroundColor: 'white', color: 'black'}} onClick={this.CloseModal}>Κλείσιμο</Button>
                            <Button style = {{marginTop: '26%', marginLeft: '2%'}} onClick={this.props.onClick}>Περισσότερα</Button>
                        </div>
        			</Modal>
					<div className = "container-fluid" style = {{marginLeft: '14%' }}>
						<div className = "row">
							<div  className="col-lg-2" >
								<img src={icon} alt= '' />
							</div>
							<div className="col-md-4">{this.props.date}</div>
							<div className="col-sm-4">{this.props.location}</div>
							<div className="col">{this.props.title}</div>
						</div>
					</div>
    			</div>
    			<br/>
    		</div>
    	);
    }
}


export default Incident


