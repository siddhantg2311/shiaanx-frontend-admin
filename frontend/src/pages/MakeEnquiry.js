import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiHome, FiUsers, FiShoppingBag, FiMessageSquare, FiUser, FiBell, FiSettings, FiPackage, FiTrendingUp, FiUpload, FiX } from 'react-icons/fi';
import '../styles/MakeEnquiry.css';

function MakeEnquiry() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    vendorId: '',
    processingTechnology: '',
    material: '',
    finishes: '',
    quantity: '',
    remarks: '',
    shippingAddress: '',
    extraDetails: ''
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files.map(f => f.name)]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Enquiry submitted:', formData);
    alert('Enquiry created successfully!');
    navigate('/enquiries');
  };

  // Sample data for dropdowns
  const users = [
    { id: 'U001', name: 'Nandini Kumar' },
    { id: 'U002', name: 'Rahul Sharma' },
    { id: 'U003', name: 'Priya Singh' }
  ];

  const vendors = [
    { id: 'V001', name: 'ABC Manufacturing Ltd.' },
    { id: 'V002', name: 'XYZ Industries' },
    { id: 'V003', name: 'Tech Parts Ltd' }
  ];

  const technologies = [
    'CNC Machining',
    '3D Printing',
    'Sheet Metal Fabrication',
    'Injection Molding',
    'Casting',
    'Laser Cutting'
  ];

  const materials = [
    'Aluminum 6061',
    'Stainless Steel 304',
    'Mild Steel',
    'ABS Plastic',
    'PLA',
    'Brass',
    'Copper'
  ];

  const finishes = [
    'Anodized Blue',
    'Powder Coated',
    'Polished',
    'Brushed',
    'Nickel Plated',
    'Chrome Plated',
    'As Machined'
  ];

  return (
    <div className="make-enquiry-container">
      {/* Top Navigation Bar */}
      <div className="topbar">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FiMenu size={24} />
        </button>
        <h2 className="page-title">Make Enquiry (On Behalf of Customer)</h2>
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
          
          <div className="nav-item active" onClick={() => { navigate('/enquiries'); setSidebarOpen(false); }}>
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
        <form onSubmit={handleSubmit}>
          <div className="form-wrapper">
            {/* Left Column */}
            <div className="left-column">
              <div className="form-section">
                <label>Customer Name / User ID</label>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  required
                  className="custom-select"
                >
                  <option value="">Select Customer</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} (ID: {user.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Assign to Vendor</label>
                <select
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleInputChange}
                  required
                  className="custom-select"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Processing Technology</label>
                <select
                  name="processingTechnology"
                  value={formData.processingTechnology}
                  onChange={handleInputChange}
                  required
                  className="custom-select"
                >
                  <option value="">Select Technology</option>
                  {technologies.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Material</label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  required
                  className="custom-select"
                >
                  <option value="">Select Material</option>
                  {materials.map(mat => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Finishes</label>
                <select
                  name="finishes"
                  value={formData.finishes}
                  onChange={handleInputChange}
                  required
                  className="custom-select"
                >
                  <option value="">Select Finish</option>
                  {finishes.map(finish => (
                    <option key={finish} value={finish}>{finish}</option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  required
                  className="custom-input"
                  min="1"
                />
              </div>

              <div className="form-section">
                <label>Remarks / Special Instructions</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Enter any special instructions or requirements..."
                  className="custom-textarea"
                  rows="4"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="right-column">
              <div className="upload-section">
                <h3>Upload Documents</h3>
                <p className="upload-hint">CAD files, drawings, specifications, etc.</p>
                
                <label className="file-upload-label">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="file-input"
                    accept=".pdf,.dwg,.dxf,.step,.stp,.stl,.jpg,.jpeg,.png"
                  />
                  <div className="upload-area">
                    <FiUpload size={32} />
                    <span>Click to upload or drag and drop</span>
                    <span className="file-types">PDF, DWG, DXF, STEP, STL, Images</span>
                  </div>
                </label>

                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files">
                    <h4>Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-name">{file}</span>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => removeFile(index)}
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-section">
                <label>Shipping Address</label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="Enter shipping address..."
                  className="custom-textarea"
                  rows="4"
                  required
                />
              </div>

              <div className="form-section">
                <label>Bill / Extra Details</label>
                <textarea
                  name="extraDetails"
                  value={formData.extraDetails}
                  onChange={handleInputChange}
                  placeholder="Enter billing information or additional details..."
                  className="custom-textarea"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button type="button" className="cancel-btn" onClick={() => navigate('/enquiries')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MakeEnquiry;
