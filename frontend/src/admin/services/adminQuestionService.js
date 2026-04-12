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

export const getQuestions = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/questions', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQuestion = async (id) => {
  try {
    const response = await axiosInstance.get(`/questions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createQuestion = async (questionData) => {
  try {
    const response = await axiosInstance.post('/questions', questionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateQuestion = async (id, questionData) => {
  try {
    const response = await axiosInstance.put(`/questions/${id}`, questionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/questions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDailyQuestions = async () => {
  try {
    const response = await axiosInstance.get('/questions/all-daily');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const upsertDailyQuestion = async (data) => {
  try {
    const response = await axiosInstance.post('/questions/daily', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDailyQuestion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/questions/daily/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentQuestions = async () => {
  try {
    const response = await axiosInstance.get('/questions/recent');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const adminQuestionService = {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getRecentQuestions,
};

export default adminQuestionService;

