import React, { Component } from "react";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './../css/sidemenu.css';


class SideMenu extends Component
{
  render()
  {
    return (
        <React.Fragment>
            <SideNav onSelect={(selected) => { }} style={{ backgroundColor: '#9fc1e6', marginTop: '50px' }}>
            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="home">
                <NavItem eventKey="home">
                    <NavIcon>
                        <i className="fa fa-home" style={{ fontSize: '1.75em' }} />
                    </NavIcon>
                    <NavText>
                        Home
                    </NavText>
                </NavItem>
                <NavItem eventKey="charts" >
                    <NavIcon>
                        <i className="fa fa-line-chart" style={{ fontSize: '1.75em' }} />
                    </NavIcon>
                    <NavText>
                        Charts
                    </NavText>
                    <NavItem eventKey="charts/linechart">
                        <NavText>
                            Line Chart
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="charts/barchart">
                        <NavText>
                            Bar Chart
                        </NavText>
                    </NavItem>
                </NavItem>
            </SideNav.Nav>
            </SideNav>
        </React.Fragment>
    );
    }
}

export default SideMenu;
