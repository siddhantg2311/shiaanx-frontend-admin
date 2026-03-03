import api from './api';

const authService = {
  // Register Admin
  register: async (userData) => {
    try {
      const response = await api.post('/admin/auth/register', userData);
      return response; 
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Verify OTP
  verifyOtp: async (data) => {
    try {
      const response = await api.post('/auth/verify-otp', data);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Resend OTP
  resendOtp: async (email) => {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data || response; // Should return { user, token }
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Logout (Local clear)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user && user !== 'undefined' ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }
};

export default authService;
