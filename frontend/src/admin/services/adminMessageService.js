import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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

export const getMessages = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/messages', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMessage = async (id) => {
  try {
    const response = await axiosInstance.get(`/messages/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await axiosInstance.put(`/messages/${id}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMessage = async (id) => {
  try {
    const response = await axiosInstance.delete(`/messages/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const adminMessageService = {
  getMessages,
  getMessage,
  markAsRead,
  deleteMessage,
};

export default adminMessageService;

