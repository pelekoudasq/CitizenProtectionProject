import React, { Component } from 'react';
import './App.css';
import mainlogo from './mainlogo.png';
// import NavBar from './NavBar'
import { Button, Form, FormGroup, Label, Input , Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import { FacebookLoginButton } from 'react-social-login-buttons';


class App extends Component{
  render(){
    return (
    <div>
      <nav className="navbar navbar-dark mb-3">
        <a className="navbar-brand" href="#">
        <h1><img src={mainlogo} className="App-logo" alt="logo" /> <span className="badge badge-secondary">{this.props.totalItems}</span></h1>
        </a>
      </nav>
       <Form className="login-form">
          <h1>
           <span className="font-weight-bold">here</span>.com
          </h1>
          <h2 className="text-center">Welcome</h2>
          <FormGroup>
            <Label>Email</Label>
            <Input type="name" placeholder="Όνομα χρήστη"/>
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input type="password" placeholder="Κωδικός χρήστη"/>
          </FormGroup>
          <Button className="btn-lg btn-dark btn-block">Log in</Button>
          <div className="text-center pt-3">rrrr </div>
        </Form>
      </div>
    );
  }
}

export default App;