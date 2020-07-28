import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../css/notfound.css'
import Unauthorized from '../icons/error401.png'

class NotFound extends Component
{
    render()
    {
        return (
            <div>
                <body>
                    <img src={Unauthorized} alt=" " id="notfoundimg"/>
                    <p>Δεν έχετε εξουσιοδότηση να δείτε αυτή την σελίδα. </p>
                    <p style={{ fontSize: "1.5em" }}>Επιστρέψτε στην <Link to="/">Αρχική Σελίδα</Link>  </p>
                </body>
            </div>
        );
    }
}
export default NotFound;