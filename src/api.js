// src/api.js
import axios from 'axios';

// Requests to '/api' are proxied to the Strapi backend via Netlify redirects
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically include JWT token in Authorization header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;