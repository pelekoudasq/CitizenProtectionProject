import React, { Component } from 'react';
import Statistics from './Statistics'
import ControlPanel from './ControlPanel'


class MainPage extends Component 
{
    render ()
    {
    let usertype = localStorage.getItem("usertype")
    return (
    <div>
        {Number(usertype) === 3 ? 
            <Statistics />
        : 
            <ControlPanel />
        } 
    </div>)
    } 
}



export default (MainPage)