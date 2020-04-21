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
            title: "", 
            location: "",
            auth: [],
            priority: "", 
            call_num: "",
            call_name: "",
            incident_type: "",
            description: ""
        }
    }  

    title = React.createRef();
    location = React.createRef();
    auth = React.createRef();
    priority = React.createRef();

    handleSubmit = event => {


        console.log('Submitting...');
        console.log(this.state.title, this.state.location, this.state.auth, this.state.priority);


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
                      <div className="CheckBox"> 
                        <CustomInput type="checkbox" id="1" label="Ε.Κ.Α.Β." />
                        <CustomInput type="checkbox" id="2" label="ΕΛ.ΑΣ." />
                        <CustomInput type="checkbox" id="3" label="Λιμενικό" />
                        <CustomInput type="checkbox" id="4" label="Πυρεσβεστική" />
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
                      <Input type="tel" name="telephone" id="exampleTelephone"/>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="exampleFullname">Ονοματεπώνυμο Αναφέροντα</Label>
                      <Input type="text" name="fullname" id="exampleFullname"/>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="exampleTypeOfIncident">Είδος συμβάντος</Label>
                      <Input type="text" name="typeOfIncident" id="exampleTypeOfIncident"/>
                    </FormGroup>  
                  </Col>
                </Row>
                <Label for="exampleDescription">Περιγραφή</Label>
                <FormGroup>
                  <textarea id="descriptionBox" type="text" name="description" placeholder=""/>
                </FormGroup>
                <Button>Ολοκλήρωση</Button>
                </Form>

            </div>
		)
	}
}

export default IncidentForm

