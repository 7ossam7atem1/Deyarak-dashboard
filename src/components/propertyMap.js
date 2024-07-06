import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/propertyMap.css';
import Cookies from 'js-cookie';

const markerIcon = new L.Icon({
  iconUrl: require('../images/placeholder.png'), 
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const PropertyMap = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState([51.505, -0.09]);

 
  const fetchAllLocations = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        `https://deyarak-app.onrender.com/api/v1/properties/all-locations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.status === 'success') {
        console.log('All locations data:', response.data.data.locations);
        setLocations(
          Array.isArray(response.data.data.locations)
            ? response.data.data.locations
            : []
        );
      } else {
        setError('Error fetching all locations: Unexpected response format');
      }
    } catch (error) {
      setError(`Error fetching all locations: ${error.message}`);
    }
  };

  // Function to fetch properties within a certain radius from center
  const fetchPropertiesWithin = async (center) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        `https://deyarak-app.onrender.com/api/v1/properties/properties-within/50000/center/${center.join(
          ','
        )}/unit/km`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.status === 'success') {
        console.log('Properties within data:', response.data.data.data); // Added log
        const newLocations = response.data.data.data.map(
          (item) => item.locations
        );
        setLocations(Array.isArray(newLocations) ? newLocations : []);
      } else {
        setError(
          'Error fetching properties within range: Unexpected response format'
        );
      }
    } catch (error) {
      setError(`Error fetching properties within range: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchAllLocations(); // Fetch all locations initially
  }, []);

  // LocateButton component to handle user location and update map
  const LocateButton = () => {
    const map = useMap();
    const handleLocate = () => {
      map
        .locate()
        .on('locationfound', (e) => {
          const newCenter = [e.latlng.lat, e.latlng.lng];
          setCenter(newCenter);
          map.setView(newCenter, 13);
          fetchPropertiesWithin(newCenter); // Fetch properties within radius
        })
        .on('locationerror', (e) => {
          setError(`Location access denied: ${e.message}`);
        });
    };

    return (
      <button onClick={handleLocate} className='locate-button'>
        Locate Me
      </button>
    );
  };

  return (
    <div className='property-map-container'>
      {error && <div>{error}</div>}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {Array.isArray(locations) && locations.length > 0 ? (
          locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.coordinates[1], location.coordinates[0]]}
              icon={markerIcon}
            >
              <Popup className='map-popup'>
                {location.address}
                <br />
                {location.description}
                <br />
                Price: {location.price}
              </Popup>
            </Marker>
          ))
        ) : (
          <div>No locations available</div>
        )}
        <LocateButton />
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
