import React , {Component} from 'react'
import { withGoogleMap, GoogleMap, Marker, Circle } from "react-google-maps"

class RadiusMap extends Component
{
    constructor(props) {
        super(props)
        this.circle = React.createRef()
        this.marker = React.createRef()
        this.map = React.createRef()
        this.state = {
            markers: [],
            center: { lat: 37.975007, lng: 23.721875 },
            radius: props.radius,
            zoom: 6
        };
    }

    componentDidMount() {
        let center = new window.google.maps.LatLng(this.state.center)
        this.getMarkers(center);
    }
    
    arePointsNear(checkPoint, centerPoint, km) {
        var ky = 40000 / 360;
        var kx = Math.cos(Math.PI * centerPoint.lat() / 180.0) * ky;
        var dx = Math.abs(centerPoint.lng() - checkPoint.lng) * kx;
        var dy = Math.abs(centerPoint.lat() - checkPoint.lat) * ky;
        return Math.sqrt(dx * dx + dy * dy) <= km;
    }

    getMarkers(circleCenter) {
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
    }

    changeCenter = marker =>{
        let circleCenter = marker.latLng
        this.circle.current.props.center.lat = circleCenter.lat()
        this.circle.current.props.center.lng = circleCenter.lng()
        this.getMarkers(circleCenter)
    }

    changeRadius = event =>{
        var slider = document.getElementById("exampleRange");
        this.setState({
            radius: Number(slider.value)
        })
        this.getMarkers(this.circle.current.getCenter())
    }

    handleZoomChanged = event =>{
        let zoom = this.map.current.getZoom()
        this.setState({
            zoom: zoom
        })
      }
	
	render(){

        var icon = {
            url: "https://loc8tor.co.uk/wp-content/uploads/2015/08/stencil.png", // url
            scaledSize: new window.google.maps.Size(90, 42), // scaled size
        };

        // console.log(coords)
		const RadiusMap = withGoogleMap(props => (
			<GoogleMap ref={this.map} defaultZoom ={this.state.zoom} center={{ lat: 37.975007, lng: 23.721875 }} onZoomChanged={this.handleZoomChanged}>
                <Circle ref={this.circle} clickable={false} draggable={false} center={this.state.center} radius={this.state.radius*1000} fillColor={'#fff'} fillOpacity={.6} strokeColor={'#313131'} strokeOpacity={.4} strokeWeight={.8}/>
                <Marker ref={this.marker} position={this.state.center} draggable={true} onDragEnd={this.changeCenter} zIndex={100}/>
                {this.state.markers.map(marker => {
                    return (
                    <Marker
                        key={marker.id}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        icon={icon}
                    />)
                })}
            </GoogleMap>
		));

        return(
            <div id="radiusMap" style={{ width:'40%', height:'80%', marginLeft:'5%', position: "absolute" }}>
                <p className="title-bar">Αναζήτηση συμβάντων με απόσταση</p>

                <RadiusMap
                    containerElement = { <div style={{height: "67%"}} /> }
                    mapElement = { <div className="h-100" /> }
                />
                <h5 className="text-left mt-3">Υπάρχουν {this.state.markers.length} συμβάντα στην επιλεγμένη περιοχή</h5>

                <label className="mb-0">Απόσταση από κέντρο: {this.state.radius} χλμ.</label> <br/>
                <input className="w-100" type="range" max="400" min="2" name="range" id="exampleRange" onChange={this.changeRadius}/>
                

            </div>
        )
	
	}
}

export default RadiusMap;