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

export const getStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const adminDashboardService = {
  getStats,
};

export default adminDashboardService;
