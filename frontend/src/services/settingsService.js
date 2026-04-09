import axios from 'axios';

const API_URL = '/api/contact-settings';

const getContactSettings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const settingsService = {
  getContactSettings
};

export default settingsService;
