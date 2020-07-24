import React , { Component }from "react";
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faIndent } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'
import '../css/sidemenu.css'
import { withRouter } from 'react-router'




class SideMenu extends Component
{
    constructor(props, context)
    {
        super(props, context)
        this.state = {
            buttonPressed: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleNavItem = this.handleNavItem.bind(this);
    }

    handleClick() {
        this.setState(PrevState => ({
            buttonPressed: !this.state.buttonPressed
        }));
    }

    handleNavItem(item){
        this.props.history.push(item);
    }

    render()
    {
        let usertype =  localStorage.getItem("usertype");

        if(Number(usertype) !== 3)
        {
            return (
                <React.Fragment>
                    {this.state.buttonPressed && <div className="overlay" />}
                    <SideNav  id="sidenav" className="sidebar">
                    <SideNav.Toggle onClick= {this.handleClick} />
                    <SideNav.Nav defaultSelected="home">
                        {Number(usertype) === 0 && (
                            <NavItem onClick={() => this.handleNavItem("/new_incident")}>
                                <NavIcon>
                                    <FontAwesomeIcon icon={ faPlus } className="icons" />
                                </NavIcon>
                                <NavText>
                                Νέο Συμβάν
                                </NavText>
                            </NavItem>
                        )}
                        <NavItem onClick={() => this.handleNavItem("/")}>
                            <NavIcon>
                                <FontAwesomeIcon icon={ faHome } className="icons" />
                            </NavIcon>
                            <NavText>
                               Πίνακας Ελέγχου
                            </NavText>
                        </NavItem>
                        <NavItem onClick={() => this.handleNavItem("/incidents")}>
                            <NavIcon>
                                <FontAwesomeIcon icon={ faIndent } className="icons" />
                            </NavIcon>
                            <NavText>
                                Συμβάντα
                            </NavText>
                        </NavItem>

                    </SideNav.Nav>
                    </SideNav>
                </React.Fragment>
            );
        }
        else
        {
            return (
                <React.Fragment>
                    {this.state.buttonPressed ?
                        <div className="overlay" />
                    : (
                        <p> </p>
                    )}
                    <SideNav  id="sidenav" className="sidebar">
                    <SideNav.Toggle onClick= {this.handleClick} />
                    <SideNav.Nav defaultSelected="home">

                    <NavItem onClick={() => this.handleNavItem("/statistics")}>
                        <NavIcon>
                            <FontAwesomeIcon icon={ faChartLine } className="icons" />
                        </NavIcon>
                        <NavText>
                            Στατιστικά
                        </NavText>
                    </NavItem>

                    <NavItem onClick={() => this.handleNavItem("/statistics")}>
                        <NavIcon>
                            <FontAwesomeIcon icon={ faFilter } className="icons w-30" />
                        </NavIcon>
                        <NavText>
                            Σύνθετη Αναζήτηση
                        </NavText>
                    </NavItem>

                    </SideNav.Nav>
                    </SideNav>
                </React.Fragment>
            );
        }
    }
}

export default withRouter(SideMenu);
