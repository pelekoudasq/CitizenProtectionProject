import React, { Component/*, Container, Col, Row*/ } from 'react'
import SideMenu from './SideMenu'
import HeatMap from './HeatMap'
import { withRouter } from 'react-router'
import { PieChart, Pie, Sector, Cell, BarChart, Bar, LineChart, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import apiUrl from '../services/apiUrl'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF8042'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy  + radius * Math.sin(-midAngle * RADIAN);
    // add names
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

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
			isloading: false,
            statsPeople: [],
            statsAuth : [],
            auths: []

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

        let coordinate = {} //object of coordinates
        let coordinates = [] //array of objects of coordinates
        let date = {}
        let statsPeople = []
        let statsAuth = []

        // auths: ["1", "2"]
        // activate: true/false

        statsPeople = [
             {  name: "Ιανουάριος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Φεβρουάριος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Μάρτιος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Απρίλιος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Μάϊος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Ιούνιος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Ιούλιος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Αύγουστος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Σεπτέμβριος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Οκτώβριος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Νοέμβριος",
                "deaths": 0, "arrested": 0, "injured": 0
            },
            {   name: "Δεκέμβριος",
                "deaths": 0, "arrested": 0, "injured": 0
            }
        ]

        fetch(`${apiUrl}/authorities/`, requestOptions)
            .then(response => response.json())
            .then(response => {
                let auth_obj = {}

            	this.setState({
            		auths: response,
            	})

            	this.state.auths.forEach(auths => { /*Loop through every row of the jsonfile and get the attributes*/
                        auth_obj = {
                            name: auths.title,
                            "enum": auths.enum.toString(),
                            open: 0,
                            close: 0,
                            value: 0
                        }
						statsAuth.push(auth_obj)
		    	})
        	});

		fetch(`${apiUrl}/incidents`, requestOptions)
            .then(response => response.json())
            .then(response => {

            	this.setState({
            		incidents: response
            	})

            	this.state.incidents.forEach(incident => { /*Loop through every row of the jsonfile and get the attributes*/
						/*define the new coordinate */
        				coordinate = {}
						coordinate['lat'] = incident.location['latitude']
						coordinate['lng'] = incident.location['longtitude']
						coordinate['priority'] = incident.priority
                        /* Push it to the array of coordinates */
                        coordinates.push(coordinate)

                        date = new Date(incident.date)
                        statsPeople[date.getMonth()].deaths += incident.stats['deaths'];
                        statsPeople[date.getMonth()].arrested += incident.stats['arrested'];
                        statsPeople[date.getMonth()].injured += incident.stats['injured'];

                        incident.auth.forEach(auth_num => {
                            statsAuth[auth_num-1].value +=1;
                            (incident.active === true ? statsAuth[auth_num-1].open +=1 : statsAuth[auth_num-1].close +=1)
                        })

		    		})

                this.setState({
            		coordinates: coordinates,
                    statsPeople: statsPeople,
                    statsAuth: statsAuth
            	})
        	});
	}


	render()
	{

		return(
			<div className = "hide-scroll">
				<SideMenu />
		        <h5 className = "head_ltitle">Στατιστικά</h5>
		        <h5 className = "head_rtitle">Χάρτης Συμβάντων</h5>
        		<div className = "hrz_line"></div>
        		<br/><br/><br/>

				<div className = "container-fluid" style={{ marginLeft: '7.2%', marginRight:'0px', width:'80%' }}>
					<HeatMap coordinates = {this.state.coordinates} />

                    <BarChart width={700} height={300} data={this.state.statsPeople}
                        margin={{top: 20, right: 0, left: 0, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend />
                        <Bar name="Θάνατοι" dataKey="deaths" stackId="a" fill="#8884d8" />
                        <Bar name="Τραυματισμένοι" dataKey="injured" stackId="a" fill="#82ca9d" />
                        <Bar name="Συλληφθέντες" dataKey="arrested" stackId="a" fill="#aadaff" />
                    </BarChart>

                    <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                        <Pie data={this.state.statsAuth} cx={300} cy={200} labelLine={false} label={renderCustomizedLabel} outerRadius={100} fill="#8884d8">
                            {this.state.statsAuth.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)}
                        </Pie>
                    </PieChart>

					<AreaChart width={700} height={300} data={this.state.statsAuth}
					  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
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
					  <Area type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
					  <Area type="monotone" dataKey="open" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
					</AreaChart>

				</div>



                </div>
		)
	}
}

export default withRouter(Statistics);
