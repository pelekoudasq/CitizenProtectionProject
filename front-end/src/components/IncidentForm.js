import React, {Component} from 'react'
import { CustomInput, Col, Row, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import alert from '../icons/alert.png'
import '../css/incidentform.css';
import SideMenu from './SideMenu'
import apiUrl from '../services/apiUrl'


class IncidentForm extends Component
{
    constructor(props) 
    {
        super(props)
        this.state = {
            title: React.createRef(), 
            location: React.createRef(),
            auth: [],
            priority: React.createRef(), 
            call_num: React.createRef(),
            call_name: React.createRef(),
            incident_type: React.createRef(),
            description: React.createRef()
        }
        this.customInputValue.bind(this);
        // this.state.auth.current = [];
    }  

    customInputValue(buttonName, e) {
        let newChecked = `${buttonName}`;
        let newAuth = [...this.state.auth, newChecked];
        // console.log("adding authorize ", newAuth);
        this.state.auth = newAuth;
    }

    handleSubmit = event => {
        console.log('IncidentForm...');
        console.log('Title: ',this.state.title.current.value);
        console.log('Location: ',this.state.location.current.value);
        console.log('Authorizations: ',this.state.auth);
        console.log('Priority: ',this.state.priority.current.value);

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
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
            }),
        }

        let request = `${apiUrl}/incidents/new`


        fetch(request, requestOptions)

        .then(checkFetch)
        .then( json => {
            console.log(json);
            console.log('flag', this.state.flag)
        })
    event.preventDefault();
    };


    handleSubmitmoreInfo = event => {
        // console.log('IncidentFormmoreInfo...');
        console.log('Calling number: ',this.state.call_num.current.value);
        console.log('Calling name: ',this.state.call_name.current.value);
        console.log('Incident type: ',this.state.incident_type.current.value);
        console.log('Description: ',this.state.description);
    };

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

                <h5 className = "head_ltitleInfo">Προσθήκη Νέου Συμβάντος</h5>
                <div className = "hrz_lineBack"></div>

                <Form style={{marginLeft: '100px', marginRight: '100px', marginTop: '20px'}}>
                
                  <Container className="containerBox" style={{ width:'36%', marginLeft:'0', marginRight:'0'}}>
                  <Row>
                  <Col>
                    <FormGroup>
                      <Label for="exampleTitle">Τίτλος</Label>
                      <Input type="text" name="title" innerRef={this.state.title} id="exampleTitle" placeholder="" style={{ height: '30px' }}/>
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleLocation">Τοποθεσία</Label>
                      <Input type="text" name="location" innerRef={this.state.location} id="exampleLocation" placeholder="" style={{ height: '30px' }}/>
                    </FormGroup>
                  </Col>
                  </Row>
                  <Row>
                  <Col>
                    <FormGroup>
                      <Label for="exampleCheckbox">Φορείς</Label>
                      <div className="CheckBox" ref={this.state.auth}> 
                        <CustomInput type="checkbox" id="1" label="Ε.Κ.Α.Β." onChange={this.customInputValue.bind(this, "1")} />
                        <CustomInput type="checkbox" id="2" label="ΕΛ.ΑΣ."  onChange={this.customInputValue.bind(this, "2")}/>
                        <CustomInput type="checkbox" id="3" label="Λιμενικό"  onChange={this.customInputValue.bind(this, "3")}/>
                        <CustomInput type="checkbox" id="4" label="Πυρεσβεστική"  onChange={this.customInputValue.bind(this, "4")}/>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                    <Label for="exampleSelect">Προτεραιότητα</Label>
                    <Input type="select" name="select" innerRef={this.state.priority} id="exampleSelect">
                      <option>Χαμηλή</option>
                      <option>Μέτρια</option>
                      <option>Υψηλή</option>
                    </Input>
                    </FormGroup>
                  </Col>
                  </Row>
                    <FormGroup>
                    <button id="close-image">
                    <img src={alert}
                        alt=''
                        style={{ width: '230px' }}
                        onClick={this.handleSubmit}
                    />
                    </button>
                    </FormGroup>
                  </Container>

               
                <div className="TextInfo">Επιπλέον Πληροφορίες</div>
                <div className = "hrz_lineInfo"></div>
                <Row form style={{ marginTop: '30px' }}>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="exampleTelephone">Τηλέφωνο Αναφέροντα</Label>
                      <Input type="tel" name="telephone" innerRef={this.state.call_num} id="exampleTelephone"/>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleFullname">Ονοματεπώνυμο Αναφέροντα</Label>
                      <Input type="text" name="fullname" innerRef={this.state.call_name} id="exampleFullname"/>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="exampleTypeOfIncident">Είδος συμβάντος</Label>
                      <Input type="text" name="typeOfIncident" innerRef={this.state.incident_type} id="exampleTypeOfIncident"/>
                    </FormGroup>  
                  </Col>
                </Row>
                <Label for="exampleDescription">Περιγραφή</Label>
                <FormGroup>
                  <textarea id="descriptionBox" type="text" innerref={this.state.description} name="description" placeholder=""/>
                </FormGroup>
                <Button onClick={this.handleSubmitmoreInfo}>Ολοκλήρωση</Button>
                </Form>

            </div>
		)
	}
}

export default IncidentForm

