import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaUserTie, FaEnvelope, FaPhone, FaSpinner } from "react-icons/fa";
import "../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          "https://deyarak-app.onrender.com/api/v1/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching profile data");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-container loading">
        <FaSpinner className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-picture">
            {user.photo && <img src={user.photo.url} alt="Profile" />}
          </div>
          <h2 className="profile-name">{user.name}</h2>
          <div className="profile-details">
            <p className="profile-detail">
              <FaEnvelope className="text-primary icon" />
              {user.email}
            </p>
            <p className="profile-detail">
              <FaPhone className="text-primary icon" />
              {user.phone}
            </p>
            <p className="profile-detail">
              <FaUserTie className="text-primary icon" />
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
