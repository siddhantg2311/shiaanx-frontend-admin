import api from './api';

const userService = {
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  createUser: async (data) => {
    try {
      const response = await api.post('/admin/users', data);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/admin/users/${id}`, data);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  changePassword: async (id, data) => {
    try {
      const response = await api.put(`/admin/users/${id}/change-password`, data);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default userService;
