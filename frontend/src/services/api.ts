import axios from 'axios';

// Skapa en Axios-instans med grundkonfiguration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor för att hantera fel
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hantera autentiseringsfel
      console.error('Authentication error:', error);
      // Här kan vi lägga till logik för att redirecta till login
    }
    return Promise.reject(error);
  }
);

// Interceptor för att lägga till auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
