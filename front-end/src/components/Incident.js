import React, {Component} from 'react'
import '../css/controlpanel.css'
import high from '../icons/high.png'
import low from '../icons/low.png'
import medium from '../icons/medium.png'
import Modal from 'react-modal';
import { Button }from 'reactstrap'
import { withRouter } from 'react-router';
import moment from 'moment'
import logo from '../icons/modal_img.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

import apiUrl from '../services/apiUrl'

import { incidentService } from '../services/incidents.service';

Modal.setAppElement('#root');

const customStyles = {
  content : {
    top: '20%',
    left: '20%',
    right:'20%',
    bottom:'25%',
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
		this.handleClick = this.handleClick.bind(this);
		this.accept_incident = this.accept_incident.bind(this);
 	}
  
  	OpenModal (event) {
		event.cancelBubble = true;
		if(event.stopPropagation) event.stopPropagation();
    	this.setState({ showModal: true});
  	}
  
  	CloseModal (e) {
  		e.stopPropagation();
    	this.setState({ 
    		showModal: false
    	});
  	};


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

    handleClick()
    {
        let requestOptions = {
                method: 'GET',
                headers: this.authHeader(),
            }

        let id = this.props.incident._id

        console.log("To id ine", id);

        fetch(`${apiUrl}/incidents/${id}`, requestOptions)
        .then(response => response.json())
        .then(response => {
           console.log("When click more", response)  
        }); 

        this.props.history.push(`/incident/${id}`)
	}

	accept_incident()
	{
		// console.log("Accepted")
		incidentService.accept_incident(this.props.incident._id)
		window.location.reload(false);
	}

    render()
    {
        let icon
        if(this.props.incident.priority === "Χαμηλή")
        	icon = low
        else if(this.props.incident.priority === "Μέτρια")
        	icon = medium

        if(this.props.incident.priority === "Υψηλή")
			icon = high
			
    	return(
    		<div>
    			<br/>
				
    			<div className="row" id="inc_box" onClick={this.handleClick}>
					<Modal
						overlayClassName={{
							base: 'Modal-overlay'
						}}
						isOpen={this.state.showModal}
						contentLabel="onRequestClose"
						onRequestClose={this.CloseModal}
						style={customStyles}>
						<h6 style={{fontSize: "25px", marginLeft: "35%" }}>Προεπισκόπηση Συμβάντος</h6>
						<br/>
						<img className="modal_img"
							src={logo}
							alt=''
						/>
						<table style={{marginLeft: "35%"}}>
							<tbody>
								<tr>
									<td className="pr-2" style={{fontSize: "20px"}}>Ημερομηνία - Ώρα:</td>
									<td>{moment(this.props.incident.date).format('DD-MM-YYYY')} {moment(this.props.incident.date).format('HH:mm')}</td>
								</tr>
								<tr>
									<td className="pr-2" style={{fontSize: "20px"}}>Προτεραιότητα:</td>
									<td>{this.props.incident.priority}</td>
								</tr>
								<tr>
									<td className="pr-2" style={{fontSize: "20px"}}>Όνομα Αναφέροντα:</td>
									<td>{this.props.incident.callerName}</td>
								</tr>
								<tr>
									<td className="pr-2" style={{fontSize: "20px"}}>Τηλέφωνο Αναφέροντα:</td>
									<td>{this.props.incident.callerNumber}</td>
								</tr>
								<tr>
									<td className="pr-2" style={{fontSize: "20px"}}>Διεύθυνση:</td>
									<td>{this.props.incident.location.address}</td>
								</tr>
							</tbody>
						</table>
						<div id="container">
							<Button style = {{marginTop: '12%', backgroundColor: 'white', color: 'black'}} onClick={this.CloseModal}>Κλείσιμο</Button>
							<Button style = {{marginTop: '12%', marginLeft: '2%'}} onClick={this.handleClick}>Περισσότερα</Button>
						</div>
					</Modal>
    			
					<div className = "container-fluid" style = {{marginLeft: this.props.style.marginLeft}}>
						<div className = "row">
							<div  className="col-lg-1">
								<img src={icon} alt= ''/>
							</div>
							<div className="col-md-3 ml-1" style={{marginLeft: '-100%'}}>{moment(this.props.incident.date).format('DD-MM-YYYY')}  {moment(this.props.incident.date).format('HH:mm')}</div>
							<div className="col-sm-4" style={{marginLeft:  '-4%'}}>{this.props.incident.location.address}</div>
							<div className="col" style={{marginLeft: "6%"}}>{this.props.incident.title}</div>
							{Number(this.props.usertype) === 2 && 
								<div className="col-md" style={{marginLeft: "-3%"}}>
									<button type="button" className="btn btn-primary btn-sm" onClick={this.accept_incident}>Αποδοχή</button>
								</div>
							}
							<div className="col" style={{marginLeft: "-10%"}}><FontAwesomeIcon className="iconBack" icon={ faEye } style={{height: '16px'}} onClick={this.OpenModal}/></div>
						</div>
					</div>
    			</div>
    			<br/>
    		</div>
    	);
    }
}


export default withRouter(Incident);


