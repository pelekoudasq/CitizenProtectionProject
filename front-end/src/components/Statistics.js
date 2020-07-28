import React, { Component } from "react";
import SideMenu from "./SideMenu";
import HeatMap from "./HeatMap";
import RadiusMap from "./RadiusMap";
import { withRouter } from "react-router";
import "../css/statistics.css";
import { incidentService } from '../services/incidents.service';
import { statisticsService } from '../services/statistics.service';
import { PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF8042"];

// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index,}) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

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
	  auths: [],
      userType: localStorage.getItem("authoritytype")
    };

  }

  componentDidMount() {
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

    statisticsService.get_authorities()
      .then( (response) => {
        this.setState({
          auths: response,
		});
		console.log(response)

        this.state.auths.forEach((auths) => {
			/*Loop through every row of the jsonfile and get the attributes*/
			statsAuth.push({
				name: auths.title,
				enum: auths.enum,
				open: 0,
				close: 0,
				value: 0,
				prlow: 0,
				prmed: 0,
				prhig: 0,
				days: 0
			});
		});


		let auth = []

		console.log(this.state.userType)
		if (this.state.userType !== "null") {
			auth.push(JSON.stringify(Number(this.state.userType)+7))
		}

		incidentService.get_filtered_incidents("", [], [], auth ,"", "")
          .then(async (response) => {
            this.setState({
              incidents: response,
            });

			await this.state.incidents.forEach((incident) => {
              /*Loop through every row of the jsonfile and get the attributes*/
              /*define the new coordinate */
              coordinate = {};
              coordinate["lat"] = incident.location["latitude"];
              coordinate["lng"] = incident.location["longitude"];
              coordinate["priority"] = incident.priority;
              /* Push it to the array of coordinates */
              coordinates.push(coordinate);

              if (incident.keywords != null) {
                incident.keywords.forEach((key) => {
                  if (!statsLabels.some(item => item.name === key)) {
                      label = {};
                      label.name = key;
                      label.deaths = incident.stats.deaths;
                      label.injured = incident.stats.injured;
                      label.arrested = incident.stats.arrested;
                      label.count = 1;
                      if (incident.active) label.active = 1;
                      else label.active = 0;
                      statsLabels.push(label)
                  }
                  else{
                      var index = statsLabels.findIndex(item => item.name === key);
                      statsLabels[index].deaths += incident.stats.deaths;
                      statsLabels[index].arrested += incident.stats.arrested;
                      statsLabels[index].injured += incident.stats.injured;
                      statsLabels[index].count += 1;
                      if (incident.active) statsLabels[index].active += 1;
                  }
                });
              }

              if (incident.active) total_open += 1;
              else total_close += 1;

              date = new Date(incident.date);
              statsPeople[date.getMonth()].deaths += incident.stats["deaths"];
              statsPeople[date.getMonth()].arrested += incident.stats["arrested"];
              statsPeople[date.getMonth()].injured += incident.stats["injured"];

              incident.auth.forEach((auth_num) => {
                statsAuth[auth_num].value += 1;
                incident.active === true
                  ? (statsAuth[auth_num].open += 1)
                  : (statsAuth[auth_num].close += 1);
                  if(incident.priority === "Χαμηλή")
                      statsAuth[auth_num].prlow += 1;
                  else if(incident.priority === "Μέτρια")
                      statsAuth[auth_num].prmed += 1;
                  else
                      statsAuth[auth_num].prhig += 1;
                  if(incident.end_date !== null){
					  var d1 = new Date(incident.end_date)
					  var d2 = new Date(incident.date)
					  var dayscount = d1-d2;
                      statsAuth[auth_num].days += dayscount/3600e3;
                  }
              });
            });

            this.setState({
				isloading: false,
				coordinates: coordinates,
				statsPeople: statsPeople,
				statsAuth: statsAuth,
				total_open: total_open,
				total_close: total_close,
				statsLabels: statsLabels
            });
          });

      });

  }

  makeTable() {
    return this.state.statsLabels.map((item, index) => {
        var percent = (item.active*100/item.count).toFixed(1);
        const { name, deaths, arrested, injured, count } = item //destructuring
        return (
           <tr key={name}>
              <td>{name}</td>
              <td>{deaths}</td>
              <td>{arrested}</td>
              <td>{injured}</td>
              <td>{count}</td>
              <td>{percent}%</td>
           </tr>
        )
    })
  }

  authName(){
    if(this.state.auths[this.state.userType])
        return this.state.auths[this.state.userType].title;
    else
        return "Φορείς";
  }

  authTable(name){
	var index = this.state.statsAuth.findIndex(item => item.name === name);
	let stats = this.state.statsAuth[index];
	if(stats)
      	return(
			<table className="table table-bordered table-sm" id="table-auth">
			<thead>
				<tr>
				<th scope="col">Στοιχείο</th>
				<th scope="col">Αριθμός</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Μέση διάρκεια συμβάντων (ώρες)</td>
					<td>{(stats.close !== 0) ? ((stats.days/stats.close).toFixed(3)) : ("-")}</td>
				</tr>
				<tr>
					<td>Συμβάντα με υψηλή προτεραιότητα</td>
		  			<td>{stats.prhig}</td>
				</tr>
				<tr>
					<td>Συμβάντα με μεσαία προτεραιότητα</td>
		  			<td>{stats.prmed}</td>
				</tr>
				<tr>
					<td>Συμβάντα με χαμηλή προτεραιότητα</td>
		  			<td>{stats.prlow}</td>
				</tr>
				<tr>
					<td>Σύνολο συμβάντων</td>
		  			<td>{stats.value}</td>
				</tr>
			</tbody>
			</table>
	)
	else
		return <p></p>
  }

  authTabs(){
      if(this.state.auths[this.state.userType]){
          return(
              <div>
                  <ul className ="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className ="nav-item">
                      <a className ="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">{this.authName()}</a>
                    </li>
                  </ul>

                  <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">{this.authTable(this.authName())}</div>
                  </div>
              </div>
          )
      }
      else{
          return(
              <div>
                  <ul className ="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className ="nav-item">
                      <a className ="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">ΕΚΑΒ</a>
                    </li>
                    <li className ="nav-item">
                      <a className ="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Αστυνομία</a>
                    </li>
                    <li className ="nav-item">
                      <a className ="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">Πυροσβεστική</a>
                    </li>
                    <li className ="nav-item">
                      <a className ="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">Λιμενικό</a>
                    </li>
                  </ul>

                  <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">{this.authTable("ΕΚΑΒ")}</div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">{this.authTable("Αστυνομία")}</div>
                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">{this.authTable("Πυροσβεστική")}</div>
                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">{this.authTable("Λιμενικό")}</div>
                  </div>
              </div>
          )
      }

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
        { /* first tab */ }
          <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
            <div style={{ marginLeft: "5%", marginRight: "0px"}}>
				{(!this.state.isloading && <RadiusMap coordinates={ this.state.coordinates} radius={50}/>)}
				{(!this.state.isloading && <HeatMap coordinates={ this.state.coordinates }/>)}
			</div>
          </div>

        { /* second tab */ }
        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <div className="container-fluid" id="genericContainer">
          <div className="row">
            <div className="col-sm-8" id="BoxLeft">

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

			{this.state.userType === "null" && (

            <div className="container">
				<div className="row">
					<div className="col-sm-3" id="graphBox-pie">
					<p className="title-pie">Ποσοστό συμμετοχής για {this.authName()}</p>
					<PieChart width={700} height={270}>
						<Pie dataKey="value" isAnimationActive={false} data={this.state.statsAuth} cx={120} cy={130} outerRadius={90} fill="#8884d8" label>
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
						Πλήθος ανοιχτών/κλειστών συμβάντων για {this.authName()}
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
			)}
            </div>
                <div className="col-4" id="BoxRight">
                    <p className="title-bar2">
                      Στατιστικά ανά είδος συμβάντος
                    </p>

                    <table className="table table-hover table-sm table-bordered" id="statTable">
                       <tbody>
                        <tr id="title-header">
                            <th id="title-table">Είδος συμβάντος</th>
                            <th id="title-table">Θάνατοι</th>
                            <th id="title-table">Τραυματισμοί</th>
                            <th id="title-table">Συλλήψεις</th>
                            <th id="title-table">Πλήθος συμβάντων</th>
                            <th id="title-table">Ενεργά συμβάντα</th>
                        </tr>
                          {this.makeTable()}
                       </tbody>
                    </table>

                    <p className="title-bar2">
                      Στατιστικά για:
                    </p>
                    {this.authTabs()}
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
