import React, {Component} from 'react'
import { CustomInput, Col, Row, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import alert from '../icons/alert.png'
import '../css/incidentform.css';
import PlacesAutocomplete,{ geocodeByAddress, getLating } from "react-places-autocomplete"

class IncidentForm extends Component
{
  doSomething()
  {
    console.log("Hi")
  }

	render()
	{
		return(
      <div>
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
              <Input type="text" name="title" id="exampleTitle" placeholder="" style={{ height: '30px' }}/>
            </FormGroup>
            <FormGroup>
              <Label for="exampleLocation">Τοποθεσία</Label>
              <Input type="text" name="location" id="exampleLocation" placeholder="" style={{ height: '30px' }}/>
            </FormGroup>
          </Col>
          </Row>
          <Row>
          <Col>
            <FormGroup>
              <Label for="exampleCheckbox">Φορείς</Label>
              <div className="CheckBox">
                <CustomInput type="checkbox" id="EKAB" label="Ε.Κ.Α.Β." />
                <CustomInput type="checkbox" id="ELAS" label="ΕΛ.ΑΣ." />
                <CustomInput type="checkbox" id="Limeniko" label="Λιμενικό" />
                <CustomInput type="checkbox" id="Pirosvestiki" label="Πυρεσβεστική" />
              </div>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
            <Label for="exampleSelect">Προτεραιότητα</Label>
            <Input type="select" name="select" id="exampleSelect">
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
                onClick={() => this.doSomething()}
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

