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
            <Label for="exampleEmail">Τίτλος</Label>
            <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input type="text" name="password" id="examplePassword" placeholder="password placeholder" />
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <Label for="exampleCheckbox">Φορείς</Label>
        <div>
          <CustomInput type="checkbox" id="EKAB" label="Ε.Κ.Α.Β." />
          <CustomInput type="checkbox" id="ELAS" label="ΕΛ.ΑΣ." />
          <CustomInput type="checkbox" id="Limeniko" label="Λιμενικό" />
          <CustomInput type="checkbox" id="Pirosvestiki" label="Πυρεσβεστική" />
        </div>
      </FormGroup>
       <img src={alert}
            alt=''
        />
      <FormGroup>
        <Label for="exampleAddress">Τοποθεσία</Label>
        <Input type="text" name="address" id="exampleAddress" placeholder="1234 Main St"/>
      </FormGroup>
      <FormGroup>
        <Label for="exampleAddress2">Address 2</Label>
        <Input type="text" name="address2" id="exampleAddress2" placeholder="Apartment, studio, or floor"/>
      </FormGroup>
      <Row form>
        <Col md={6}>
          <FormGroup>
            <Label for="exampleCity">City</Label>
            <Input type="text" name="city" id="exampleCity"/>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="exampleState">State</Label>
            <Input type="text" name="state" id="exampleState"/>
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label for="exampleZip">Zip</Label>
            <Input type="text" name="zip" id="exampleZip"/>
          </FormGroup>  
        </Col>
      </Row>
      <FormGroup check>
        <Input type="checkbox" name="check" id="exampleCheck"/>
        <Label for="exampleCheck" check>Check me out</Label>
      </FormGroup>
      <Button>Ολοκλήρωση</Button>
    </Form>
		)
	}
}

export default IncidentForm

