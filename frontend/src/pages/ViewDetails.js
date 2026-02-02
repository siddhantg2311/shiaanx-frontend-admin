import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiHome, FiUsers, FiShoppingBag, FiMessageSquare, FiUser, FiBell, FiSettings, FiPackage, FiTrendingUp } from 'react-icons/fi';
import '../styles/ViewDetails.css';

function ViewDetails() {
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
    <div className="view-details-container">
      {/* Top Navigation Bar */}
      <div className="topbar">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
        <h2 className="page-title">Order Details</h2>
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
        <div className="content-wrapper">
          {/* Left Column */}
          <div className="left-column">
            <div className="item-id-section">
              <span className="item-label">Item ID:</span>
              <span className="item-value">#123456</span>
            </div>

            <div className="field-section">
              <label>Customer:</label>
              <div className="blue-box">Nandini Kumar</div>
            </div>

            <div className="field-section">
              <label>Processing Technology:</label>
              <div className="blue-box">CNC Machining</div>
            </div>

            <div className="field-section">
              <label>Material:</label>
              <div className="blue-box">Aluminum 6061</div>
            </div>

            <div className="field-section">
              <label>Finishes:</label>
              <div className="blue-box">Anodized Blue</div>
            </div>

            <div className="field-section">
              <label>Customer Remarks:</label>
              <div className="blue-box">Please ensure tight tolerances on mounting holes. Quality inspection required.</div>
            </div>

            <div className="field-section">
              <label>Quantity:</label>
              <div className="blue-box">5 units</div>
            </div>

            <div className="field-section">
              <label>Assigned Vendor:</label>
              <div className="blue-box">ABC Manufacturing Ltd.</div>
            </div>

            <div className="order-info">
              <p>Order placed on: <strong>11th Jan 2025</strong></p>
            </div>

            <button className="view-timeline-btn" onClick={() => navigate('/track-order')}>View Timeline</button>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="documents-box">
              <h3>Customer Uploaded Documents (Click to View)</h3>
              <div className="document-link">&gt; design_specs.pdf</div>
              <div className="document-link">&gt; cad_file_v1.dwg</div>
              <div className="document-link">&gt; reference_image.jpg</div>
              <div className="document-link">&gt; tolerance_sheet.pdf</div>
              <div className="document-link">&gt; material_certificate.pdf</div>
            </div>

            <div className="field-section">
              <label>Shipping Address:</label>
              <div className="blue-box">
Plot No. 47, 3rd Floor,<br />
Industrial Estate Phase II,<br />
Near Metro Pillar 218, Okhla Industrial Area,<br />
New Delhi – 110020,<br />
Delhi, India</div>
            </div>

            <div className="field-section">
              <label>Bill / Extra Details:</label>
              <div className="blue-box">Rush order. Please expedite processing. Contact before dispatch.</div>
            </div>

            <div className="field-section">
              <label>Total Amount:</label>
              <div className="blue-box">₹24,999.00</div>
            </div>
          </div>
        </div>

        <div className="tip-section">
          <p>Admin Note: This view shows complete order information submitted by the customer. To see vendor updates and timeline, navigate to Track Timeline.</p>
        </div>
      </div>
    </div>
  );
}

export default ViewDetails;
