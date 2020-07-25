import React, {Component} from 'react'
import { CustomInput, Col, Row, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap'
import { faArrowLeft, faEdit } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import '../css/controlpanel.css'
import '../css/incidentform.css'
import '../css/viewincident.css'
import '../css/App.css'
import high from '../icons/high.png'
import low from '../icons/low.png'
import medium from '../icons/medium.png'
import alert1 from '../icons/alert.png'
import SideMenu from './SideMenu'
import IncidentMap from "./IncidentMap";
import { withRouter } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { incidentService } from '../services/incidents.service';

class ViewIncident extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
            incident: "",
            address: "",
            comment: "",
            report: "",
            deaths: React.createRef(),
            injured: React.createRef(),
            arrested: React.createRef(),
            coordinates: [],
			isloading: false,
            editing: false,
            priority: React.createRef(),
            callerName: React.createRef(),
            callerNumber: React.createRef(),
            authError: true,
            auth: [],
            successSubmit: false,
            comments: [],
            reportText: "",
            final: false,
            keywords: ""
        }
        
        this.customInputValue = this.customInputValue.bind(this);
        // this.state.auth.current = [];
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReport = this.handleReport.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    customInputValue(buttonName, e) {
        let newChecked = parseInt(`${buttonName}`);
        let newAuth = []
        console.log(newChecked)
        console.log(this.state.auth)
        if(this.state.auth.indexOf(newChecked) === -1){
            console.log("new")
            newAuth = [...this.state.auth, newChecked];
        }
        else
        {
            console.log("uncheck")
            var index = this.state.auth.indexOf(newChecked);
            if (index !== -1) this.state.auth.splice(index, 1);
            newAuth = this.state.auth
        }

        if(Object.keys(newAuth).length > 0)            
        {
            console.log(newAuth)
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

    CheckFinal = event => {
        this.setState({
            final: !this.state.final
        });
    }

	componentDidMount()
	{	

        let id = this.props.match.params["id"]
        let coordinates = [] //array of objects of coordinates
        let coordinate = {}
        console.log(id)
            

        incidentService.get_incident(id)
        .then(response => {
            
            this.setState({
                incident: response,
            })
            
            coordinate['lat'] = response.location['latitude']
            coordinate['lng'] = response.location['longtitude']
            coordinate['priority'] = response.priority

            coordinates.push(coordinate)

            localStorage.setItem("coordinates", JSON.stringify(coordinates))
            this.setState({
                address: response.location.address,
                coordinates: coordinates,
                auth: response.auth,
            })

            response.keywords && this.setState({
                keywords: response.keywords.join(', ')
            })

            this.getComments();
            this.getReport();
        })

	}

    handleSubmit = event => {

        this.setState({
            formLoading: true
        })
        
        incidentService.edit_incident(this.state.callerName.current.value,  this.state.callerNumber.current.value, this.state.priority.current.value, this.state.incident._id)
        .then(response => {
        	this.setState({
            	formLoading: false
        	})
        })

        // setTimeout(() => alert('Το Συμβαν Ενημερώθηκε Επιτυχώς'), 10);

    };

    handleTextArea = event => {
        const {name,value} = event.target;
        this.setState({
            [name]: value
        })
        event.preventDefault();
    };
  
    handleEdit = event => {
        this.setState({
            editing: !this.state.editing
        })
    };

    handleAuth = event => {
        this.setState({
            formLoading: true
        })
        
        incidentService.change_auth(this.state.auth, this.state.incident._id)
        .then(response => {
        	this.setState({
                formLoading: false,
                successSubmit: true
        	})
        })
        event.preventDefault();
    };

    handleComment = event => {
        this.setState({
            formLoading: true
        })

        if (this.state.comment){
            if (this.state.final)
                incidentService.post_comment(this.state.comment, this.state.incident._id, 1)
                .then(response => {
                    console.log(response)
                    this.setState({
                        formLoading: false
                    })
                })
            else
                incidentService.post_comment(this.state.comment, this.state.incident._id, 0)
                .then(response => {
                    console.log(response)
                    this.setState({
                        formLoading: false
                    })
                })
        }
        else
            event.preventDefault();
    };

    getComments()
    {
        if (this.state.incident.comments){
            var i;
            for (i = 0; i < this.state.incident.comments.length; i++) {

                let comment = this.state.incident.comments[i]

            	incidentService.get_user(this.state.incident.comments[i].user)
            	.then(response => {

                    let com = <li className='list-group-item mt-2 pb-0 u-shadow-v18 g-bg-secondary rounded'>
                        <div className="font-weight-bold opacity6">{response[0].username}</div>
                        <div className="text-wrap">
                            {comment.text}
                        </div>
                        
                        <blockquote className="blockquote text-right">
                            <footer className="blackquote-footer g-color-gray-dark-v4 g-font-size-12">{moment(comment.date).format('DD-MM-YYYY')} {moment(comment.date).format('HH:mm')}</footer>
                        </blockquote>
                    </li>;

                    this.setState({
                        comments: [com, ...this.state.comments]
                    })
                });
            }
        }        
    }

    handleReport = event => {
        this.setState({
            formLoading: true
        })

        let stats = {
            deaths: this.state.deaths.current.value,
            injured: this.state.injured.current.value,
            arrested: this.state.arrested.current.value
        }

        if (this.state.report)
            incidentService.post_report(this.state.report, this.state.incident._id, stats)
            .then(response => {
                console.log(response)
                this.setState({
                    formLoading: false
                })
            })
        else
            event.preventDefault();
    };

    getReport()
    {
        if(this.state.incident && !this.state.incident.active && this.state.incident.report){
            let incident = this.state.incident
            incidentService.get_user(this.state.incident.report.user)
            .then(response => {
                let report = <table className="table table-borderless">
                        <tbody>
                            <tr className="border-bottom">
                                <td className="pr-0">Τραυματισμοί:</td>
                                <td className="pl-0">{ incident.stats.injured}</td>
                                <td className="pr-0">Θάνατοι:</td>
                                <td className="pl-0">{ incident.stats.deaths}</td>
                                <td className="pr-0">Συλλήψεις:</td>
                                <td className="pl-0">{ incident.stats.arrested}</td>
                            </tr>
                            <tr>
                                <td colSpan="6">
                                    <div className="pt-3 p-1 u-shadow-v18 g-bg-secondary rounded">
                                        <div className="font-weight-bold opacity6">{response[0].username}</div>
                                        <div className="text-wrap">
                                            {incident.report.text}
                                        </div>
                                        
                                        <blockquote className="blockquote text-right">
                                            <footer className="blackquote-footer g-color-gray-dark-v4 g-font-size-12">{moment(incident.report.date).format('DD-MM-YYYY')} {moment(incident.report.date).format('HH:mm')}</footer>
                                        </blockquote>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>;
                this.setState({
                    reportText: report
                })
            });
        }
        else{
            this.setState({
                reportText: <p></p>
            })
        }
        
    }
    goBack()
    {
        this.props.history.goBack();
    }

	render()
	{

        let formflag = false
        if (this.state.authError === false)
            formflag =  true

        let incident = this.state.incident
        let usertype =  localStorage.getItem("usertype")
        let icon
        if(this.state.incident.priority === "Χαμηλή")
        	icon = low
        else if(this.state.incident.priority === "Μέτρια")
        	icon = medium

        if(this.state.incident.priority === "Υψηλή")
			icon = high

		return(
			<div className = "hide-scroll">
				<SideMenu />
		        <button className="btn btn-link" >
		        <FontAwesomeIcon className="iconBack" icon={ faArrowLeft } onClick={this.goBack}/>
		        </button>

                <h5 className = "head_ltitleInfo">{incident.title}</h5>
        		<div className = "hrz_lineBack"></div>

        		{this.state.isloading && <div className="load-spin"></div> }

                <Container>
                    <Row id="incinfo">
                        <Col sm="auto">
                            {!this.state.editing ? (
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="pr-3">Ημερομηνία - Ώρα:</td>
                                            <td>{moment(incident.date).format('DD-MM-YYYY')} {moment(incident.date).format('HH:mm')}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3">Προτεραιότητα:</td>
                                            <td><img id="priority-icon" src={icon} alt= ''/> {incident.priority}</td>
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
                                            <td>{this.state.keywords}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">Περιγραφή:</td>
                                        </tr>
                                        { incident.description && (
                                            <tr>
                                                <td colSpan="2" style={{ width: "180px" }}>
                                                        <div className="p-1 u-shadow-v18 g-bg-secondary rounded">
                                                            <div className="text-wrap">
                                                                { incident.description }
                                                            </div>
                                                        </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <Form onSubmit={this.handleSubmit}>
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
                                                    <Input className="py-0" size="sm" type="select" name="select" innerRef={this.state.priority} defaultValue={incident.priority} id="exampleSelect" >
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
                                                    <Input className="py-0" size="sm" type="text" name="fullname" innerRef={this.state.callerName} defaultValue={incident.callerName} id="exampleFullname"/>
                                                    </FormGroup>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pr-3">Τηλέφωνο Αναφέροντα:</td>
                                                <td>
                                                    <FormGroup className="m-1">
                                                    <Input className="py-0" size="sm" type="tel" name="telephone" innerRef={this.state.callerNumber} defaultValue={incident.callerNumber} id="exampleTelephone"/>
                                                    </FormGroup>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pr-3">Διεύθυνση:</td>
                                                <td>{this.state.address}</td>
                                            </tr>
                                            <tr>
                                                <td className="pr-3">Είδος Συμβάντος:</td>
                                                <td>{this.state.keywords}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2">Περιγραφή:</td>
                                            </tr>
                                            { incident.description && (
                                                <tr>
                                                    <td colSpan="2" className="pborder rounded" style={{ width: "180px" }}>
                                                        <div className="p-1 u-shadow-v18 g-bg-secondary rounded">
                                                            <div className="text-wrap">
                                                                { incident.description }
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <Button className="float-right mt-2 buttonblue" type="submit">Ολοκλήρωση</Button>
                                </Form>
                            )}
                        </Col>
                        {incident.active && (Number(usertype) === 0 || Number(usertype) === 1) && (
                            <FontAwesomeIcon icon={ faEdit } className="ml-2 mt-1" onClick={this.handleEdit} />
                        )}
                        <Col sm="auto">
                            <Form id="incinfo">
                                <FormGroup className="mx-auto">
                                    <div>
                                        <Label className="pl-4" for="exampleCheckbox">Φορείς</Label>
                                        <div required className="CheckBox mx-auto px-2" innerref={incident.auth}> 
                                            <CustomInput type="checkbox" id="mycheck" label="Ε.Κ.Α.Β." onClick={this.customInputValue.bind(this, "0")} checked = {this.state.auth.includes(0)} disabled={!incident.active || (Number(usertype) !== 0 && Number(usertype) !== 1) }/>
                                            <CustomInput type="checkbox" id="2" label="ΕΛ.ΑΣ."  onClick={this.customInputValue.bind(this, "1")} checked = {this.state.auth.includes(1)} disabled={!incident.active || (Number(usertype) !== 0 && Number(usertype) !== 1) }/>
                                            <CustomInput type="checkbox" id="3" label="Λιμενικό"  onClick={this.customInputValue.bind(this, "2")} checked = {this.state.auth.includes(2)} disabled={!incident.active || (Number(usertype) !== 0 && Number(usertype) !== 1) }/>
                                            <CustomInput type="checkbox" id="4" label="Πυρoσβεστική"  onClick={this.customInputValue.bind(this, "3")} checked = {this.state.auth.includes(3)} disabled={!incident.active || (Number(usertype) !== 0 && Number(usertype) !== 1) }/>
                                        </div>
                                        {incident.active && (Number(usertype) === 0 || Number(usertype) === 1) && (
                                            <button id="close-image" className="mx-auto">
                                            <img src={alert1} alt='' style={{ width: '180px'}} onClick= {(formflag === true) ? this.handleAuth : console.log("")} />
                                            </button>
                                        )}
                                    </div>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col>
                            {(this.state.coordinates && <IncidentMap coordinates={JSON.parse(localStorage.getItem("coordinates"))}/>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        {this.state.successSubmit && (
                            <div className="alert alert-success mb-0 ml-5">
                                <strong>Οι αρμόδιοι φορείς ενημερώθηκαν επιτυχώς για το συμβάν</strong>
                            </div>
                        )}
                    </Row>
                    <Row id="reports">
                        <h6 className = "head_ltitleInfo">Αναφορές</h6>
                        <div className = "hrz_lineBack"></div>
                        <Col sm={6} className="mt-1 my-scroll scroll">
                            <ul className='list-group overflow-auto'>
                                {this.state.comments}
                            </ul>
                        </Col>
                        {/* <Col sm={1} className="vrtcl_lineBack mt-2 p-0"></Col> */}
                        <Col sm={5} className="mt-3 ml-5">
                        {this.state.reportText}
                        {Number(usertype) === 0 && incident.active && ( //control-center agent
                            <Form onSubmit={this.handleReport}>
                                <FormGroup>
                                    <Label className="ml-1">Τραυματισμοί</Label>
                                    <CustomInput className="ml-1 mr-1 w-10" type="number" innerRef={this.state.injured} name="number" id="injured" placeholder="0"/>
                                    <Label className="ml-4">Θάνατοι</Label>
                                    <CustomInput className="ml-1 mr-1 w-10" type="number" innerRef={this.state.deaths} name="number" id="deaths" placeholder="0"/>
                                    <Label  className="ml-4">Συλλήψεις</Label>
                                    <CustomInput className="ml-1 w-10" type="number" innerRef={this.state.arrested} name="number" id="arrested" placeholder="0"/>
                                </FormGroup>
                                <FormGroup className="m-1">
                                    <textarea className="py-0" id="descriptionBox" type="text" value={this.state.report} onChange={this.handleTextArea} name="report" placeholder="Τελική Αναφορά"/>
                                </FormGroup>
                                {(this.state.incident.departmentReport == this.state.incident.auth.length) ?
                                (<Button className="float-right buttonblue" type="submit">Ολοκλήρωση Συμβάντος</Button>)
                                :
                                ( <Button disabled className="float-right buttonblue" type="submit">Ολοκλήρωση Συμβάντος</Button>)}


                            </Form>
                        )}
                        {Number(usertype) === 1 && incident.active && ( //authority department
                            <Form onSubmit={this.handleComment}>
                                <FormGroup className="m-1">
                                    <textarea className="py-0" id="descriptionBox" type="text" value={this.state.comment} onChange={this.handleTextArea} name="comment" placeholder="Προσθέστε σχόλιο..."/>
                                </FormGroup>
                                <div>
                                <Button className="float-right d-inline py-1 buttonblue" type="submit">Προσθήκη</Button>
                                <CustomInput className="float-right d-inline mr-2 mt-1" type="checkbox" id="report" onClick={this.CheckFinal} label="Τελική Αναφορά" />
                                </div>
                            </Form>
                        )}
                        {Number(usertype) === 2 && incident.active && ( //department personnel
                            <Form onSubmit={this.handleComment}>
                                <FormGroup className="m-1">
                                    <textarea className="py-0" id="descriptionBox" type="text" value={this.state.comment} onChange={this.handleTextArea} name="comment" placeholder="Προσθέστε σχόλιο..."/>
                                </FormGroup>
                                <Button className="float-right buttonblue" type="submit">Προσθήκη</Button>
                            </Form>
                        )}
                        </Col>
                    
                    </Row>
                </Container>
            </div>
		)
	}
}

export default withRouter(ViewIncident);