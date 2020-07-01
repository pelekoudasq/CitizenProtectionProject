import React, {Component} from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CustomInput, Col, Row, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap'
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import '../css/controlpanel.css'
import '../css/incidentform.css'
import '../css/viewincident.css'
import alert1 from '../icons/alert.png'
import SideMenu from './SideMenu'
import Incident from './Incident'
import Gmap from './Gmap'
import apiUrl from '../services/apiUrl'
import Multiselect from 'react-widgets/lib/Multiselect'
import AutoCompleteLoc from './AutoCompleteLoc'
import { withRouter } from 'react-router'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
// import { Button }from 'reactstrap'

class ViewIncident extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
            incident: "",
            address: "",
			coordinates: {},
			isloading: false,
            editing: false
        }
        
        this.customInputValue = this.customInputValue.bind(this);
        // this.state.auth.current = [];
        this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleLocation = this.handleLocation.bind(this)
		
    }

    customInputValue(buttonName, e) {
        let newChecked = `${buttonName}`;
        let newAuth = []
        if(this.state.auth.indexOf(newChecked) === -1){
            newAuth = [...this.state.auth, newChecked];
        }
        else
        {     
            var index = this.state.auth.indexOf(newChecked);
            if (index !== -1) this.state.auth.splice(index, 1);
            newAuth = this.state.auth
        }

        if(Object.keys(newAuth).length > 0)            
        {
            this.setState({
                auth: newAuth,
                authError: false
            });
        }
        else
        {
            this.setState({
                auth: newAuth,
                authError: true
            });
        }
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

        let id = this.props.match.params["id"]
        console.log(id)
		fetch(`${apiUrl}/incidents/${id}`, requestOptions)
            .then(response => response.json())
            .then(response => {

            	this.setState({
            		incident: response,
            	})
            	console.log(this.state.incident)
            	
                let coordinates = {}
                coordinates['lat'] = response.location['latitude']
                coordinates['lng'] = response.location['longtitude']    
                coordinates['priority'] = response.priority

                this.setState({
                    address: response.location.address,
            		coordinates: coordinates
            	})
        	});	

	}


    handleSubmit = event => {
        // console.log('IncidentForm...');
        // console.log('Title: ',this.state.title.current.value);
        // console.log('Location: ',this.state.location);
        // console.log('Authorizations: ',this.state.auth);
        // console.log('Priority: ',this.state.priority.current.value); 
        //console.log("i forma", this.state.formLoading)     

        this.setState({
            formLoading: true
        }); 

        let checkFetch = response => 
        {
            //console.log('respone status is', response.status)
            if(response.status !== 200)
            {
                this.setState({flag: false, formLoading: false})
                //console.log('flag in check fetch ', this.state.flag)
            }
            return response;
        }

        let requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: this.authHeader(),
            body: JSON.stringify({ 
                title: this.state.title.current.value,
                address: this.state.location,
                priority: this.state.priority.current.value,
                auth: this.state.auth        
            }),
        }

        requestOptions.headers['Content-Type'] = 'application/json'

        let request = `${apiUrl}/incidents/new`


        fetch(request, requestOptions)

        .then(checkFetch)
        .then(response => response.json())
        .then( json => {
            console.log(json);
            //console.log('flag after fetch', this.state.flag)
            if(this.state.flag)
            {
                this.setState({
                    id : json._id,
                    formLoading: false,
                    successSubmit: true
                })
            }
            else
                this.setState({
                    id : null,
                    formLoading: false,
                    successSubmit: false
                })
                //console.log("id in first fetch", this.state.id)
        }) 
        event.preventDefault();
    };


    handleSubmitmoreInfo = event => {
        // console.log('IncidentFormmoreInfo...');
        // console.log('Calling number: ', this.state.call_num.current.value);
        // console.log('Calling name: ', this.state.call_name.current.value);
        // console.log('Incident type: ', this.state.incident_type.current._values.value);
        // console.log('Description: ', this.state.description);
        let checkFetch = response => 
        {
            //console.log('respone status is', response.status)
            if(response.status !== 200)                
            {
                //console.log('flag in check fetch ', this.state.flag)
            }
            return response;
        }

        let requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: this.authHeader(),
            body: JSON.stringify({
                description : this.state.description,
                callerName : this.state.call_name.current.value,
                callerNumber : this.state.call_num.current.value,
                keywords : this.state.incident_type.current._values.value
            }),
        }

        requestOptions.headers['Content-Type'] = 'application/json'

        let request = `${apiUrl}/incidents/update/${this.state.id}`

        fetch(request, requestOptions)

        .then(checkFetch)
        .then(response => response.json())
        .then( json => {
            console.log(json);
            console.log('flag', this.state.flag)
        })

        setTimeout(() => alert('Το Συμβαν Καταγράφηκε Επιτυχώς'), 10);
        this.props.history.push("/")


    event.preventDefault();
    };
    
    handleTextArea = event => {
        const {name,value} = event.target;
        this.setState({
            [name]: value
        })
    };

    handleLocation =  (val) => {
        
        console.log(val.length);
        if (val.length > 0) 
            this.setState({
                location: val,
                locError: false
            })
        else
            this.setState({
                location: val,
                locError: true
            })
    };

    handleNameChange = (val) => {
        console.log("len is",this.state.title.current.value.length)

        if(this.state.title.current.value.length > 0)
        {
            this.setState({
                titleError: false
            })
        }
        else
        {
            this.setState({
                titleError: true
            })
        }
    };

    handleEdit = event => {
        this.setState({
            editing: !this.state.editing
        })
    };

    getComments()
    {
        let comments = [];
        if (this.state.incident.comments){
            var i;
            for (i = 0; i < this.state.incident.comments.length; i++) {
                comments[i] = <li className='list-group-item mt-2 pb-0 u-shadow-v18 g-bg-secondary rounded'>
                    <div className="font-weight-bold" style={{opacity:'0.6' }}>{this.state.incident.comments[i].user}</div>
                    <div className="text-wrap">
                        {this.state.incident.comments[i].text}
                    </div>
                    
                    <blockquote className="blockquote text-right">
                        <footer className="blackquote-footer g-color-gray-dark-v4 g-font-size-12">{this.state.incident.comments[i].date}</footer>
                    </blockquote>
                </li>;
            }
        }
        else {
            console.log('oops')
        }
        return comments
    }


	render()
	{

        let formflag = false
        if (this.state.authError === false && this.state.titleError === false && this.state.locError === false)
            formflag =  true

        let incident = this.state.incident
		return(
			<div className = "hide-scroll">
				<SideMenu /> 
                <Link to="/">
		        <button className="btn btn-link" >
		        <FontAwesomeIcon className="iconBack" icon={ faArrowLeft }/>
		        </button>
		        </Link>

                <h5 className = "head_ltitleInfo">{incident.title}</h5>
        		<div className = "hrz_lineBack"></div>

        		{this.state.isloading ?
                    <div className="load-spin"></div> : console.log("")
                }
				
				{this.state.coordinates !== {} && !this.state.isloading ? (
					<Gmap coordinates = {this.state.coordinates} />
                ) : (
                   <p> </p>
                )}
                <Row>
                <Form style={{ left: '10%', marginTop: '2%', position: 'absolute'}}>
                    <Row>
                        <Col sm={7}>
                            {!this.state.editing ? (
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="pr-3">Ημερομηνία - Ώρα:</td>
                                            <td>{moment(incident.date).format('DD-MM-YYYY')} {moment(incident.date).format('HH:mm')}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Προτεραιότητα:</td>
                                            <td>{incident.priority}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Όνομα Αναφέροντα:</td>
                                            <td>{incident.callerName}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Τηλέφωνο Αναφέροντα:</td>
                                            <td>{incident.callerNumber}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Διεύθυνση:</td>
                                            <td>{this.state.address}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Είδος Συμβάντος:</td>
                                            <td>{incident.keywords}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">Περιγραφή:</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" className="border rounded border-light">{incident.description} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="pr-3">Ημερομηνία - Ώρα:</td>
                                            <td>{moment(incident.date).format('DD-MM-YYYY')} {moment(incident.date).format('HH:mm')}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Προτεραιότητα:</td>
                                            <td>
                                                <FormGroup className="m-1">
                                                <Input className="py-0" type="select" name="select" value={incident.priority} innerRef={incident.priority} id="exampleSelect" >
                                                    <option>Χαμηλή</option>
                                                    <option>Μέτρια</option>
                                                    <option>Υψηλή</option>
                                                </Input>
                                                </FormGroup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Όνομα Αναφέροντα:</td>
                                            <td>
                                                <FormGroup className="m-1">
                                                <Input className="py-0" type="text" name="fullname" innerRef={incident.callerName} defaultValue={incident.callerName} id="exampleFullname"/>
                                                </FormGroup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Τηλέφωνο Αναφέροντα:</td>
                                            <td>
                                                <FormGroup className="m-1">
                                                <Input className="py-0" type="tel" name="telephone" innerRef={incident.callerNumber} defaultValue={incident.callerNumber} id="exampleTelephone"/>
                                                </FormGroup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Διεύθυνση:</td>
                                            <td>
                                                <FormGroup className="m-1">
                                                <AutoCompleteLoc className="py-0" value={this.state.address} handleLocation={this.handleLocation} defaultValue={this.state.address} name="location"/>
                                                </FormGroup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Είδος συμβάντος:</td>
                                            <td>
                                                <FormGroup className="m-1">
                                                    <Multiselect dropDown data={['Φόνος','Ληστεία','Διάρρηξη','Τροχαίο']} ref={incident.incident_type} />
                                                </FormGroup>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">Περιγραφή:</td>
                                        </tr>
                                        <tr>
                                            <td className="p-0" colspan="2">
                                                <FormGroup className="m-1">
                                                    <textarea className="py-0" id="descriptionBox" type="text" value={incident.description} onChange={this.handleTextArea} name="description" defaultValue="incident.keywords" placeholder=""/>
                                                </FormGroup>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </Col>
                        <FontAwesomeIcon icon={ faEdit } style={{ marginLeft:'4px'}} onClick={this.handleEdit} />
                        <Col sm={4}>
                            <FormGroup style={{ width:'40% !important'}}>
                                <div style={{position:'relative', left:'8%'}}>
                                    <Label for="exampleCheckbox">Φορείς</Label>
                                    <div required className="CheckBox" innerref={incident.auth}> 
                                        <CustomInput type="checkbox" id="mycheck" label="Ε.Κ.Α.Β." onClick={this.customInputValue.bind(this, "1")} />
                                        <CustomInput type="checkbox" id="2" label="ΕΛ.ΑΣ."  onClick={this.customInputValue.bind(this, "2")}/>
                                        <CustomInput type="checkbox" id="3" label="Λιμενικό"  onClick={this.customInputValue.bind(this, "3")}/>
                                        <CustomInput type="checkbox" id="4" label="Πυρoσβεστική"  onClick={this.customInputValue.bind(this, "4")}/>
                                    </div>
                                </div>
                                <button id="close-image">
                                <img src={alert1} alt='' style={{ width: '180px'}} onClick= {(formflag === true) ? this.handleSubmit : console.log(" ")} />
                                </button>
                            </FormGroup>
                        </Col>
                    </Row>
                    

                    {/* <Container className="containerBox" style ={{textAlign: 'flex'}}>
                    
                        <FormGroup>
                            <Col>
                            <Button disabled = {!formflag} onClick={this.handleSubmitmoreInfo}>Ολοκλήρωση</Button>
                            </Col>
                            </FormGroup>
                        </Row> 
                    </Container> */}
            
                <br/>
                {this.state.successSubmit === true ? (
                    <div className="alert alert-success" style = {{}}>
                        <strong>Οι αρμόδιοι Φορείς ενημερώθηκαν επιτυχώς για το συμβάν</strong>
                    </div>
                ) : (
                    <p> </p>
                )}  
                </Form>
                </Row>
                <Row style={{ left: '9%', marginTop: '28%', width: '70%', position: 'relative'}}>
                    <h6 className = "head_ltitleInfo">Αναφορές</h6>
                    <div className = "hrz_lineBack"></div>
                    <Col sm={6} className="mt-1" >
                        <ul className='list-group overflow-auto'>
                            {this.getComments()}
                        </ul>
                    </Col>
                    <Col sm={1} className="vrtcl_lineBack mt-2 p-0"></Col>
                    <Col sm={5} className="mt-2">
                        <Form>
                            <FormGroup className="m-1">
                                <textarea className="py-0" id="descriptionBox" type="text"  onChange={this.handleTextArea} name="description" placeholder="Προσθέστε σχόλιο..."/>
                            </FormGroup>
                            <Button className="float-right" style={{ backgroundColor: "#0063bf", borderColor: "#0063bf" }} disabled = {!formflag} onClick={this.handleSubmitmoreInfo}>Προσθήκη</Button>
                        </Form>
                    </Col>
                   
                </Row>
                
            </div>
		)
	}
}

export default withRouter(ViewIncident);