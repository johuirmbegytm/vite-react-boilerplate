// src/lib/axios.ts
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - додає токен з Zustand до кожного запиту
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  
  if (token) {
    config.headers.Authorization = token; // Вже має "Bearer " з бекенду
  }
  
  return config;
});

// Response interceptor - обробка помилок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Якщо 401 - розлогінюємо
    if (error.response?.status === 401) {
      useAuthStore.getState().clearToken();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;