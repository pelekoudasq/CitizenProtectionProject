import React, { Component/*, Container, Col, Row*/ } from 'react'
import SideMenu from './SideMenu'
import HeatMap from './HeatMap'
import { withRouter } from 'react-router'
import { LineChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import apiUrl from '../services/apiUrl'


const data = [
  { name: 'ΕΚΑΒ', Ανοιχτά: 4000, Κλειστά: 2400, amt: 2400, },
  { name: 'ΛΙΜΕΝΙΚΟ', Ανοιχτά: 3000, Κλειστά: 1398, amt: 2210, },
  { name: 'ΕΛ.ΑΣ', Ανοιχτά: 2000, Κλειστά: 7800, amt: 2290, },
  { name: 'ΠΥΡΟΣΒΕΣΤΙΚΗ', Ανοιχτά: 2780, Κλειστά: 3908, amt: 2000, },
  { name: 'ΤΡΟΧΑΙΑ', Ανοιχτά: 1890, Κλειστά: 4800, amt: 2181, },
];

class Statistics extends Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			incidents: [],
			showModal: false,
			coordinates: [],
			visiblePosts: 5,
			isloading: false

		}
	}

	authHeader()
	{
	    // return authorization header with jwt token
	    const token = localStorage.getItem('token');
	    if (token) {
	        return { Authorization: `Bearer ${token}` };
	    }
	    else
	    {
	        return {};
	    }
	}

	componentDidMount()
	{
		let requestOptions = {
            method: 'GET',
            headers: this.authHeader(),
        }

        let coordinate = {}; //object of coordinates
        let coordinates = [] //array of objects of coordinates

		fetch(`${apiUrl}/incidents/all`, requestOptions)
            .then(response => response.json())
            .then(response => {

            	this.setState({
            		incidents: response,
            	})
            	//console.log(this.state.incidents)

            	this.state.incidents.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
						/*define the new coordinate */
        				coordinate = {}
						coordinate['lat'] = incident.location['latitude']
						coordinate['lng'] = incident.location['longtitude']
						coordinate['priority'] = incident.priority

						/* Push it to the array of coordinates */
						coordinates.push(coordinate)
		    		})
                this.setState({
            		coordinates: coordinates
            	})
        	});
	}


	render()
	{
		// let incidents = this.state.incidents;
		return(
			<div className = "hide-scroll">
				<SideMenu />
		        <h5 className = "head_ltitle">Στατιστικά</h5>
		        <h5 className = "head_rtitle">Χάρτης Συμβάντων</h5>
        		<div className = "hrz_line"></div>
        		<br/><br/><br/>

				<div className = "container-fluid" style={{ marginLeft: '7.2%', marginRight:'0px', width:'80%' }}>
					<HeatMap coordinates = {this.state.coordinates} />
					  <LineChart width={700} height={300} data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5}}>
					    <CartesianGrid strokeDasharray="3 3" />
					    <XAxis dataKey="name" />
					    <YAxis />
					    <Tooltip />
					    <Legend />
					    <Line type="monotone" dataKey="Κλειστά" stroke="#8884d8" activeDot={{ r: 8 }} />
					    <Line type="monotone" dataKey="Ανοιχτά" stroke="#82ca9d" />
					  </LineChart>
					<AreaChart width={700} height={250} data={data}
					  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
					  <defs>
					    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
					      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
					      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
					    </linearGradient>
					    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
					      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
					      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
					    </linearGradient>
					  </defs>
					  <XAxis dataKey="name" />
					  <YAxis />
					  <CartesianGrid strokeDasharray="3 3" />
					  <Tooltip />
					  <Area type="monotone" dataKey="Κλειστά" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
					  <Area type="monotone" dataKey="Ανοιχτά" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
					</AreaChart>

				</div>



                </div>
		)
	}
}

export default withRouter(Statistics);
