import React, {Component} from 'react'
import { Switch, Route , Redirect} from 'react-router-dom'
import IncidentsHistory from './components/IncidentsHistory'
import NavBar from './components/NavBar'
import IncidentForm from './components/IncidentForm'
import LoginForm from './components/LoginForm'
import NotFound from './components/NotFound'
import { withRouter } from 'react-router'
import ViewIncident from './components/ViewIncident'
import MainPage from './components/MainPage'


class App extends Component
{

    constructor(props) 
    {
        super(props);
        this.state = {
            token: props.userData.token,
            username: props.userData.username,

            setUserData: (token, username) => this.setState({
                token: token,
                username: username,
            }),
        };
    }

    renderProtectedComponent(ProtectedComponent) 
    {   
        let token = localStorage.getItem("token")
        if (token) 
            return props => <ProtectedComponent {...props} />;
        else 
            return props => <Redirect to='/login' />;       
    }
    
    render()
    {
    let usertype = localStorage.getItem("usertype")
    console.log("EImai i vasia me",usertype)
    return (
        <div>
            <NavBar />
            <Switch >
                <Route exact path='/' component={this.renderProtectedComponent(MainPage)} history={this.props.history} />
                <Route path='/login' component={LoginForm} />
                <Route path='/incidents' component={this.renderProtectedComponent(IncidentsHistory)} />
                <Route path= '/incident/:id' component={this.renderProtectedComponent(ViewIncident)} />
                {Number(usertype) === 0 &&
                    <Route path='/new_incident' component={this.renderProtectedComponent(IncidentForm)} />}
                <Route component={NotFound} />
            </Switch>
        </div>
    );
    }
}

export default withRouter(App);
