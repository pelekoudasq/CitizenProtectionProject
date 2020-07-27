import React from 'react'
import '../css/heatmap.css'
import { withGoogleMap, GoogleMap } from "react-google-maps"
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";


function HeatMap(props)
{
	var points = [];
	for (var i=0; i < props.coordinates.length; i++) {
		points[i] = new window.google.maps.LatLng(props.coordinates[i].lat, props.coordinates[i].lng);
	}
	const Heatmap = withGoogleMap(props => (
		<GoogleMap defaultZoom ={6.2} center = {{ lat: 38.3216742, lng: 24.103115 }}>
			<HeatmapLayer data = {points} />
		</GoogleMap>
	));

	return(
		<div id="heatmap">
			<p className="title-bar">Θερμικός Χάρτης</p>
			<Heatmap
				containerElement = { <div className="h-100" /> }
				mapElement = { <div className="h-100" /> }
				center = {{ lat: -34.397, lng: 150.644 }}
			/>
		</div>
	)
}

export default HeatMap;
