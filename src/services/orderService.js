import api from './api';

const orderService = {
  list: async (params = {}) => {
    try {
      const response = await api.get('/admin/orders', { params });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getDetails: async (id) => {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  generateFromEnquiry: async (data) => {
    try {
      const response = await api.post('/admin/orders/generate', data);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/admin/orders', data);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/admin/orders/${id}`, data);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateStatus: async (id, status, reason) => {
    try {
      const response = await api.patch(`/admin/orders/${id}/status`, { status, reason });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  uploadDocuments: async (id, files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });
      const response = await api.post(`/admin/orders/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default orderService;
