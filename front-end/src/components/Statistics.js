import React, { Component } from "react";
import SideMenu from "./SideMenu";
import HeatMap from "./HeatMap";
import RadiusMap from "./RadiusMap";
import { withRouter } from "react-router";
import "../css/statistics.css";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import apiUrl from "../services/apiUrl";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF8042"];

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incidents: [],
      showModal: false,
      coordinates: [],
      visiblePosts: 5,
      isloading: true,
      statsPeople: [],
      statsAuth: [],
      statsLabels: [],
	  auths: []
    };
  }

  authHeader() {
    // return authorization header with jwt token
    const token = localStorage.getItem("token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  }

  componentDidMount() {
    let requestOptions = {
      method: "GET",
      headers: this.authHeader(),
    };

    let coordinate = {}; //object of coordinates
    let coordinates = []; //array of objects of coordinates
    let date = {};
    let statsPeople = [];
    let statsAuth = [];
    let label = {};
    let statsLabels = [];
    let total_open = 0;
    let total_close = 0;
    // auths: [1, 2]
    // activate: true/false

    statsPeople = [
      { name: "Ιανουάριος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Φεβρουάριος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Μάρτιος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Απρίλιος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Μάϊος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Ιούνιος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Ιούλιος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Αύγουστος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Σεπτέμβριος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Οκτώβριος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Νοέμβριος", deaths: 0, arrested: 0, injured: 0 },
      { name: "Δεκέμβριος", deaths: 0, arrested: 0, injured: 0 },
    ];

    fetch(`${apiUrl}/authorities/`, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          auths: response,
        });

        this.state.auths.forEach((auths) => {
          /*Loop through every row of the jsonfile and get the attributes*/
          statsAuth.push({
            name: auths.title,
            enum: auths.enum,
            open: 0,
            close: 0,
            value: 0,
          });
        });

        fetch(`${apiUrl}/incidents`, requestOptions)
          .then(async (response) => response.json())
          .then(async (response) => {
            this.setState({
              incidents: response,
            });

            await this.state.incidents.forEach((incident) => {
				console.log("For Each")
              /*Loop through every row of the jsonfile and get the attributes*/
              /*define the new coordinate */
              coordinate = {};
              coordinate["lat"] = incident.location["latitude"];
              coordinate["lng"] = incident.location["longitude"];
              coordinate["priority"] = incident.priority;
              /* Push it to the array of coordinates */
              coordinates.push(coordinate);

              if (incident.keywords != null) {
                label = {};
                incident.keywords.forEach((key) => {
                  if (statsLabels[key] != null) {
                    statsLabels[key].deaths += incident.stats.deaths;
                    statsLabels[key].arrested += incident.stats.arrested;
                    statsLabels[key].injured += incident.stats.injured;
                  } else {
                    label.deaths = incident.stats.deaths;
                    label.arrested = incident.stats.arrested;
                    label.injured = incident.stats.injured;
                    statsLabels[key] = label;
                  }
                });
              }

              if (incident.active) total_open += 1;
              else total_close += 1;

              date = new Date(incident.date);
              statsPeople[date.getMonth()].deaths += incident.stats["deaths"];
              statsPeople[date.getMonth()].arrested +=
                incident.stats["arrested"];
              statsPeople[date.getMonth()].injured += incident.stats["injured"];

              incident.auth.forEach((auth_num) => {
                // if(auth_num<=statsAuth.length-1 && auth_num>=0){
                statsAuth[auth_num].value += 1;
                incident.active === true
                  ? (statsAuth[auth_num].open += 1)
                  : (statsAuth[auth_num].close += 1);
                // }
              });
            });
			console.log("set statee")
            this.setState({
				isloading: false,
				coordinates: coordinates,
				statsPeople: statsPeople,
				statsAuth: statsAuth,
				total_open: total_open,
				total_close: total_close,
				statsLabels: statsLabels,
            });
          });

        console.log(statsLabels);
      });
  }

  makeTable() {
    var div = document.createElement("div");
    div.className = "table table-hover table-sm table-bordered";

    var result = "<table border=1>";
    console.log(this.state.statsLabels);
    // for(var i=0; i<myArray.length; i++) {
    //     result += "<tr>";
    //     for(var j=0; j<myArray[i].length; j++){
    //         result += "<td>"+myArray[i][j]+"</td>";
    //     }
    //     result += "</tr>";
    // }
    // result += "</table>";
    return result;
  }

  render() {
    return (
      <div className="hide-scroll">
        <SideMenu />

        <ul className="nav nav-tabs" id="tabMenu" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">
              Χάρτες συμβάντων
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">
              Στατιστικά
            </a>
          </li>
        </ul>

        <div className="tab-content" id="myTabContent">
        
          <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <div style={{ marginLeft: "5%", marginRight: "0px"}}>
				{(!this.state.isloading && <RadiusMap coordinates={ this.state.coordinates} radius={50}/>)}
				{(!this.state.isloading && <HeatMap coordinates={ this.state.coordinates }/>)}
			</div>
          </div>

          <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <div className="container">
          <div className="row">
            <div className="col-8" id="BoxLeft">

            <div className="container">
              <div className="row">
                <div className="col-8" id="graphBox-bar">
                  <p className="title-bar">
                    Θάνατοι-Τραυματισμοί-Συλλήψεις ανά Μήνα
                  </p>
                  <BarChart width={730} height={300} data={this.state.statsPeople} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Θάνατοι" dataKey="deaths" stackId="a" fill="#8884d8"/>
                    <Bar name="Τραυματισμοί" dataKey="injured" stackId="a" fill="#82ca9d"/>
                    <Bar name="Συλλήψεις" dataKey="arrested" stackId="a" fill="#aadaff"/>
                  </BarChart>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-sm-3" id="graphBox-pie">
                  <p className="title-pie">Ποσοστό συμμετοχής Φορέων</p>
                  <PieChart width={700} height={270}>
                    <Pie dataKey="value" isAnimationActive={false} data={this.state.statsAuth} cx={110} cy={130} outerRadius={90} fill="#8884d8" label>
                      {this.state.statsAuth.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]}/>
                      ))}
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </div>

                <div className="col-sm-1" id="betweenBox"></div>

                <div className="col-sm-5" id="graphBox-bar2">
                  <p className="title-bar2">
                    Πλήθος ανοιχτών/κλειστών συμβάντων ανά Φορέα
                  </p>
                  <AreaChart width={420} height={270} data={this.state.statsAuth} margin={{ top: 40, right: 0, left: 0, bottom: 0 }}>
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
                    <Area type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)"/>
                    <Area type="monotone" dataKey="open" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)"/>
                  </AreaChart>
                </div>
              </div>
            </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Statistics);
