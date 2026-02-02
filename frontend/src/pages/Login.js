import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend validation for now - any entry takes to home
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-section">
          <img src={process.env.PUBLIC_URL + '/logoimg.png'} alt="ShiaanX Logo" className="logo" />
        </div>
        <h2>Admin Portal</h2>
        <p className="subtitle">Log in to admin dashboard</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your admin email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="login-btn">Log In</button>
        </form>
        
        <div className="login-footer">
          <p>Forgot password? <span onClick={() => navigate('/signup')} className="link">Contact IT</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
