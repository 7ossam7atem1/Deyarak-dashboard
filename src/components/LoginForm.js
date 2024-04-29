import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../css/Login.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://deyarak-app.onrender.com/api/v1/users/login",
        {
          email,
          password,
        }
      );

      const { status, token } = response.data;

      if (status === "success" && token) {
        Cookies.set("token", token, { expires: 7 });
        window.location.href = "/dashboard";
      } else {
        setError("Login failed");
        setShowError(true);
      }
    } catch (error) {
      setError("Invalid email or password");
      setShowError(true);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <div className="login-form-container">
      <form className="login-form shadow p-3 mb-5 bg-white rounded" onSubmit={handleSubmit}>
        <h1 className="mb-4">Login</h1>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary btn-block mt-3" type="submit">
          Login
        </button>
      </form>

      {showError && <ErrorPopup message={error} onClose={handleCloseError} />}
    </div>
  );
};

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <p className="text-danger">{message}</p>
      </div>
    </div>
  );
};

export default LoginForm;
