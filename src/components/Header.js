import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Header.css';
import logo from '../../src/dashboardicon.png';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(
          'https://deyarak-app.onrender.com/api/v1/users/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  return (
    <header className='navbar navbar-dark bg-dark'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='#'>
          <img src={logo} alt='Logo' className='logo' />
        </a>
        {user && (
          <div className='user-info'>
            {user.photo && (
              <img
                className='user-photo'
                src={user.photo.url}
                alt={user.name}
              />
            )}
            <span className='username'>{user.name}</span>
            <button className='btn btn-light btn-sm' onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
