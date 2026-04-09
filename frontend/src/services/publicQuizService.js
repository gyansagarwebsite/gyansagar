import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({ baseURL: API_URL });

const publicQuizService = {
  getWeeklyQuizStatus: async () => {
    const response = await axiosInstance.get('/weekly-quiz/status');
    return response.data;
  },

  startWeeklyQuiz: async (userName) => {
    const response = await axiosInstance.post('/weekly-quiz/start', { userName });
    return response.data;
  },

  getWeeklyQuizCurrent: async () => {
    const response = await axiosInstance.get('/weekly-quiz/current');
    return response.data;
  },

  submitWeeklyQuiz: async (payload) => {
    const response = await axiosInstance.post('/weekly-quiz/submit', payload);
    return response.data;
  },

  // Returns the most recently announced winner (public)
  getWinner: async () => {
    const response = await axiosInstance.get('/weekly-quiz/winner');
    return response.data;
  },
};

export default publicQuizService;
