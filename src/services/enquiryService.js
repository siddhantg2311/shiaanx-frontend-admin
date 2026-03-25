"use strict";

import api from './api';

const enquiryService = {
  getEnquiries: async (params = {}) => {
    try {
      const response = await api.get('/admin/enquiries', { params });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getEnquiryDetails: async (id) => {
    try {
      const response = await api.get(`/admin/enquiries/${id}`);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateEnquiryStatus: async (id, status, reason) => {
    try {
      const response = await api.patch(`/admin/enquiries/${id}/status`, { status, reason });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  addMessage: async (id, message) => {
    try {
      const response = await api.post(`/admin/enquiries/${id}/messages`, { message });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  getConfig: async () => {
    try {
      const response = await api.get('/customer/enquiries/config');
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  createEnquiry: async (data) => {
    try {
      const response = await api.post('/admin/enquiries', data);
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  uploadEnquiryDocuments: async (id, documents, enquiryPartId = null, documentType = 'OTHER', remarks = '') => {
    try {
      const formData = new FormData();
      documents.forEach(doc => {
        formData.append('documents', doc);
      });

      if (enquiryPartId) {
        formData.append('enquiry_part_id', enquiryPartId);
      }

      if (documentType) {
        formData.append('document_type', documentType);
      }

      if (remarks) {
        formData.append('remarks', remarks);
      }

      const response = await api.post(`/admin/enquiries/${id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  rejectPO: async (id, reason) => {
    try {
      const response = await api.patch(`/admin/enquiries/${id}/reject-po`, { reason });
      return response.data || response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default enquiryService;
