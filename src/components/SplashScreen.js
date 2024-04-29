import React from "react";
import { Link } from "react-router-dom";
import "../css/SplashScreen.css";

const SplashScreen = () => {
    return (
      <div className="splash-screen">
        <h1>Welcome to Deyarak App</h1>
        <div className="button-container">
          <Link to="/signup" className="signup-button">
            Sign Up
          </Link>
          <Link to="/login" className="login-button">
            Login
          </Link>
        </div>
      </div>
    );
  };
  

export default SplashScreen;
