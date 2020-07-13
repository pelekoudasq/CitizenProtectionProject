import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../css/notfound.css'
import PageNotFound from '../icons/404error.jpg'

class NotFound extends Component{
    render(){
        return (
          <div>
            <body>
            <img src={PageNotFound} alt=" " id="notfoundimg"/>
            <p>Η Σελίδα αυτή δεν βρέθηκε. </p>
            <p style={{ fontSize: "1.5em" }}>Επιστρέψτε στην <Link to="/">Αρχική Σελίδα</Link>  </p>

            </body>
          </div>
          );
    }
}
export default NotFound;