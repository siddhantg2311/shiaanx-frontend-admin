import api from './api';

const masterAttributeService = {
  // Technologies
  getTechnologies: async (params) => {
    const response = await api.get('/admin/processing-technologies', { params });
    return response.data || response;
  },
  getTechnologyDetails: async (id) => {
    const response = await api.get(`/admin/processing-technologies/${id}`);
    return response.data || response;
  },
  createTechnology: async (data) => {
    const response = await api.post('/admin/processing-technologies', data);
    return response.data || response;
  },
  updateTechnology: async (id, data) => {
    const response = await api.put(`/admin/processing-technologies/${id}`, data);
    return response.data || response;
  },
  deleteTechnology: async (id) => {
    const response = await api.delete(`/admin/processing-technologies/${id}`);
    return response.data || response;
  },

  // Materials
  getMaterials: async (params) => {
    const response = await api.get('/admin/materials', { params });
    return response.data || response;
  },
  getMaterialDetails: async (id) => {
    const response = await api.get(`/admin/materials/${id}`);
    return response.data || response;
  },
  createMaterial: async (data) => {
    const response = await api.post('/admin/materials', data);
    return response.data || response;
  },
  updateMaterial: async (id, data) => {
    const response = await api.put(`/admin/materials/${id}`, data);
    return response.data || response;
  },
  deleteMaterial: async (id) => {
    const response = await api.delete(`/admin/materials/${id}`);
    return response.data || response;
  },

  // Finishes
  getFinishes: async (params) => {
    const response = await api.get('/admin/finishes', { params });
    return response.data || response;
  },
  getFinishDetails: async (id) => {
    const response = await api.get(`/admin/finishes/${id}`);
    return response.data || response;
  },
  createFinish: async (data) => {
    const response = await api.post('/admin/finishes', data);
    return response.data || response;
  },
  updateFinish: async (id, data) => {
    const response = await api.put(`/admin/finishes/${id}`, data);
    return response.data || response;
  },
  deleteFinish: async (id) => {
    const response = await api.delete(`/admin/finishes/${id}`);
    return response.data || response;
  },

  // Common (User/Admin fetch)
  getAllAttributes: async () => {
    const response = await api.get('/common/all');
    return response.data || response;
  },
  getCommonTechnologies: async () => {
    const response = await api.get('/common/technologies');
    return response.data || response;
  },
  getCommonMaterials: async () => {
    const response = await api.get('/common/materials');
    return response.data || response;
  },
  getCommonFinishes: async () => {
    const response = await api.get('/common/finishes');
    return response.data || response;
  },
};

export default masterAttributeService;
