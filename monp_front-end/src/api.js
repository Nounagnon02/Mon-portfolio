import axios from 'axios';

export const urlBase = import.meta.env.VITE_API_URL || 'https://mon-portfolio-1-i7oe.onrender.com/api';

const api = axios.create({
  baseURL: urlBase,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const isDev = import.meta.env.DEV;

api.interceptors.response.use(
  response => response,
  error => {
    if (isDev) {
      const endpoint = error.config?.url || 'unknown';
      const method = error.config?.method?.toUpperCase() || 'unknown';
      const status = error.response?.status || 'no response';

      console.warn(`API Error [${method} ${endpoint}]:`, { status, message: error.message });
    }

    return Promise.reject(error);
  }
);

export default api;
