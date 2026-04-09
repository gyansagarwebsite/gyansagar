import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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

export const getBlogs = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/blogs', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlog = async (slug) => {
  try {
    const response = await axiosInstance.get(`/blogs/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const response = await axiosInstance.post('/blogs', blogData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBlog = async (slug, blogData) => {
  try {
    const response = await axiosInstance.put(`/blogs/${slug}`, blogData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteBlog = async (slug) => {
  try {
    const response = await axiosInstance.delete(`/blogs/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const adminBlogService = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};

export default adminBlogService;

