import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Profile from "./Profile";
import Properties from "./Properties";
import Users from "./Users";
import Contacts from "./Contacts";
import PropertyController from "./PropertyController";
import "../css/Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("controller");

  return (
    <div className="dashboard-container">
      <Header />
      <div className="content-container">
        <Sidebar setActiveTab={setActiveTab} />
        <main className="main-content">
          {activeTab === "profile" && <Profile />}
          {activeTab === "properties" && <Properties />}
          {activeTab === "users" && <Users />}
          {activeTab === "contacts" && <Contacts />}
          {activeTab === "controller" && <PropertyController />}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;