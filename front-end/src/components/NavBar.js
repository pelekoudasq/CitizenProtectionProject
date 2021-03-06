import React, { Component } from "react";
import '../css/navbar.css';
import logo from '../icons/mainlogo.png'
import Logout from './Logout'


class NavBar extends Component
{

    render()    
    {
        let token = localStorage.getItem("token")

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
                    <div>
                    {token && <Logout />}

                    </div>
                </nav>
            </React.Fragment>
        );
    }
}

export default NavBar;
