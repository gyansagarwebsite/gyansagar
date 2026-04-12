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

export const blogService = {
  // Get all blogs
  getBlogs: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/blogs', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single blog
  getBlog: async (slug) => {
    try {
      const response = await axiosInstance.get(`/blogs/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create blog (admin)
  createBlog: async (blogData) => {
    try {
      const response = await axiosInstance.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update blog (admin)
  updateBlog: async (id, blogData) => {
    try {
      const response = await axiosInstance.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete blog (admin)
  deleteBlog: async (id) => {
    try {
      const response = await axiosInstance.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default blogService;
