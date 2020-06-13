import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Button} from 'reactstrap'
import '../css/login.css';
import logo from '../icons/login_img2.jpg'

import { UserContext } from './UserContext'
import { withRouter } from 'react-router'
// import { faWindowRestore } from "@fortawesome/free-solid-svg-icons";

import { authenticationService } from '../services/authentication.service';

class LoginForm extends  Component
{

    constructor(props, context)
    {
        super(props, context);
        this.state = {
            isLoading: false,
            flag: true
        };
    }


	static contextType = UserContext;
    username = React.createRef();
    password = React.createRef();

    handleSubmit = (event) => {
        // console.log('ref to username: ', this.username.current);

        const u = this.username.current.value;
        const p = this.password.current.value;

        // console.log('Submitting...', u, p);
        this.setState({ isLoading: true });
        // console.log('flag before fetch is', this.state.flag)

        authenticationService.login(u, p)
            .then(
                user => {
                    this.setState({flag: true})
                    let fullname = user.name['firstName'] + ' ' + (user.name['lastName'])
                    localStorage.setItem('fullname', fullname)
                    localStorage.setItem('usertype', user.userType)
                    localStorage.setItem('token', user.token);
                    localStorage.setItem('username', u);
                    //console.log("mpainei edw: ", this.state.flag)
                    if(user.userType === 3)
                        this.props.history.push('/statistics');
                    else
                        this.props.history.push('/');
                },
                error => {
                    this.setState({flag: false});
                    this.setState({ isLoading: false });
                }
            );

        event.preventDefault();
    };


	render()
	{

		return(
			<div>
			   	<Form onSubmit={this.handleSubmit} className="login-form">
			    	<br/>
                    <h4 className="text-center">Είσοδος στην υπηρεσία</h4>
                    <br/>
			    	<FormGroup>
			        	<Label>Όνομα Χρήστη</Label>
			        	<Input 	type="name"
                                innerRef={this.username}
                                required
			        	/>
			    	</FormGroup>
			      	<FormGroup>
			      		<Label>Κωδικός Πρόσβασης</Label>
			        	<Input 	type="password"
                                innerRef={this.password}
                                required
			        	/>
			     	</FormGroup>
			    	<Button type="submit" className="loginbutton">
                        {this.state.isLoading && <span>Περιμένετε...</span>}
                        {!this.state.isLoading && <span>Σύνδεση</span>}
			    	</Button>
                    {!this.state.flag &&
                        <FormGroup>
                            <div className="mt-2 alert alert-danger">
                                <strong>To Όνομα Χρήστη ή ο Κωδικός Πρόσβασης είναι λάθος</strong>
                            </div>
                        </FormGroup>
                    }
			    </Form>
			    <img className="login_img"
            		src={logo}
            		alt=''
          		/>
		    </div>
		)
	}
}


export default withRouter(LoginForm);
