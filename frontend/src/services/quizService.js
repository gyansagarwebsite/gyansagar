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

export const quizService = {
  // Get all quizzes
  getQuizzes: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/quiz', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get weekly quiz status
  getWeeklyQuiz: async () => {
    try {
      const response = await axiosInstance.get('/weekly-quiz/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getWeeklyQuizCurrent: async () => {
    try {
      const response = await axiosInstance.get('/weekly-quiz/current');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  startWeeklyQuiz: async (userName) => {
    try {
      const response = await axiosInstance.post('/weekly-quiz/start', { userName });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitWeeklyQuiz: async (payload) => {
    try {
      const response = await axiosInstance.post('/weekly-quiz/submit', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single quiz
  getQuiz: async (id) => {
    try {
      const response = await axiosInstance.get(`/quiz/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create quiz (admin)
  createQuiz: async (quizData) => {
    try {
      const response = await axiosInstance.post('/quiz', quizData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update quiz (admin)
  updateQuiz: async (id, quizData) => {
    try {
      const response = await axiosInstance.put(`/quiz/${id}`, quizData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete quiz (admin)
  deleteQuiz: async (id) => {
    try {
      const response = await axiosInstance.delete(`/quiz/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default quizService;
