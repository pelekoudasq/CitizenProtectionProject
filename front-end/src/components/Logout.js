import React, { Component } from 'react';
import { UserContext } from './UserContext';
// import apiUrl from '../services/apiUrl';
import { Button } from 'reactstrap';
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
    }  

    static contextType = UserContext;

    doLogout() {
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
            <Button onClick={this.doLogout} color="primary"> Αποσύνδεση
                <FontAwesomeIcon icon={ faSignOutAlt } style={{ marginLeft:'4px' }} />
            </Button>);
    }

};


export default withRouter(Logout)