import React, {Component} from 'react'
import { CustomInput, Col, Row, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import alert from '../icons/alert.png'
import '../css/incidentform.css';
import SideMenu from './SideMenu'
import apiUrl from '../services/apiUrl'
import Multiselect from 'react-widgets/lib/Multiselect'
import AutoCompleteLoc from './AutoCompleteLoc'
import "react-widgets/dist/css/react-widgets.css";


class IncidentForm extends Component
{
    constructor(props) 
    {
        super(props)
        this.state = {
            id : " ",
            title: React.createRef(), 
            location: React.createRef(),
            auth: [],
            priority: React.createRef(), 
            call_num: React.createRef(),
            call_name: React.createRef(),
            incident_type: React.createRef(),
            description: "",
            flag : true
        }
        this.customInputValue.bind(this);
        // this.state.auth.current = [];
    }  



    customInputValue(buttonName, e) {
        let newChecked = `${buttonName}`;
        let newAuth = [...this.state.auth, newChecked];
        // console.log("adding authorize ", newAuth);
        // this.state.auth = newAuth;
        this.setState({auth: newAuth});
    }


    authHeader() 
    {
        // return authorization header with jwt token
        const token = localStorage.getItem('token');
        console.log(token)
        if (token) {
            console.log(token)
            return { Authorization: `Bearer ${token}` };
        } 
        else 
        {
            return {};
        }
    }


    handleSubmit = event => {
        console.log('IncidentForm...');
        console.log('Title: ',this.state.title.current.value);
        // console.log('Location: ',this.state.location.current.value);
        console.log('Authorizations: ',this.state.auth);
        console.log('Priority: ',this.state.priority.current.value);

        let checkFetch = response => 
        {
            console.log('respone status is', response.status)
            if(response.status !== 200)                
            {
                this.setState({flag: false})
                console.log('flag in check fetch ', this.state.flag)
            }
            return response;
        }

        let requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: this.authHeader(),
            body: new URLSearchParams({ 
                title: this.state.title.current.value,
                address: this.state.location.current.value,
                priority: this.state.priority.current.value,
                auth: this.state.auth        
            }),
        }


        let request = `${apiUrl}/incidents/new`


        fetch(request, requestOptions)

        .then(checkFetch)
        .then(response => response.json())
        .then( json => {
            console.log(json);
            console.log('flag after fetch', this.state.flag)

            this.setState({
                id : json._id
            })
            console.log("id in first fetch", this.state.id)
        })

    event.preventDefault();
    };


    handleSubmitmoreInfo = event => {
        // console.log('IncidentFormmoreInfo...');
        console.log('Calling number: ',this.state.call_num.current.value);
        console.log('Calling name: ',this.state.call_name.current.value);
        console.log('Incident type: ',this.state.incident_type.current.value);
        console.log('Description: ',this.state.description);


        let checkFetch = response => 
        {
            console.log('respone status is', response.status)
            if(response.status !== 200)                
            {
                console.log('flag in check fetch ', this.state.flag)
            }
            return response;
        }

        let requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: this.authHeader(),
            body: new URLSearchParams({ 
                description : this.state.description,
                callerName : this.state.call_name.current.value,
                callerNumber : this.state.call_num.current.value,
                keywords : this.state.incident_type.current.value
            }),
        }


        let id = this.state.id;


        let request = `${apiUrl}/incidents/update/${this.state.id}`


        fetch(request, requestOptions)

        .then(checkFetch)
        .then(response => response.json())
        .then( json => {
            console.log(json);
            console.log('flag', this.state.flag)
        })


    };
    
    handleTextArea = event => {
        const {name,value} = event.target
        this.setState({
            [name]: value
        })
    };

