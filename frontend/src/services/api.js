import axios from 'axios';

// Create generic Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Assuming port 8000 based on previous context 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Or whatever scheme backend uses
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 (Unauthorized) - maybe redirect to login?
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('token');
      // window.location.href = '/#/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
