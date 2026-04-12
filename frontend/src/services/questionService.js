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

export const questionService = {
  // Get all questions
  getQuestions: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/questions', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get daily question
  getDailyQuestion: async (id = null) => {
    try {
      const url = id ? `/questions/today?id=${id}` : '/questions/today';
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllDailyQuestions: async () => {
    try {
      const response = await axiosInstance.get('/questions/all-daily');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  upsertDailyQuestion: async (questionData) => {
    try {
      const response = await axiosInstance.post('/questions/daily', questionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDailyQuestion: async (id) => {
    try {
      const response = await axiosInstance.delete(`/questions/daily/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single question
  getQuestion: async (slug) => {
    try {
      const response = await axiosInstance.get(`/questions/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create question (admin)
  createQuestion: async (questionData) => {
    try {
      const response = await axiosInstance.post('/questions', questionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update question (admin)
  updateQuestion: async (id, questionData) => {
    try {
      const response = await axiosInstance.put(`/questions/${id}`, questionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete question (admin)
  deleteQuestion: async (id) => {
    try {
      const response = await axiosInstance.delete(`/questions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk create questions (admin)
  bulkCreateQuestions: async (questionsArray) => {
    try {
      const response = await axiosInstance.post('/questions/bulk', questionsArray);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default questionService;
