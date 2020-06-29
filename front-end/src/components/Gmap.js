import React, { useEffect, useRef } from 'react';

function GMap(props)
{
  const googleMapRef = useRef(null);
  let googleMap = null;

  // list of icons
  // const iconList = {
  //   icon1: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Flag--Right-Chartreuse.png',
  //   icon2: 'https://cdn2.iconfinder.com/data/icons/IconsLandVistaMapMarkersIconsDemo/256/MapMarker_Marker_Outside_Chartreuse.png',
  //   icon3: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Ball-Right-Azure.png',
  //   icon4: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Pink.png'
  // }

  // list of the marker object along with icon
  const markerList = props.coordinates


  useEffect(() => {
    if(props.coordinates.length > 0)
    {
        googleMap = initGoogleMap();
        let bounds = new window.google.maps.LatLngBounds();
        markerList.forEach((coordinate, index) => {
          const marker = createMarker(coordinate);
          bounds.extend(marker.position);
        });

        googleMap.fitBounds(bounds); // the map to contain all markers
        
    }
        }, []);


  // initialize the google map
  const initGoogleMap = () => {
    return new window.google.maps.Map(googleMapRef.current, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  }

  // create marker on google map
  const createMarker = (markerObj) => new window.google.maps.Marker({
    position: { lat: markerObj.lat, lng: markerObj.lng },
    map: googleMap,
    // icon: {
    //   url: markerObj.icon,
    //   // set marker width and height
    //   scaledSize: new window.google.maps.Size(30, 30)
    // }
  });

  return <div
    ref={googleMapRef}
    style={{ width: '35%', height: '65%', marginLeft: '63%', position: 'absolute'}} />  
}

export default GMap;