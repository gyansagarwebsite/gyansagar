import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://gyansagar.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMaterials = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/materials', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMaterial = async (id) => {
  try {
    const response = await axiosInstance.get(`/materials/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMaterial = async (materialData) => {
  try {
    const response = await axiosInstance.post('/materials', materialData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadMaterialPdf = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axiosInstance.post('/materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMaterial = async (id, materialData) => {
  try {
    const response = await axiosInstance.put(`/materials/${id}`, materialData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMaterial = async (id) => {
  try {
    const response = await axiosInstance.delete(`/materials/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const adminMaterialService = {
  getMaterials,
  getMaterial,
  uploadMaterialPdf,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};

export default adminMaterialService;


