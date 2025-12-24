import axios from 'axios';

export const urlBase = process.env.REACT_APP_API_URL || 'https://mon-portfolio-1-i7oe.onrender.com/api' || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: urlBase,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    const endpoint = error.config?.url || 'unknown';
    const method = error.config?.method?.toUpperCase() || 'unknown';
    const status = error.response?.status || 'no response';

    console.error(`API Error [${method} ${endpoint}]:`, {
      status,
      message: error.message,
      data: error.response?.data
    });

    return Promise.reject(error);
  }
);

export default api;
