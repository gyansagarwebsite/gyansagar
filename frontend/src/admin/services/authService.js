import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://gyansagar.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token interceptor to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return false;
    
    try {
      // Basic validation: check if token is a valid JWT format
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      localStorage.removeItem('adminToken');
      return false;
    }
  },

  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
      }
      throw error;
    }
  },

  createAdmin: async (adminData) => {
    try {
      const response = await api.post('/auth/create', adminData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;

