import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('topvoice.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