// <Input type="text" name="location" innerRef={this.state.location} id="exampleLocation" placeholder=""/>
// <Input type="text" name="typeOfIncident" innerRef={this.state.incident_type} id="exampleTypeOfIncident"/>

    render()
    {
        // let { Multiselect } = ReactWidgets;
        return(
            <div>
                <SideMenu/>
                <Link to="/">
                <button className="btn btn-link" >
                <FontAwesomeIcon className="iconBack" icon={ faArrowLeft }/>
                </button>
                </Link>

                <h5 className = "head_ltitleInfo">Προσθήκη Νέου Συμβάντος</h5>
                <div className = "hrz_lineBack"></div>

                <Form style={{ marginLeft: '15%', marginRight: '100px', marginTop: '20px', width: '70%', position: 'absolute'}}>
                
                    <Container className="containerBox">
                        <Row>
                            <Col xs="6">
                            <FormGroup>
                            <Label for="exampleTitle">Τίτλος</Label>
                            <Input type="text" name="title" innerRef={this.state.title} id="exampleTitle" placeholder="" required/>
                            </FormGroup>
                            </Col>

                            <Col xs="6">
                            <FormGroup>
                            <Label for="exampleTelephone">Τηλέφωνο Αναφέροντα</Label>
                            <Input type="tel" name="telephone" innerRef={this.state.call_num} id="exampleTelephone"/>
                            </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                            <FormGroup>
                            <Label for="exampleLocation">Τοποθεσία</Label>
                            <AutoCompleteLoc innerRef={this.state.location}/>
                            </FormGroup>
                            </Col>

                            <Col>
                            <FormGroup>
                            <Label for="exampleFullname">Ονοματεπώνυμο Αναφέροντα</Label>
                            <Input type="text" name="fullname" innerRef={this.state.call_name} id="exampleFullname"/>
                            </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={3}>
                                <FormGroup style={{ width:'40% !important' }}>
                                <Label for="exampleCheckbox">Φορείς</Label>
                                <div className="CheckBox" ref={this.state.auth}> 
                                <CustomInput type="checkbox" id="1" label="Ε.Κ.Α.Β." onChange={this.customInputValue.bind(this, "1")} />
                                <CustomInput type="checkbox" id="2" label="ΕΛ.ΑΣ."  onChange={this.customInputValue.bind(this, "2")}/>
                                <CustomInput type="checkbox" id="3" label="Λιμενικό"  onChange={this.customInputValue.bind(this, "3")}/>
                                <CustomInput type="checkbox" id="4" label="Πυρεσβεστική"  onChange={this.customInputValue.bind(this, "4")}/>
                                </div>
                                </FormGroup>
                            </Col>
                            <Col sm={3}>
                            <FormGroup>
                            <Label for="exampleSelect">Προτεραιότητα</Label>
                            <Input type="select" name="select" innerRef={this.state.priority} id="exampleSelect">
                              <option>Χαμηλή</option>
                              <option>Μέτρια</option>
                              <option>Υψηλή</option>
                            </Input>
                            </FormGroup>
                            </Col>

                            <Col sm={6}>
                            <FormGroup>
                            <Label for="exampleTypeOfIncident">Είδος συμβάντος</Label>
                            <Multiselect dropDown data={['Φόνος','Ληστεία','Διάρρηξη','Τροχαίο']} innerRef={this.state.incident_type} />
                            </FormGroup>  

                            <Label for="exampleDescription">Περιγραφή</Label>
                            <FormGroup>
                            <textarea id="descriptionBox" type="text" value={this.state.description} onChange={this.handleTextArea} name="description" placeholder=""/>
                            </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                            <Col>
                            <FormGroup>
                            <button id="close-image">
                            <img src={alert} alt='' style={{ width: '230px' }} onClick={this.handleSubmit} />
                            </button>
                            </FormGroup>
                            </Col>
                            </Col>
                            
                            <FormGroup>
                            <Col>
                            <Button onClick={this.handleSubmitmoreInfo}>Ολοκλήρωση</Button>
                            </Col>
                            </FormGroup>
                        </Row>
                </Container>
                </Form>

            </div>
        )
    }
}

export default IncidentForm

