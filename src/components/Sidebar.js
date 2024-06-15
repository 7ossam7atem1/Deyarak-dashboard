import React from 'react';
import { FaUser, FaBuilding, FaUsers, FaPhone, FaAdjust } from 'react-icons/fa';
import '../css/SideBar.css';

const Sidebar = ({ setActiveTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <aside>
      <nav>
        <ul>
          <li>
            <button
              onClick={() => handleTabClick('controller')}
              className='btn'
            >
              <FaAdjust className='me-2' /> View Properties
            </button>
          </li>
          <li>
            <button onClick={() => handleTabClick('profile')} className='btn'>
              <FaUser className='me-2' /> Your Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick('properties')}
              className='btn'
            >
              <FaBuilding className='me-2' /> Properties Stats
            </button>
          </li>
          <li>
            <button onClick={() => handleTabClick('users')} className='btn'>
              <FaUsers className='me-2' /> Users
            </button>
          </li>
          <li>
            <button onClick={() => handleTabClick('contacts')} className='btn'>
              <FaPhone className='me-2' /> Contact Users
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
