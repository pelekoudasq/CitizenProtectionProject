import React, {Component} from 'react'
import { Switch, Route , Redirect} from 'react-router-dom'
import ControlPanel from './components/ControlPanel'
import Incidents from './components/Incidents'
import NavBar from './components/NavBar'
import IncidentForm from './components/IncidentForm'
import LoginForm from './components/LoginForm'
import NotFound from './components/NotFound'
import { withRouter } from 'react-router'


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
        
        // if (this.state.token !== null) {
        if (token !== null) {
            console.log("ime sti main if ",token)
            return props => <ProtectedComponent {...props} />;
        }

        else {
            console.log("ime sti main else ",token)
            return props => <Redirect to='/login' />;
        }
    }
    render()
    {
    return (
        <div>
        <NavBar />
        <Switch >
              <Route exact path='/' component={this.renderProtectedComponent(ControlPanel)} history={this.props.history} />
              <Route path='/login' component={LoginForm} />
              <Route path='/incidents' component={this.renderProtectedComponent(Incidents)} />
              <Route path='/new_incident' component={this.renderProtectedComponent(IncidentForm)} />
              <Route component={NotFound} />
        </Switch>
        </div>
    );
    }
}

export default withRouter(App);
