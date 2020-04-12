import React, {Component} from 'react'
import { CustomInput, Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import alert from '../icons/alert.png'

class IncidentForm extends Component
{

	render()
	{
		return(
			<Form style={{marginLeft: '100px', marginRight: '100px'}}>
      <Row form>
        <Col md={6}>
          <FormGroup>
            <Label for="exampleTitle">Τίτλος</Label>
            <Input type="text" name="title" id="exampleTitle" placeholder="Φωτιά στο Λιμάνι" />
          </FormGroup>
          <FormGroup>
            <Label for="exampleLocation">Τοποθεσία</Label>
            <Input type="text" name="location" id="exampleLocation" placeholder="Γρ. Αυξεντίου 78, Ζωγράφου" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
		        <Label for="exampleCheckbox">Φορείς</Label>
		        <div style={{border: '1px solid black', width: '145px', padding: '5px'}}>
		          <CustomInput type="checkbox" id="EKAB" label="Ε.Κ.Α.Β." />
		          <CustomInput type="checkbox" id="ELAS" label="ΕΛ.ΑΣ." />
		          <CustomInput type="checkbox" id="Limeniko" label="Λιμενικό" />
		          <CustomInput type="checkbox" id="Pirosvestiki" label="Πυρεσβεστική" />
		        </div>
		      </FormGroup>
        </Col>
        <Col md={6}>
        	<FormGroup>
	        <img src={alert}
	            alt=''
	        />
	        </FormGroup>
        </Col>
      </Row>
      <Row form>
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
        <textarea style={{height: '200px', width: '800px'}} type="text" name="description" id="exampleDescription" placeholder=""/>
      </FormGroup>
      <Button>Ολοκλήρωση</Button>
    </Form>
		)
	}
}

export default IncidentForm

