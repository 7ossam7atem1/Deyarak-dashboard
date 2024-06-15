import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(
          'https://deyarak-app.onrender.com/api/v1/users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const filteredUsers = response.data.data.data.filter(
          (user) => user.role !== 'admin'
        );
        setUsers(filteredUsers);
        setLoading(false);
      } catch (error) {
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user account? This action is irreversible.'
    );

    if (confirmDelete) {
      try {
        const token = Cookies.get('token');
        await axios.delete(
          `https://deyarak-app.onrender.com/api/v1/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setEditedUserData({
      name: user.name,
      email: user.email,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    try {
      const token = Cookies.get('token');
      const updatedUser = {
        name: editedUserData.name,
        email: editedUserData.email,
      };
      await axios.patch(
        `https://deyarak-app.onrender.com/api/v1/users/${selectedUser._id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id ? { ...user, ...updatedUser } : user
      );
      setUsers(updatedUsers);

      setShowModal(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container mt-4'>
      <h2 className='text-center mb-4'>Users</h2>
      <div className='input-group mb-3'>
        <input
          type='text'
          className='form-control'
          placeholder='Search by name'
          aria-label='Search by name'
          aria-describedby='search-button'
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className='btn btn-outline-secondary'
          type='button'
          id='search-button'
        >
          Search
        </button>
      </div>
      <div className='row row-cols-1 row-cols-md-3 g-4'>
        {Array.isArray(filteredUsers) &&
          filteredUsers.map((user) => (
            <div className='col' key={user._id}>
              <div className='card h-100'>
                <img
                  src={user.photo.url}
                  className='card-img-top rounded-circle'
                  alt={user.name}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                  }}
                />
                <div className='card-body'>
                  <h5 className='card-title'>{user.name}</h5>
                  <p className='card-text'>{user.email}</p>
                </div>
                <div className='card-footer'>
                  <button
                    className='btn btn-primary me-2'
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Modal */}
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='modal-close' onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Edit User</h2>
            <form>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>
                  Name
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='name'
                  value={editedUserData.name}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='email' className='form-label'>
                  Email
                </label>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  value={editedUserData.email}
                  onChange={(e) =>
                    setEditedUserData({
                      ...editedUserData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type='button'
                className='btn btn-primary'
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                type='button'
                className='btn btn-secondary ms-2'
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
