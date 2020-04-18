import React, { Component } from "react";
import NavBar from './NavBar'
import { Form, FormGroup, Label, Input } from 'reactstrap';
import '../css/login.css';
import logo from '../icons/login_img.jpg'
import { Link } from 'react-router-dom'
import apiUrl from '../services/apiUrl'
import { UserContext } from './UserContext'


class LoginForm extends  Component
{
	static contextType = UserContext;
    username = React.createRef();
    password = React.createRef();

    handleSubmit = event => {

        console.log('ref to username: ', this.username.current);

        const u = this.username.current.value;
        const p = this.password.current.value;

        console.log('Submitting...', u, p);

        fetch(`${apiUrl}/users/authenticate`, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: u,
                password: p,
            }),
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
				console.log(json.token);

                // Store the user's data in local storage to make them available
                // for the next user's visit.
                localStorage.setItem('token', json.token);
                localStorage.setItem('username', u);

                // Use the setUserData function available through the UserContext.
                this.context.setUserData(json.token, u);

                // Use the history prop available through the Route to programmatically
                // navigate to another route.
                this.props.history.push('/');
            });

        event.preventDefault();
    };

	render()
	{
		return(
			<div>
			   	<Form onSubmit={this.handleSubmit} className="login-form">
			    	<h3 className="text-center">Είσοδος στην υπηρεσία</h3>
			    	<FormGroup>
			        	<Label>Όνομα Χρήστη</Label>
			        	<Input 	type="name"
			        			innerRef={this.username}
			        	/>
			    	</FormGroup>
			      	<FormGroup>
			      		<Label>Κωδικός Πρόσβασης</Label>
			        	<Input 	type="password"
			        			innerRef={this.password}
			        	/>
			     	</FormGroup>
			    	<button type="submit" className="loginbutton">
			    	Σύνδεση
			    	</button>
			    </Form>
			    <img className="login_img"
            		src={logo}
            		alt=''
          		/>
		    </div>
		)
	}
}


export default LoginForm
