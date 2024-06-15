import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/PropertyCard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaDollarSign,
  FaExpand,
} from 'react-icons/fa';
import PropertyDetails from './PropertyDetails';

const PropertyController = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await axios.get(
          'https://deyarak-app.onrender.com/api/v1/properties'
        );
        if (response.data.status === 'success') {
          setProperties(response.data.data.data || []);
        } else {
          setError('Error fetching properties');
        }
      } catch (error) {
        setError('Error fetching properties');
      }
    }

    fetchProperties();
  }, []);

  const handlePropertyClick = (propertyId) => {
    setSelectedProperty(propertyId);
  };

  const handleClosePropertyDetails = () => {
    setSelectedProperty(null);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='property-controller'>
      <h1>Properties Collection</h1>
      <br></br>
      <div className='property-list'>
        {properties.map((property) => (
          <div
            key={property._id}
            className='property-item'
            onClick={() => handlePropertyClick(property._id)}
          >
            <div className='carousel-container'>
              <Carousel>
                {property.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className='d-block w-100'
                      src={image.url}
                      alt={`Slide ${index + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
            <div className='property-details'>
              <h2>
                <FaMapMarkerAlt /> {property.locations.address}
              </h2>
              <p>
                <FaDollarSign /> Price: ${property.price}
              </p>
              <p className='description'>{property.description}</p>
              <p>
                <FaBed /> Number of Rooms: {property.numberOfRooms}
              </p>
              <p>
                <FaBath /> Number of Bathrooms: {property.numberOfBathrooms}
              </p>
              <p>
                <FaExpand /> Size: {property.size} sqm
              </p>
            </div>
          </div>
        ))}
      </div>
      <PropertyDetails
        propertyId={selectedProperty}
        show={!!selectedProperty}
        onHide={handleClosePropertyDetails}
      />
    </div>
  );
};

export default PropertyController;
