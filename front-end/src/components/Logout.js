import React, { Component } from 'react';
import { UserContext } from './UserContext';
// import apiUrl from '../services/apiUrl';
// import { Button } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { BehaviorSubject } from 'rxjs';
import { withRouter } from 'react-router';

const currentUserSubject = new BehaviorSubject((localStorage.getItem('token')));
 
class Logout extends Component 
{
    constructor(props) 
    {
        super(props)
        this.doLogout = this.doLogout.bind(this)
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            name: localStorage.getItem('fullname')
        };
    }  


    toggle(event) 
    {

        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    static contextType = UserContext;

    doLogout() 
    {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        currentUserSubject.next(null);
        this.props.history.push('/login');
    }

    // componentDidMount() {
    //     // Perform an ajax call to logout and then clean up local storage and context state.
    //     fetch(`${apiUrl}/logout`, {
    //         mode: 'cors',
    //         method: 'POST',
    //         headers: {
    //             'X-CONTROL-CENTER-AUTH': this.context.username,
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //     })
    //     .then(() => this.doLogout());
    // }


    render() {
        

        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret style={{ backgroundColor: "#0063bf", borderColor: "#0063bf" }}>
                {this.state.name}
            </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem onClick={this.doLogout}> <FontAwesomeIcon icon={ faSignOutAlt } style={{ marginLeft:'4px' }} /> Αποσύνδεση </DropdownItem>
              </DropdownMenu>
            </Dropdown>
                   
        );
    }

};


export default withRouter(Logout)