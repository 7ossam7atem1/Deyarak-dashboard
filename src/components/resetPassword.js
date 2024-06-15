import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.patch(
        `https://deyarak-app.onrender.com/api/v1/users/resetPassword/${token}`,
        { password, passwordConfirm }
      );

      if (response.data.status === 'success') {
        setMessage('Password has been reset successfully.');
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError('Failed to reset password.');
        setMessage('');
      }
    } catch (error) {
      setError('Error resetting password.');
      setMessage('');
    }
  };

  return (
    <div className='reset-password-form-container'>
      <form
        className='reset-password-form shadow p-3 mb-5 bg-white rounded'
        onSubmit={handleSubmit}
      >
        <h1 className='mb-4'>Reset Password</h1>
        <div className='form-group'>
          <label>New Password:</label>
          <input
            type='password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label>Confirm New Password:</label>
          <input
            type='password'
            className='form-control'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <button className='btn btn-primary btn-block mt-3' type='submit'>
          Reset Password
        </button>
        {message && <p className='text-success mt-3'>{message}</p>}
        {error && <p className='text-danger mt-3'>{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
