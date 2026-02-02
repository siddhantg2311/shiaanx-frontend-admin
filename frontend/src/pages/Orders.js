import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiHome, FiUsers, FiShoppingBag, FiMessageSquare, FiPackage, FiTruck, FiSearch, FiUser, FiBell, FiSettings, FiTrendingUp } from 'react-icons/fi';
import '../styles/Orders.css';

function Orders() {
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

  // Sample orders data
  const orders = [
    {
      id: 'Item #19203',
      user: 'Nandini Kumar',
      product: 'Screw Driver',
      quantity: 1,
      total: 299.99,
      date: '2026-02-02',
      status: 'Delivered',
      trackingId: 'TRK123456789',
      vendor: 'ABC Manufacturing'
    },
    {
      id: 'Item #18093',
      user: 'Rahul Sharma',
      product: 'Truck Component',
      quantity: 2,
      total: 149.98,
      date: '2026-02-03',
      status: 'In Transit',
      trackingId: 'TRK987654321',
      vendor: 'XYZ Industries'
    },
    {
      id: 'Item #12394',
      user: 'Priya Singh',
      product: 'Maneuver Gear A',
      quantity: 1,
      total: 79.99,
      date: '2026-02-04',
      status: 'Processing',
      trackingId: 'TRK456789123',
      vendor: 'Tech Parts Ltd'
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered':
        return <FiPackage size={18} />;
      case 'In Transit':
        return <FiTruck size={18} />;
      default:
        return <FiShoppingBag size={18} />;
    }
  };

  return (
    <div className="orders-container">
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
          
          <div className="nav-item" onClick={() => { navigate('/users'); setSidebarOpen(false); }}>
            <FiUsers size={20} />
            <span>User Management</span>
          </div>
          
          <div className="nav-item" onClick={() => { navigate('/enquiries'); setSidebarOpen(false); }}>
            <FiMessageSquare size={20} />
            <span>All Enquiries</span>
          </div>
          
          <div className="nav-item active" onClick={() => { navigate('/orders'); setSidebarOpen(false); }}>
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
          <h1>All Orders</h1>
        </div>

        <div className="search-bar">
          <FiSearch size={20} color="#999" />
          <input type="text" placeholder="Search orders by ID, user, product, or vendor..." />
        </div>

        <div className="orders-stats">
          <div className="stat-card">
            <div className="stat-icon processing">
              <FiShoppingBag size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">1</span>
              <span className="stat-label">Processing</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon transit">
              <FiTruck size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">1</span>
              <span className="stat-label">In Transit</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon delivered">
              <FiPackage size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">1</span>
              <span className="stat-label">Delivered</span>
            </div>
          </div>
        </div>

        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id-section">
                  <span className="order-id">{order.id}</span>
                  <span className="order-date">{order.date}</span>
                </div>
                <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <div className="product-info">
                  <h3>{order.product}</h3>
                  <p>User: {order.user}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Vendor: {order.vendor}</p>
                  <p className="tracking">Tracking: {order.trackingId}</p>
                </div>
                <div className="order-price">
                  <span className="price-label">Total</span>
                  <span className="price-value">${order.total}</span>
                </div>
              </div>
              
              <div className="order-actions">
                <button className="action-btn secondary" onClick={() => navigate('/track-order')}>Track Timeline</button>
                <button className="action-btn primary" onClick={() => navigate('/view-details')}>View Details</button>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="empty-state">
            <FiShoppingBag size={64} color="#ccc" />
            <h3>No Orders Yet</h3>
            <p>No orders have been placed on the platform yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
