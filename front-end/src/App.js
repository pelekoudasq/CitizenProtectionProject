import React, {Component} from 'react'
import { Switch, Route , Redirect} from 'react-router-dom'
import ControlPanel from './components/ControlPanel'
import Incidents from './components/Incidents'
import NavBar from './components/NavBar'
import IncidentForm from './components/IncidentForm'
import LoginForm from './components/LoginForm'
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

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
        if (this.state.username !== null) {
            return props => <ProtectedComponent {...props} />;
        }
        else {
            return props => <Redirect to='/login' />;
        }
    }

    render()
    {
    return (
        <div>
        <NavBar />
        <Switch history = {history}>
              <Route exact path='/' component={this.renderProtectedComponent(ControlPanel)} />
              <Route path='/login' component={LoginForm} />
              <Route path='/incident' component={this.renderProtectedComponent(Incidents)} />
              <Route path='/new_incident' component={this.renderProtectedComponent(IncidentForm)} />
        </Switch>
        </div>
    );
    }
}

export default App;
