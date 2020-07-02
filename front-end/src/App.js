import React, {Component} from 'react'
import { Switch, Route , Redirect} from 'react-router-dom'
import ControlPanel from './components/ControlPanel'
import IncidentsHistory from './components/IncidentsHistory'
import NavBar from './components/NavBar'
import IncidentForm from './components/IncidentForm'
import LoginForm from './components/LoginForm'
import Statistics from './components/Statistics'
import NotFound from './components/NotFound'
import { withRouter } from 'react-router'
import ViewIncident from './components/ViewIncident'


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
        if (token !== null) 
            return props => <ProtectedComponent {...props} />;
        else 
            return props => <Redirect to='/login' />;       
    }
    
    render()
    {
    return (
        <div>
        <NavBar />
        <Switch >
              <Route exact path='/' component={this.renderProtectedComponent(ControlPanel)} history={this.props.history} />
              <Route path='/login' component={LoginForm} />
              <Route path='/incidents' component={this.renderProtectedComponent(IncidentsHistory)} />
              <Route path= '/incident/:id' component={this.renderProtectedComponent(ViewIncident)} />
              <Route path='/new_incident' component={this.renderProtectedComponent(IncidentForm)} />
              <Route path='/statistics' component={this.renderProtectedComponent(Statistics)} />
              <Route component={NotFound} />
        </Switch>
        </div>
    );
    }
}

export default withRouter(App);
