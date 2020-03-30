import React, { Component } from 'react';
import './App.css';
// import LoginForm from './components/LoginComponents/LoginForm'
import NavBar from './components/nav_components/NavBar'
import SideMenu from './components/SideMenu'


class App extends Component{
  render(){
    return (
    <div>
        <NavBar />
    	<SideMenu />
    </div>
    );
  }
}

export default App;
