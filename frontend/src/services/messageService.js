import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://gyansagar.onrender.com/api';

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

export const messageService = {
  // Send message (public)
  sendMessage: async (messageData) => {
    try {
      const response = await axiosInstance.post('/messages', messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all messages (admin)
  getMessages: async () => {
    try {
      const response = await axiosInstance.get('/messages');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete message (admin)
  deleteMessage: async (id) => {
    try {
      const response = await axiosInstance.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default messageService;
