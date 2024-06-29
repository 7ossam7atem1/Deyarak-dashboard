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
  FaSort,
} from 'react-icons/fa';
import PropertyDetails from './PropertyDetails';
import Cookies from 'js-cookie';

const PropertyController = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://deyarak-app.onrender.com/api/v1/properties?sort=-price,-size`
        );
        console.log('API Response:', response.data);
        if (response.data.status === 'success') {
          setProperties(response.data.data.data || []);
          setFilteredProperties(response.data.data.data || []);
        } else {
          setError('Error fetching properties');
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Error fetching properties');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  useEffect(() => {
    const filtered = properties.filter((property) => {
      return (
        (property.locations?.address || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setFilteredProperties(filtered);
  }, [searchQuery, properties]);

  const handlePropertyClick = (propertyId) => {
    setSelectedProperty(propertyId);
  };

  const handleClosePropertyDetails = () => {
    setSelectedProperty(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = async (propertyId) => {
    try {
      const token = Cookies.get('token');
      await axios.delete(
        `https://deyarak-app.onrender.com/api/v1/properties/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProperties(
        properties.filter((property) => property._id !== propertyId)
      );
      setFilteredProperties(
        filteredProperties.filter((property) => property._id !== propertyId)
      );
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='property-controller container'>
      <h1 className='text-center mt-4'>Properties Collection</h1>
      <div className='controls mb-4 d-flex justify-content-between'>
        <input
          type='text'
          placeholder='Search properties...'
          value={searchQuery}
          onChange={handleSearchChange}
          className='form-control w-50'
        />
        <button
          onClick={() =>
            setFilteredProperties([...filteredProperties].reverse())
          }
          className='btn btn-outline-secondary'
        >
          <FaSort /> Sort
        </button>
      </div>
      {filteredProperties.length === 0 ? (
        <div>No properties found.</div>
      ) : (
        <div className='row'>
          {filteredProperties.map((property) => (
            <div key={property._id} className='col-lg-4 mb-4'>
              <div
                className='card property-item'
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
                <div className='card-body'>
                  <h2 className='card-title'>
                    <FaMapMarkerAlt /> {property.locations?.address}
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
            </div>
          ))}
        </div>
      )}
      <PropertyDetails
        propertyId={selectedProperty}
        show={!!selectedProperty}
        onHide={handleClosePropertyDetails}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PropertyController;
