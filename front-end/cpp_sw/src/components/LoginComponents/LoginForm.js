import React, { Component } from "react";
import NavBar from './NavBar'
import '../../App.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';



class LoginForm extends  Component
{
	render() 
	{
		return(
			<div>
				<NavBar />
			   	<Form className="login-form">
			    	<h2 className="text-center">Είσοδος στην υπηρεσία</h2>
			    	<FormGroup>
			        	<Label>Username</Label>
			        	<Input type="name" placeholder="Όνομα χρήστη"/>
			    	</FormGroup>
			      	<FormGroup>
			      		<Label>Password</Label>
			        	<Input type="password" placeholder="Κωδικός χρήστη"/>
			     	</FormGroup>
			    	<Button className="btn-lg btn-dark btn-block">Log in</Button>
			    </Form>
		    </div>
		)
	}
}


export default LoginForm

