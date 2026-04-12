import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gyansagar.onrender.com/api';
const API_URL = `${BASE_URL}/contact-settings`;
const getContactSettings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const updateContactSettings = async (settings) => {
  const token = localStorage.getItem('adminToken');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  const response = await axios.put(API_URL, settings, config);
  return response.data;
};

const adminSettingsService = {
  getContactSettings,
  updateContactSettings
};

export default adminSettingsService;
