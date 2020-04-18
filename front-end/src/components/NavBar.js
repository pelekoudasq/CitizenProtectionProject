import React, { Component } from "react";
import '../css/navbar.css';
import logo from '../icons/mainlogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap';
import Logout from './Logout'

class NavBar extends Component
{
  render()
  {
    return (
      <React.Fragment>
        <nav className="navbar navbar-dark mb-3">
          <a className="navbar-brand" href="/">
          <img className="logo_img"
            src={logo}
            alt=''
          />
          <h1>
            <span className="badge badge-secondary">{this.props.totalItems}</span>
          </h1>
          </a>
          <div className="navbar_line"></div>
          <h5 className = "navbar_text">
            Πλατφόρμα Προστασίας Πολίτη
          </h5>
          <Logout />
        </nav>
      </React.Fragment>
    );
  }
}

export default NavBar;
