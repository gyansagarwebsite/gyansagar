import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const heroService = {
  getHeroSettings: async () => {
    try {
      const response = await axiosInstance.get('/hero');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default heroService;
