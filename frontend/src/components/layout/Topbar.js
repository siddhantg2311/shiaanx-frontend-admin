import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiUser, FiBell, FiSettings } from 'react-icons/fi';
import '../../styles/Enquiries.css'; // Reusing existing styles

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="topbar">
      <button className="menu-btn" onClick={onMenuClick}>
        <FiMenu size={24} />
      </button>
      <div className="topbar-right">
        <div className="topbar-icons">
          <button className="icon-btn">
            <FiUser size={20} />
          </button>
          <button className="icon-btn">
            <FiBell size={20} />
          </button>
          <button className="icon-btn" onClick={toggleSettings}>
            <FiSettings size={20} />
          </button>
          {settingsOpen && (
            <div className="settings-dropdown">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
        <img src={process.env.PUBLIC_URL + '/logoimg.png'} alt="ShiaanX" className="topbar-logo-img" />
      </div>
    </div>
  );
};

export default Topbar;
