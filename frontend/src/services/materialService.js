import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const materialService = {
  // Get all materials
  getMaterials: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/materials', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single material
  getMaterial: async (id) => {
    try {
      const response = await axiosInstance.get(`/materials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create material (admin)
  createMaterial: async (materialData) => {
    try {
      const response = await axiosInstance.post('/materials', materialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update material (admin)
  updateMaterial: async (id, materialData) => {
    try {
      const response = await axiosInstance.put(`/materials/${id}`, materialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete material (admin)
  deleteMaterial: async (id) => {
    try {
      const response = await axiosInstance.delete(`/materials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default materialService;
