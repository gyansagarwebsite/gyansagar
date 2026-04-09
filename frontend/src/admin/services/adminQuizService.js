import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const toggleWeeklyQuizActive = async (isActive) => {
  const response = await axiosInstance.patch('/weekly-quiz/admin/toggle', { isActive });
  return response.data;
};

export const getWeeklyQuizAdmin = async () => {
  const response = await axiosInstance.get('/weekly-quiz/admin/current');
  return response.data;
};

export const createWeeklyQuiz = async (quizData) => {
  const response = await axiosInstance.post('/weekly-quiz/admin/save', quizData);
  return response.data;
};

export const resetWeeklyQuiz = async (force) => {
  const response = await axiosInstance.post('/weekly-quiz/admin/reset', { force });
  return response.data;
};

export const getWeeklyQuizStats = async () => {
  const response = await axiosInstance.get('/weekly-quiz/admin/stats');
  return response.data;
};

export const getParticipants = async () => {
  const response = await axiosInstance.get('/weekly-quiz/admin/participants');
  return response.data;
};

export const announceWinner = async (message = '') => {
  const response = await axiosInstance.post('/weekly-quiz/admin/announce-winner', { message });
  return response.data;
};

export const unannounceWinner = async () => {
  const response = await axiosInstance.post('/weekly-quiz/admin/unannounce-winner', {});
  return response.data;
};

const adminQuizService = {
  toggleWeeklyQuizActive,
  getWeeklyQuizAdmin,
  createWeeklyQuiz,
  resetWeeklyQuiz,
  getWeeklyQuizStats,
  getParticipants,
  announceWinner,
  unannounceWinner,
};

export default adminQuizService;
