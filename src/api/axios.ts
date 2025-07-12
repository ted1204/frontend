import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.121.124.22:30000/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

