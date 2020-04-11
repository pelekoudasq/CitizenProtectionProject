import React, {Component} from 'react'
import { Switch, Route} from 'react-router-dom'
import ControlPanel from './components/ControlPanel'
import Incidents from './components/Incidents'
import SideMenu from './components/SideMenu'
import NavBar from './components/NavBar'
import IncidentForm from './components/IncidentForm'


class App extends Component
{
  render()
  {
    return (
        <div>
        <NavBar />
        <SideMenu/>
        <Switch>
              <Route exact path='/' component={ControlPanel} />
              <Route path='/Incidents' component={Incidents} />
              <Route path='/IncidentForm' component={IncidentForm} />
        </Switch>
        </div>
    );
  }
}

export default App;
