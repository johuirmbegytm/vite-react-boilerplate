// src/features/employees/api.ts
import api from '../../lib/axios'; // шлях до твого axios-клієнта
import type { Employee } from './types';

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/employees');
  console.log('Повна відповідь від бекенду:', response); // ← додаємо це
  console.log('response.data:', response.data);
  console.log('response.data.data:', response.data.data);
  return response.data?.data as Employee[] ?? [];
};

export const fetchEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const response = await api.get(`/employees/${id}`);
    if (!response.data?.data) {
      console.warn('Співробітник не знайдений на бекенді для ID:', id);
    }
    return response.data?.data ?? null;
  } catch (error) {
    console.error('Помилка запиту GET /employees/' + id, error);
    throw error;  // щоб useQuery пішов в isError
  }
};