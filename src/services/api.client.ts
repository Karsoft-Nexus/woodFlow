import axios from 'axios';

// API client instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://alimplas.injiniring-kompaniya.uz/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
