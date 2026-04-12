import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gyansagar.onrender.com/api';
const API_URL = `${BASE_URL}/contact-settings`;
const getContactSettings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const settingsService = {
  getContactSettings
};

export default settingsService;
