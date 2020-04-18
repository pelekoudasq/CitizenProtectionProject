import React, {Component} from 'react'
import { Switch, Route , Redirect} from 'react-router-dom'
import ControlPanel from './components/ControlPanel'
import Incidents from './components/Incidents'
import SideMenu from './components/SideMenu'
import NavBar from './components/NavBar'
import IncidentForm from './components/IncidentForm'
import LoginForm from './components/LoginForm'


class App extends Component
{

    constructor(props) {

        super(props);

        this.state = {
            token: props.userData.token,
            username: props.userData.username,
            style: {
                backgroundColor: '#fff',
                height: '100vh',
            },
            setUserData: (token, username) => this.setState({
                token: token,
                username: username,
            }),
        };
    }

    renderProtectedComponent(ProtectedComponent) {

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
        <Switch>
              <Route exact path='/' component={this.renderProtectedComponent(ControlPanel)} />
              <Route path='/login' component={LoginForm} />
              <Route path='/Incidents' component={this.renderProtectedComponent(Incidents)} />
              <Route path='/IncidentForm' component={this.renderProtectedComponent(IncidentForm)} />
        </Switch>
        </div>
    );
    }
}

export default App;
