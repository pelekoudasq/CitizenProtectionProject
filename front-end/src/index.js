import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom'


const userData = {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
};



ReactDOM.render(
	<BrowserRouter>
		<App userData={userData} />
	</BrowserRouter>
	, document.getElementById('root'));

serviceWorker.unregister();
