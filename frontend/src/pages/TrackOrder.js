import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiHome, FiUsers, FiShoppingBag, FiMessageSquare, FiUser, FiBell, FiSettings, FiPackage, FiTrendingUp } from 'react-icons/fi';
import '../styles/TrackOrder.css';

function TrackOrder() {
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

  return (
    <div className="track-order-container">
      {/* Top Navigation Bar */}
      <div className="topbar">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
        <h2 className="page-title">Order Timeline</h2>
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
        <div className="item-id-section">
          <span className="item-label">Item ID:</span>
          <span className="item-value">#123456</span>
          <span className="item-label" style={{marginLeft: '20px'}}>User:</span>
          <span className="item-value">Nandini Kumar</span>
        </div>

        {/* Vendor Documents and Remarks Box */}
        <div className="split-box">
          <div className="split-left">
            <h3>Vendor Uploaded Documents (Click to View)</h3>

            <div className="document-item">
              <div className="document-link">&gt; manufacturing_specs.pdf</div>
            </div>
            <div className="document-item">
              <div className="document-link">&gt; quality_report.pdf</div>
            </div>
            <div className="document-item">
              <div className="document-link">&gt; shipping_invoice.pdf</div>
            </div>

          </div>
          <div className="divider"></div>
          <div className="split-right">
            <h3>Vendor Remarks</h3>
            <div className="remark-item">
              <p>Initial design approved. Proceeding with manufacturing.</p>
            </div>
            <div className="remark-item">
              <p>Quality inspection report attached. All parameters within tolerance. Ready for shipment.</p>
            </div>
            <div className="remark-item">
              <p>Shipment dispatched. Estimated delivery: 3-5 business days.</p>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="bottom-left">
            <div className="field-section">
              <label>Order placed on:</label>
              <div className="blue-box">11th Jan 2025</div>
            </div>
            <div className="field-section">
              <label>Status:</label>
              <div className="blue-box"><span className="status-pending">In Transit</span></div>
            </div>
            <button className="view-timeline-btn">View Full Timeline</button>
          </div>
          <div className="bottom-right">
            <label>Current Step:</label>
            <div className="blue-box">Shipping & Delivery</div>
          </div>
        </div>

        <div className="tip-section">
          <p>Admin Note: This timeline view shows vendor updates and progress reports. To view customer order details, use View Details.</p>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
