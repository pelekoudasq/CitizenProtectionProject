import React, { Component } from "react";
import logo from '../../mainlogo.png'

// import {Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink }from 'reactstrap';
 
class NavBar extends Component 
{
  render() 
  {
    return (
      <React.Fragment>
        <nav className="navbar navbar-dark mb-3">
          <a className="navbar-brand" href="#">
            <h1> 
              <img 
                  src={logo} width="50" height="50"
                />
              <span className="badge badge-secondary">{this.props.totalItems}</span>
            </h1>
          </a>
        </nav>
      </React.Fragment>
    );
  }
}
 
export default NavBar;