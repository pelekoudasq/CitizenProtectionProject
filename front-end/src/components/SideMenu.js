import React, { Component } from "react";
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faIndent } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'
import { Link } from 'react-router-dom'

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
                            <Link to="/new_incident"><FontAwesomeIcon icon={ faPlus } style={{ marginLeft:'4px', color: 'white' }} /></Link>
                        </NavIcon>
                        <NavText>
                           <Link to="/new_incident">Νέο Συμβάν</Link>
                        </NavText>
                    </NavItem>
                    <NavItem>
                        <NavIcon>
                            <Link to="/"><FontAwesomeIcon icon={ faHome } style={{ marginLeft:'4px', color: 'white' }} /></Link>         
                        </NavIcon>
                        <NavText>
                           <Link to="/"> Πίνακας Ελέγχου</Link>
                        </NavText>
                    </NavItem>
                    <NavItem >
                        <NavIcon>
                            <Link to="/incidents"><FontAwesomeIcon icon={ faIndent } style={{ marginLeft:'4px' , color: 'white' }} /></Link>     
                        </NavIcon>
                        <NavText>
                            <Link to="/incidents"> Συμβάντα</Link>
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
                </SideNav>
            </React.Fragment>
        );
    }
}

export default SideMenu;
