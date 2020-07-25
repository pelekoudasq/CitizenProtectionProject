import React , {Component} from 'react'
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { render } from 'react-dom'


class IncidentMap extends Component
{	
	constructor(props)
	{
		super(props)
    }

	shouldComponentUpdate()
	{
		return false;
	}
	
	render(){
		
		// let coordinates = JSON.parse(localStorage.getItem("coordinates"))
		// let coordinates = this.props.coordinates.coordinates

		// console.log("props ", this.props.coordinates);
		const IncidentMap = withGoogleMap(props => (
			<GoogleMap defaultZoom = {15} center = {{ lat: this.props.coordinates[0].lat, lng: this.props.coordinates[0].lng }}>
				<Marker position={{ lat: this.props.coordinates[0].lat, lng: this.props.coordinates[0].lng }}/>
			</GoogleMap>
			
		));

		return(
			<div id="incidentMap" style={{ width:'95%', height:'100%', marginLeft:'0%', position: "absolute" }}>
				<IncidentMap
					containerElement = { <div className="h-100" /> }
					mapElement = { <div className="h-100" /> }
					center = {{ lat: -34.397, lng: 150.644 }}
				/>
			</div>
		)
	
	}
}

export default IncidentMap;
