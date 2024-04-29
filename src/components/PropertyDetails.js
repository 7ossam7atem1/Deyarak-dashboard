import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Carousel } from "react-bootstrap";
import { FaBed, FaBath, FaDollarSign, FaRuler, FaHome } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/PropertyDetails.css";
import L from "leaflet";
import Cookies from "js-cookie";

delete L.Icon.Default.prototype._getIconUrl;

const PropertyDetails = ({ propertyId, show, onHide }) => {
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await axios.get(
          `https://deyarak-app.onrender.com/api/v1/properties/${propertyId}`
        );
        if (response.data.status === "success") {
          setProperty(response.data.data?.data || {});
        } else {
          setError("Error fetching property details");
        }
      } catch (error) {
        setError("Error fetching property details");
      }
    }

    if (show && propertyId) {
      fetchProperty();
    }
  }, [propertyId, show, deleted]);

  const handleDelete = async () => {
    try {
      const token = Cookies.get("token");
      await axios.delete(
        `https://deyarak-app.onrender.com/api/v1/properties/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDeleted(true);
      onHide();
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      className="property-details-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Property Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div>{error}</div>}
        {property && (
          <div className="property-container">
            <div className="property-images">
              {property.images && property.images.length > 0 ? (
                <Carousel>
                  {property.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100 carousel-img"
                        src={image.url}
                        alt={`Slide ${index + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="property-details-info">
              <div className="property-info">
                <h2>
                  <FaBed /> {property.numberOfRooms} Bedrooms
                </h2>
                <h2>
                  <FaBath /> {property.numberOfBathrooms} Bathrooms
                </h2>
                <div>
                  <FaDollarSign /> Price: ${property.price}
                </div>
                <div>
                  <FaRuler /> Size: {property.size} sqm
                </div>
                <div>
                  <FaHome /> Category: {property.category}
                </div>
                <div>Furnished: {property.furnished ? "Yes" : "No"}</div>
                <div>Finished: {property.finished ? "Yes" : "No"}</div>
                <div>Elevator: {property.elevator ? "Yes" : "No"}</div>
                <div>Age: {property.propertyAge} years</div>
                <div>Total Rooms: {property.totalRooms}</div>
                <div className="amenities">
                  <h3>Amenities</h3>
                  <ul className="amenities-list">
                    {property.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
                <p>
                  <strong>Description:</strong> {property.description}
                </p>
              </div>
              <div className="owner-info">
                <div className="owner-photo">
                  <img src={property.owner?.photo?.url} alt="Owner" />
                </div>
                <div className="owner-details">
                  <h3>Owner</h3>
                  <div>
                    <strong>Name:</strong> {property.owner?.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {property.owner?.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {property.owner?.phone}
                  </div>
                </div>
              </div>
            </div>
            <div className="property-buttons">
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
            {property.locations && (
              <div className="property-map">
                <MapContainer
                  center={[
                    property.locations.coordinates[1],
                    property.locations.coordinates[0],
                  ]}
                  zoom={11}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Deyarak</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {property.locations && (
                    <Marker
                      position={[
                        property.locations.coordinates[0],
                        property.locations.coordinates[1],
                      ]}
                      icon={L.divIcon({ className: "custom-marker" })}
                    >
                      <Popup>{property.locations.address}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PropertyDetails;
