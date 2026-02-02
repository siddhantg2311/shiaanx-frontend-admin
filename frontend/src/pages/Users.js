import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiHome, FiUsers, FiShoppingBag, FiMessageSquare, FiSearch, FiUser, FiBell, FiSettings, FiPackage, FiTrendingUp, FiEdit, FiTrash } from 'react-icons/fi';
import '../styles/Users.css';

function Users() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const users = [
    {
      id: 1,
      name: 'Nandini Kumar',
      email: 'nandini.k@example.com',
      phone: '+91 98765 43210',
      joinDate: '2025-12-15',
      totalOrders: 12,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43211',
      joinDate: '2026-01-03',
      totalOrders: 8,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      phone: '+91 98765 43212',
      joinDate: '2026-01-10',
      totalOrders: 5,
      status: 'Active'
    }
  ];

  return (
    <div className="users-container">
      {/* Top Navigation Bar */}
      <div className="topbar">
        <button className="menu-btn" onClick={toggleSidebar}>
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

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={process.env.PUBLIC_URL + '/logoimg.png'} alt="ShiaanX" className="sidebar-logo" />
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => { navigate('/home'); setSidebarOpen(false); }}>
            <FiHome size={20} />
            <span>Dashboard</span>
          </div>
          
          <div className="nav-item active" onClick={() => { navigate('/users'); setSidebarOpen(false); }}>
            <FiUsers size={20} />
            <span>User Management</span>
          </div>
          
          <div className="nav-item" onClick={() => { navigate('/enquiries'); setSidebarOpen(false); }}>
            <FiMessageSquare size={20} />
            <span>All Enquiries</span>
          </div>
          
          <div className="nav-item" onClick={() => { navigate('/orders'); setSidebarOpen(false); }}>
            <FiShoppingBag size={20} />
            <span>All Orders</span>
          </div>
          
          <div className="nav-item" onClick={() => { navigate('/vendors'); setSidebarOpen(false); }}>
            <FiPackage size={20} />
            <span>Vendor Management</span>
          </div>
          
          <div className="nav-item" onClick={() => { navigate('/analytics'); setSidebarOpen(false); }}>
            <FiTrendingUp size={20} />
            <span>Analytics</span>
          </div>
        </nav>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* Main Content */}
      <div className="main-content">
        <div className="page-header">
          <div className="header-left">
            <h1>User Management</h1>
            <div className="user-stats">
              <span>Total Users: <strong>{users.length}</strong></span>
              <span className="stat-divider">|</span>
              <span>Active: <strong>{users.filter(u => u.status === 'Active').length}</strong></span>
            </div>
          </div>
          <div className="header-buttons">
            <button className="new-user-btn">
              <FiUsers size={18} />
              Add New User
            </button>
          </div>
        </div>

        <div className="search-bar">
          <FiSearch size={20} color="#999" />
          <input type="text" placeholder="Search users by name, email, or phone..." />
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Join Date</th>
                <th>Total Orders</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.joinDate}</td>
                  <td>{user.totalOrders}</td>
                  <td>
                    <span className="status-badge active">{user.status}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-icon-btn edit">
                        <FiEdit size={16} />
                      </button>
                      <button className="action-icon-btn delete">
                        <FiTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
