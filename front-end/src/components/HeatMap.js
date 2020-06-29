import React, {/* Component */} from 'react'
import { withGoogleMap, GoogleMap } from "react-google-maps"
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";


function HeatMap(props)
{
	var points = [];
	for (var i=0; i < props.coordinates.length; i++) {
		points[i] = new window.google.maps.LatLng(props.coordinates[i].lat, props.coordinates[i].lng);
	}
	const Heatmap = withGoogleMap(props => (
		<GoogleMap defaultZoom ={9} center = {{ lat: 37.983810, lng: 23.727539 }}>
			<HeatmapLayer data = {points} />
		</GoogleMap>
	));

	return(
		<div style={{ height: '88%', width: '35%', marginLeft: '55%', position: 'absolute' }}>
			<Heatmap
				containerElement = { <div style={{ height: `100%` }} /> }
				mapElement = { <div style={{ height: `100%` }} /> }
				center = {{ lat: -34.397, lng: 150.644 }}
			/>
		</div>
	)
}

export default HeatMap;
