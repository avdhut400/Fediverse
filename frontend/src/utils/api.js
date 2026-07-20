import axios from 'axios';


const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials:true,
  headers: {
    'x-api-secret': process.env.REACT_APP_API_SECRET
  }
});

// Add request interceptor for token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default API;