import React, { Component } from "react";
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faIndent } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'
import { Link, NavLink } from 'react-router-dom'

class SideMenu extends Component
{
    render()
    {
        return (
            <React.Fragment>
                <SideNav onSelect={(selected) => { }} style={{ backgroundColor: 'rgb(81, 147, 219)', marginTop: '50px'}}>
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected="home">
                    <NavItem>
                        <NavIcon>
                            <FontAwesomeIcon icon={ faPlus } style={{ marginLeft:'4px', color: 'white' }} />
                        </NavIcon>
                        <NavText>
                           <Link to="/IncidentForm">Νέο Συμβάν</Link>
                        </NavText>
                    </NavItem>
                    <NavItem>
                        <NavIcon>
                            <FontAwesomeIcon icon={ faHome } style={{ marginLeft:'4px', color: 'white' }} />
                        </NavIcon>
                        <NavText>
                           <Link to="/"> Πίνακας Ελέγχου</Link>
                        </NavText>
                    </NavItem>
                    <NavItem >
                        <NavIcon>
                            <FontAwesomeIcon icon={ faIndent } style={{ marginLeft:'4px' , color: 'white' }} />
                        </NavIcon>
                        <NavText>
                            <Link to="/Incidents"> Συμβάντα</Link>
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
                </SideNav>
            </React.Fragment>
        );
    }
}

export default SideMenu;
