// src/features/auth/api.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../lib/axios';
import { useAuthStore } from '../../stores/authStore';
import type { LoginRequest, LoginResponse } from './types';

// Функція для API-запиту логіну
const loginRequest = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

// Хук для використання в компонентах
export const useLogin = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      // Зберігаємо токен у Zustand (вже з "Bearer ")
      setToken(response.data);
      
      // Редірект на головну сторінку
      navigate({ to: '/employees' });
    },
    onError: (error: any) => {
      console.error('Login failed:', error.response?.data || error.message);
    },
  });
};