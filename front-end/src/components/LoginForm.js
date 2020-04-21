import React, { Component } from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import '../css/login.css';
import logo from '../icons/login_img.jpg'
//import { Link } from 'react-router-dom'
import apiUrl from '../services/apiUrl'
import { UserContext } from './UserContext'
import { BehaviorSubject } from 'rxjs';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const currentUserSubject = new BehaviorSubject((localStorage.getItem('currentUser')));

class LoginForm extends  Component
{

    state = {
        isLoading: false,
        flag: true
    };

	static contextType = UserContext;
    username = React.createRef();
    password = React.createRef();

    handleSubmit = event => {

        console.log('ref to username: ', this.username.current);

        const u = this.username.current.value;
        const p = this.password.current.value;

        console.log('Submitting...', u, p);

        this.setState({ isLoading: true });


        console.log('flag before fetch is', this.state.flag)

        let checkFetch = response => 
        {
            console.log('respone status is', response.status)
            if(response.status !== 200)                
            {
                this.setState({flag: false})
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
                username: u,
                password: p,
            }),
        }

        let request = `${apiUrl}/users/authenticate`


        fetch(request, requestOptions)

        .then(checkFetch)
        .then( json => {
            console.log(json);
            console.log('flag', this.state.flag)

            // Store the users data in local storage to make them available
            // for the next user's visit.
            localStorage.setItem('token', json.token);
            localStorage.setItem('username', u);

            // Use the setUserData function available through the UserContext.
            currentUserSubject.next(json.token);

            // Use the history prop available through the Route to programmatically
            // navigate to another route.
            if(this.state.flag === true)
            {
                console.log("kano log in", this.state.flag)
                this.props.history.push('/');
            }
            else
            {
                setTimeout(() => alert('O kodikos einai lathos'), 10);
                console.log("de kano log in", this.state.flag)
                window.location.reload(false);
            }
        })

    event.preventDefault();
    };


	render()
	{
        const { isLoading } = this.state;

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
                        {isLoading && (
                        <i className="fa fa-refresh fa-spin" style={{ marginRight: "5px" }}/>)}
                        {isLoading && <span>Περιμένετε...</span>}
                        {!isLoading && <span>Συνδεση</span>}
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
