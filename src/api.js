// src/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

export default API;