import React , {Component} from 'react'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import { withGoogleMap, GoogleMap, Marker, Circle } from "react-google-maps"

class RadiusMap extends Component
{
    constructor(props) {
        super(props)
        this.circle = React.createRef()
        this.marker = React.createRef()
        this.state = {
            markers: [],
            center: { lat: 37.975007, lng: 23.721875 },
            radius: props.radius
        };

    }

    componentDidMount() {
        console.log(this.circle);
        let center = new window.google.maps.LatLng(this.state.center)
        this.getMarkers(center);
    }

	// shouldComponentUpdate()
	// {
	// 	return false;
    // }
    
    arePointsNear(checkPoint, centerPoint, km) {
        var ky = 40000 / 360;
        var kx = Math.cos(Math.PI * centerPoint.lat() / 180.0) * ky;
        var dx = Math.abs(centerPoint.lng() - checkPoint.lng) * kx;
        var dy = Math.abs(centerPoint.lat() - checkPoint.lat) * ky;
        return Math.sqrt(dx * dx + dy * dy) <= km;
    }

    getMarkers(circleCenter) {
        console.log(circleCenter)
        let marks = []
        this.props.coordinates.forEach(coords => {
            let res = this.arePointsNear({lat: coords.lat, lng: coords.lng }, circleCenter, this.state.radius);
            if(res){
                marks.push({lat: coords.lat, lng: coords.lng})
            }
        });
        this.setState({
            markers: marks,
            center: this.state.center
        })
        console.log("markers ", this.state.markers);
    }

    changeCenter = marker =>{
        console.log(marker.latLng)
        let circleCenter = marker.latLng
        this.circle.current.props.center.lat = circleCenter.lat()
        this.circle.current.props.center.lng = circleCenter.lng()
        this.getMarkers(circleCenter)
        console.log("markers ", this.state.markers);
    }

    changeRadius = value =>{
        var slider = document.getElementById("exampleRange");
        console.log(slider, slider.value)
        this.setState({
            radius: Number(slider.value)
        })

        this.getMarkers(this.circle.current.getCenter())
    }
	
	render(){

        // console.log(coords)
		const RadiusMap = withGoogleMap(props => (
			<GoogleMap defaultZoom ={6} center = {{ lat: 37.975007, lng: 23.721875 }}>
                <Circle ref={this.circle} clickable={false} draggable={false} center={this.state.center} radius={this.state.radius*1000} fillColor={'#fff'} fillOpacity={.6} strokeColor={'#313131'} strokeOpacity={.4} strokeWeight={.8}/>
                <Marker ref={this.marker} position={this.state.center} draggable={true} onDragEnd={this.changeCenter}/>
            </GoogleMap>
		));

        return(
            <div id="radiusMap" style={{ width:'40%', height:'80%', marginLeft:'5%', position: "absolute" }}>
                <p className="title-bar">Αναζήτηση συμβάντων με απόσταση</p>

                <RadiusMap
                    containerElement = { <div style={{height: "67%"}} /> }
                    mapElement = { <div className="h-100" /> }
                />
                <p className="title-bar text-left mt-3">Υπάρχουν {this.state.markers.length} συμβάντα σε απόσταση {this.state.radius} χλμ. από το κέντρο της επισκιασμένης περιοχής.</p>

                <label className="mb-0" for="exampleRange">Ακτίνα Απόστασης από Κέντρο:</label> <br/>
                <input className="w-100" type="range" max="100" min="2" name="range" id="exampleRange" onChange={this.changeRadius}/>
                

            </div>
        )
	
	}
}

export default RadiusMap;