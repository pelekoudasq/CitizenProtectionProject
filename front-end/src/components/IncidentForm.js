import React, {Component} from 'react'
import { CustomInput, Col, Row, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import alert1 from '../icons/alert.png'
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
            // location: React.createRef(),
            location: " ",
            auth: [],
            priority: React.createRef(), 
            call_num: React.createRef(),
            call_name: React.createRef(),
            incident_type: React.createRef(),
            description: "",
            flag : true,
            authError: true,
            titleError: true,
            locError: true,
            formLoading: false,
            successSubmit: " "
        }
        this.customInputValue = this.customInputValue.bind(this);
        // this.state.auth.current = [];
        this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleLocation = this.handleLocation.bind(this)
    }  


    customInputValue(buttonName) {
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
        // console.log(token)
        if (token) {
            // console.log(token)
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
        console.log('Location: ',this.state.location);
        console.log('Authorizations: ',this.state.auth);
        console.log('Priority: ',this.state.priority.current.value); 
        //console.log("i forma", this.state.formLoading)     

        this.setState({
            formLoading: true
        }); 

        let checkFetch = response => 
        {
            //console.log('respone status is', response.status)
            if(response.status !== 200)
                this.setState({flag: false, formLoading: false})
                //console.log('flag in check fetch ', this.state.flag)
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

        let request = `${apiUrl}/incidents/`


        fetch(request, requestOptions)

        .then(checkFetch)
        .then(response => response.json())
        .then( json => {
            // console.log(json);
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
// <Input type="text" name="location" innerRef={this.state.location} id="exampleLocation" placeholder=""/>
// <Input type="text" name="typeOfIncident" innerRef={this.state.incident_type} id="exampleTypeOfIncident"/>


    render()
    {   
        let formflag = false
        if (this.state.authError === false && this.state.titleError === false && this.state.locError === false)
            formflag =  true

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

                {this.state.formLoading && <div className="cover-spin"></div>}

                <div style={{ marginLeft: '15%', marginRight: '100px', width: '70%'}}>
                    <Row style={{ position: 'center', paddingLeft: '25px'}}>
                        <Col xs="6" style={{paddingRight: '30px'}}> 
                        <p className="Title">Ειδοποιήση Φορέων</p>
                        </Col>
                        <Col xs="6" style={{paddingRight: '30px'}}> 
                        <p className="Title">Λεπτομέρειες</p>
                        </Col>
                    </Row>
                </div>

                <Form className="incform">
                    <Row style={{ position: 'center', paddingLeft: '25px', paddingBottom: '20px', marginBottom:'-40px', paddingTop: '2px'}}>
                    <Col xs="6" style={{borderRight: '3px solid #cccccc', paddingLeft: '2px'}}> 
                    <Container>
                            <FormGroup>
                            <Label for="exampleTitle">Τίτλος*</Label>
                            <Input type="text" name="title" innerRef={this.state.title} onChange ={this.handleNameChange} id="exampleTitle" placeholder="" required/>
                            </FormGroup>
                            <FormGroup>
                            <Label for="exampleLocation">Τοποθεσία*</Label>
                            {/*<AutoCompleteLoc innerRef={this.state.location}/>*/}
                            <AutoCompleteLoc value={this.state.location} handleLocation={this.handleLocation} name="location"/>
                            </FormGroup>
                        <Row>
                            <Col sm={4}>
                                <FormGroup style={{ width:'40% !important' }}>
                                <Label for="exampleCheckbox">Φορείς*</Label>
                                <div required className="CheckBox" innerref={this.state.auth}> 
                                    <CustomInput type="checkbox" id="0" label="Ε.Κ.Α.Β." onClick={this.customInputValue.bind(this, "0")} />
                                    <CustomInput type="checkbox" id="1" label="ΕΛ.ΑΣ."  onClick={this.customInputValue.bind(this, "1")}/>
                                    <CustomInput type="checkbox" id="2" label="Πυρoσβεστική"  onClick={this.customInputValue.bind(this, "2")}/>
                                    <CustomInput type="checkbox" id="3" label="Λιμενικό"  onClick={this.customInputValue.bind(this, "3")}/>
                                </div>
                                </FormGroup>
                            </Col>
                            <Col sm={8}>
                            <FormGroup>
                            <Label for="exampleSelect">Προτεραιότητα* </Label>
                            <Input type="select" name="select" innerRef={this.state.priority} id="exampleSelect" >
                              <option>Χαμηλή</option>
                              <option>Μέτρια</option>
                              <option>Υψηλή</option>
                            </Input>
                            </FormGroup>
                            </Col>
                        </Row>
                            <FormGroup>
                            <button id="close-image">
                            <img src={alert1} alt='' style={{ width: '230px'}} onClick= {(formflag === true) ? this.handleSubmit : console.log(" ")} />
                            </button>
                            </FormGroup>
                    </Container>
                    </Col>
                    <Col xs="6" style={{paddingRight: '30px'}}>
                    <Container>
                            <FormGroup>
                            <Label for="exampleTelephone">Τηλέφωνο Αναφέροντα</Label>
                            <Input type="tel" name="telephone" innerRef={this.state.call_num} id="exampleTelephone"/>
                            </FormGroup>
                            <FormGroup>
                            <Label for="exampleFullname">Ονοματεπώνυμο Αναφέροντα</Label>
                            <Input type="text" name="fullname" innerRef={this.state.call_name} id="exampleFullname"/>
                            </FormGroup>
                            <FormGroup>
                            <Label for="exampleTypeOfIncident">Είδος συμβάντος</Label>
                            <Multiselect dropDown data={['Φόνος','Ληστεία','Διάρρηξη','Τροχαίο']} ref={this.state.incident_type} />
                            </FormGroup>
                            <Label for="exampleDescription">Περιγραφή</Label>
                            <FormGroup>
                                <textarea id="descriptionBox" type="text" value={this.state.description} onChange={this.handleTextArea} name="description" placeholder=""/>
                            </FormGroup>
                        <Row>
                            <FormGroup>
                            <Col>
                            <Button disabled = {!formflag} onClick={this.handleSubmitmoreInfo}>Ολοκλήρωση</Button>
                            </Col>
                            </FormGroup>
                        </Row>
                    </Container>
                    </Col>
                    </Row>
            
                <br/>
                {this.state.successSubmit === true &&(
                    <div className="alert alert-success" style = {{}}>
                        <strong>Οι αρμόδιοι Φορείς ενημερώθηκαν επιτυχώς για το συμβάν</strong>
                    </div>
                )}  
                </Form>

            </div>
        )
    }
}

export default IncidentForm

