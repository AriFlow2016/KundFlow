import axios from 'axios';

// Sätt bas-URL för alla API-anrop
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Lägg till auth-token i alla requests om den finns
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hantera fel globalt
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hantera utgången token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
