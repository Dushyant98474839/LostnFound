import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issues in Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ form }) {
  const [position, setPosition] = useState(null);
  const [located, setLocated] = useState(false);
  const map = useMap();
  const [count,setCount]=useState(0);

  // Invalidate map size when modal opens
  useEffect(() => {
    map.invalidateSize();
  }, [map]);

//   useEffect(() => {
//     map.locate();

//     const fallbackTimeout = setTimeout(() => {
//       if (!located && !position) {
//         const defaultLatLng = { lat: 51.505, lng: -0.09 };
//         setPosition(defaultLatLng);
//         form.setFieldsValue({ coordinates: defaultLatLng });
//         map.flyTo(defaultLatLng, 13); 
//       }
//     }, 5000);

//     return () => clearTimeout(fallbackTimeout);
//   }, [map, located, form, position]);

 useMapEvents({
    click(e) {
      const clickedLatLng = e.latlng;
      setPosition(clickedLatLng);
      form.setFieldsValue({ coordinates: clickedLatLng });
      map.flyTo(clickedLatLng, map.getZoom());
      console.log(position)

      if (count === 0) {
        map.locate();
        setCount(1);
      }
    },
    locationfound(e) {
      setLocated(true);
      const userLatLng = e.latlng;
      setPosition(userLatLng);
      form.setFieldsValue({ coordinates: userLatLng });
      map.flyTo(userLatLng, map.getZoom());
      console.log(position)
    }
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>{located ? 'You are here' : 'Selected location'}</Popup>
    </Marker>
  );
}

// function LocationMarker() {
//   const [position, setPosition] = useState(null)
//   const map = useMapEvents({
//     click() {
//       map.locate()
//     },
//     locationfound(e) {
//       setPosition(e.latlng)
//       map.flyTo(e.latlng, map.getZoom())
//     },
//   })

//   return position === null ? null : (
//     <Marker position={position}>
//       <Popup>You are here</Popup>
//     </Marker>
//   )
// }

function Maps({ form }) {
  return (
    <MapContainer
      center={{ lat: 51.505, lng: -0.09 }}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker form={form} />
    </MapContainer>
  );
}

function LocationMarker2({ lng, lat }) {
  const map = useMap();
    useEffect(() => {
    map.invalidateSize();
  }, [map]);
  
  useEffect(() => {
    if (lat && lng) {
      map.flyTo({ lat, lng }, map.getZoom());
    }
  }, [lat, lng, map]);

  return (
    <Marker position={{ lat, lng }}>
      <Popup>Pinned Location</Popup>
    </Marker>
  );
}


function MapsCards({ lng, lat }) {
  return (
    <MapContainer
      center={{ lat: lat, lng: lng }}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker2 lng={lng} lat={lat} />
    </MapContainer>
  );
}


export {Maps, MapsCards};