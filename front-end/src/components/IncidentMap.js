import React from 'react'
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"


function IncidentMap(props)
{
	console.log("here ",props.coordinates[0].lat);
	console.log("props ", props);

	var lat = props.coordinates[0].lat;
	var lng = props.coordinates[0].lng;
	const IncidentMap = withGoogleMap(props => (
		<GoogleMap defaultZoom = {15} center = {{ lat: lat, lng: lng }}>
			<Marker position={{ lat: lat, lng: lng }}/>
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

export default IncidentMap;
