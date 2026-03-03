import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const from = location.state?.from?.pathname || '/home';

  useEffect(() => {
    if (user) {
      console.log("Admin detected, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      // Optional: Check if role is ADMIN
      if (data.user.role !== 'ADMIN' && data.user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized: Admin access required.');
      }
      toast.success('Admin login successful!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Forgot password? <span onClick={() => navigate('/signup')} className="link">Contact IT</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
