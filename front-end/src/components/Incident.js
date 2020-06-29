import React, {Component} from 'react'
import '../css/controlpanel.css'
import high from '../icons/high.png'
import low from '../icons/low.png'
import medium from '../icons/medium.png'
import Modal from 'react-modal';
import { Button }from 'reactstrap'
import { withRouter } from 'react-router';
import moment from 'moment'

import apiUrl from '../services/apiUrl'

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
        this.handleClick = this.handleClick.bind(this);

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
                        <p>{this.props.incident.title}</p>

                        <p>{this.props.incident.location.address}</p>
                        <div id="container">
                            <Button style = {{marginTop: '26%', backgroundColor: 'white', color: 'black'}} onClick={this.CloseModal}>Κλείσιμο</Button>
                            <Button style = {{marginTop: '26%', marginLeft: '2%'}} onClick={this.handleClick}>Περισσότερα</Button>
                        </div>
        			</Modal>
					<div className = "container-fluid" style = {{marginLeft: '14%' }}>
						<div className = "row">
							<div  className="col-lg-2 mr-1">
								<img src={icon} alt= '' />
							</div>
							<div className="col-md-4 ml-1">{moment(this.props.incident.date).format('DD-MM')}  {moment(this.props.incident.date).format('HH:mm')}</div>
							<div className="col-sm-4 ml-1">{this.props.incident.location.address}</div>
							<div className="col">{this.props.incident.title}</div>
						</div>
					</div>
    			</div>
    			<br/>
    		</div>
    	);
    }
}


export default withRouter(Incident);


