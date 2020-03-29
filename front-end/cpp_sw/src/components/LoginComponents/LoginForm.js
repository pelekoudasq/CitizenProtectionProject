import React, { Component } from "react";
import NavBar from '../nav_components/NavBar'
import { Form, FormGroup, Label, Input } from 'reactstrap';
import '../../css/login.css';
import logo from '../../icons/login_img.jpg'



class LoginForm extends  Component
{
	constructor(props)
	{
		super(props)
		this.state={
			username:'',
			password:'',
			buttonDisabled: false
		}
	}


	setInputValue(property, value)
	{
		this.setState({
			[property] : value
		})
	}

	resetFrom()
	{
		this.setState({
			username:'',
			password:'',
			buttonDisabled: false
		})
	}

	async doLogin ()
	{
		if(!this.state.username)
			return

		if(!this.state.password)
			return

		this.setState({
			buttonDisabled: true
		})
	}	

	render() 
	{
		return(
			<div>
			    <NavBar />
				<h1 className = 'login_text'>
			    	<h2>Πλατφόρμα Προστασίας Πολίτη</h2>	
			    </h1>
			   	<Form className="login-form">
			    	<h3 className="text-center">Είσοδος στην υπηρεσία</h3>
			    	<FormGroup>
			        	<Label>Username</Label>
			        	<Input 	type="name" 
			        			placeholder=""
			        			//value={this.state.username ? this.state.username : '' }
			        			onChange={ (val) => this.setInputValue('username', val)}
			        	/>
			    	</FormGroup>
			      	<FormGroup>
			      		<Label>Password</Label>
			        	<Input 	type="password" 
			        			placeholder=""
			        			//value={this.state.password ? this.state.password : '' }
								onChange={ (val) => this.setInputValue('password', val)}
			        	/>
			     	</FormGroup>
			    	<button className="loginbutton"
			    			onClick={() => this.doLogin()}
			    	>Σύνδεση		
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

