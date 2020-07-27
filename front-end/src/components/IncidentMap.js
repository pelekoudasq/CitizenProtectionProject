import React , {Component} from 'react'
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"


class IncidentMap extends Component
{	
	shouldComponentUpdate()
	{
		return false;
	}
	
	render(){
		
		let coordinates = JSON.parse(localStorage.getItem("coordinates"))
		const IncidentMap = withGoogleMap(props => (
			<GoogleMap defaultZoom = {15} center = {{ lat: coordinates[0].lat, lng: coordinates[0].lng }}>
				<Marker position={{ lat: coordinates[0].lat, lng: coordinates[0].lng }}/>
			</GoogleMap>
			
		));

		if(this.props.coordinates)
			return(
				<div id="incidentMap" style={{ width:'95%', height:'100%', marginLeft:'0%', position: "absolute" }}>
					<IncidentMap
						containerElement = { <div className="h-100" /> }
						mapElement = { <div className="h-100" /> }
						center = {{ lat: -34.397, lng: 150.644 }}
					/>
				</div>
			)
		else
		{
			return(<p></p>)
		}
	
	}
}

export default IncidentMap;
