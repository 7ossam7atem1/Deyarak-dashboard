import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FiMail, FiPhone } from 'react-icons/fi';
import { BsFillPersonFill } from 'react-icons/bs';
import '../css/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    email: '',
    phone: '',
    photo: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
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
        setLoading(false);
      } catch (error) {
        setError('Error fetching profile data');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isModalOpen, isChangePasswordModalOpen]);

  const handleUpdate = () => {
    setIsModalOpen(true);
    if (user) {
      setUpdatedUser({
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: null,
      });
    }
  };

  const handlePasswordChange = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpdatedUser({ ...updatedUser, photo: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const formData = new FormData();
      formData.append('name', updatedUser.name);
      formData.append('email', updatedUser.email);
      formData.append('phone', updatedUser.phone);
      if (updatedUser.photo) {
        formData.append('photo', updatedUser.photo);
      }
      const response = await axios.patch(
        'https://deyarak-app.onrender.com/api/v1/users/updateMe',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const userId = Cookies.get('userId');
      console.log(userId);
      const response = await axios.patch(
        `https://deyarak-app.onrender.com/api/v1/users/updateMyPassword/${userId}`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsChangePasswordModalOpen(false);
      window.location.href = '/login';
    } catch (error) {
      setError('Error updating password: Please check your inputs');
      console.error('Error updating password:', error);
    }
  };

  return (
    <div className='profile-container'>
      <div className='profile-card'>
        <div className='profile-header'>
          <div className='profile-picture'>
            {user && user.photo && <img src={user.photo.url} alt='Profile' />}
          </div>
          <div className='profile-info'>
            <h2 className='profile-name'>{user && user.name}</h2>
            <div className='profile-details'>
              <p className='profile-detail'>
                <FiMail className='icon' />
                {user && user.email}
              </p>
              <p className='profile-detail'>
                <FiPhone className='icon' />
                {user && user.phone}
              </p>
              <p className='profile-detail'>
                <BsFillPersonFill className='icon' />
                {user && user.role}
              </p>
            </div>
            <button className='update-button' onClick={handleUpdate}>
              Update Profile
            </button>
            <button className='update-button' onClick={handlePasswordChange}>
              Change Password
            </button>
          </div>
        </div>
      </div>
      <div className={`modal ${isModalOpen ? 'show' : ''}`}>
        <div className='modal-content'>
          <form onSubmit={handleSubmit} className='update-form'>
            <label>
              Name:
              <input
                type='text'
                name='name'
                value={updatedUser.name}
                onChange={handleInputChange}
                className='update-input'
              />
            </label>
            <label>
              Email:
              <input
                type='email'
                name='email'
                value={updatedUser.email}
                onChange={handleInputChange}
                className='update-input'
              />
            </label>
            <label>
              Phone:
              <input
                type='text'
                name='phone'
                value={updatedUser.phone}
                onChange={handleInputChange}
                className='update-input'
              />
            </label>
            <label>
              Profile Picture:
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='update-input'
              />
            </label>
            <button type='submit' className='update-button'>
              Update
            </button>
            <button
              type='button'
              className='close-modal'
              onClick={handleCloseModal}
            >
              Close
            </button>
          </form>
        </div>
      </div>
      <div className={`modal ${isChangePasswordModalOpen ? 'show' : ''}`}>
        <div className='modal-content'>
          <form onSubmit={handleChangePassword} className='update-form'>
            <label>
              Current Password:
              <input
                type='password'
                name='currentPassword'
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className='update-input'
              />
            </label>
            <label>
              New Password:
              <input
                type='password'
                name='newPassword'
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className='update-input'
              />
            </label>
            <label>
              Confirm New Password:
              <input
                type='password'
                name='newPasswordConfirm'
                value={passwordData.newPasswordConfirm}
                onChange={handlePasswordInputChange}
                className='update-input'
              />
            </label>
            {error && <div className='error-message'>{error}</div>}
            <button type='submit' className='update-button'>
              Change Password
            </button>
            <button
              type='button'
              className='close-modal'
              onClick={handleCloseChangePasswordModal}
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
