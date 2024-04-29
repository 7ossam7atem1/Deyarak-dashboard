import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/SignUp.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    role: "admin",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { name, email, password, passwordConfirm, phone } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      email,
      password,
      passwordConfirm,
      phone,
      role: "admin",
    };

    try {
      if (!name || !email || !password || !passwordConfirm || !phone) {
        setError("Please fill in all fields.");
        return;
      }
      if (password !== passwordConfirm) {
        setError("Passwords do not match.");
        return;
      }

      const response = await axios.post(
        "https://deyarak-app.onrender.com/api/v1/users/signup",
        payload
      );

      if (response.status >= 200 && response.status < 300) {
        setMessage("User successfully registered");
        setFormData({
          name: "",
          email: "",
          password: "",
          passwordConfirm: "",
          phone: "",
          role: "admin",
        });
      } else {
        setError("An error occurred. Please try again later.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const handleCloseMessage = () => {
    setMessage("");
    setError("");
  };

  return (
    <div className="signup-form-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="button">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
      {error && (
        <div className="error-popup">
          <div className="message">{error}</div>
          <button onClick={handleCloseMessage}>Close</button>
        </div>
      )}
      {message && (
        <div className="success-popup">
          <div className="message">{message}</div>
          <button onClick={handleCloseMessage}>Close</button>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
