import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Login.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://deyarak-app.onrender.com/api/v1/users/login',
        {
          email,
          password,
        }
      );

      const { status, token } = response.data;

      if (status === 'success' && token) {
        Cookies.set('token', token, { expires: 90 });
        Cookies.set('userId', response.data.data.user._id);
        window.location.href = '/dashboard';
      } else {
        setError('Login failed');
        setShowError(true);
      }
    } catch (error) {
      setError('Invalid email or password');
      setShowError(true);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className='login-form-container'>
      {!showForgotPassword ? (
        <form
          className='login-form shadow p-3 mb-5 bg-white rounded'
          onSubmit={handleSubmit}
        >
          <h1 className='mb-4'>Login</h1>
          <div className='form-group'>
            <label>Email:</label>
            <input
              type='email'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label>Password:</label>
            <input
              type='password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className='btn btn-primary btn-block mt-3' type='submit'>
            Login
          </button>
          <p className='forgot-password text-right'>
            <a href='#' onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </a>
          </p>
        </form>
      ) : (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}

      {showError && <ErrorPopup message={error} onClose={handleCloseError} />}
    </div>
  );
};

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'https://deyarak-app.onrender.com/api/v1/users/forgotPassword',
        { email }
      );
      setMessage('Password reset link has been sent to your email.');
      setError('');
    } catch (error) {
      setError('Error sending password reset link.');
      setMessage('');
    }
  };

  return (
    <div className='forgot-password-form-container'>
      <form
        className='forgot-password-form shadow p-3 mb-5 bg-white rounded'
        onSubmit={handleForgotPassword}
      >
        <h1 className='mb-4'>Forgot Password</h1>
        <div className='form-group'>
          <label>Email:</label>
          <input
            type='email'
            className='form-control'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className='btn btn-primary btn-block mt-3' type='submit'>
          Send Reset Link
        </button>
        <p className='forgot-password text-right'>
          <a href='#' onClick={onClose}>
            Back to Login
          </a>
        </p>
        {message && <p className='text-success mt-3'>{message}</p>}
        {error && <p className='text-danger mt-3'>{error}</p>}
      </form>
    </div>
  );
};

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className='popup'>
      <div className='popup-content'>
        <span className='close' onClick={onClose}>
          &times;
        </span>
        <p className='text-danger'>{message}</p>
      </div>
    </div>
  );
};

export default LoginForm;
