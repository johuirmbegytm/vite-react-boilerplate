// src/features/employees/queries.ts
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEmployees, fetchEmployeeById } from './api';
import api from '../../lib/axios';
import type { Employee } from './types';

type CreateEmployeeData = {
  firstname: string;
  lastname: string;
  patronymic?: string;
  phone: string;
  hire_date: string;
  positionId: number;
};

// Список усіх співробітників
export const useEmployees = () => {
  const query = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
    staleTime: 1000 * 60 * 5,
  });
  console.log('useEmployees: data:', query.data);  // ← лог даних списку
  console.log('useEmployees: isFetching:', query.isFetching);  // ← чи рефетчить?
  return query;
};

// Один співробітник за ID
export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => fetchEmployeeById(id),
    enabled: !!id && id !== 'create',
    // ← видали onError повністю
  });
};
// Створення
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEmployeeData) => {
    const payload: any = {
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      hire_date: data.hire_date,
      positionId: data.positionId,
    };

    if (data.patronymic !== undefined && data.patronymic !== '') {
      payload.patronymic = data.patronymic;
    }

    const response = await api.post('/employees', payload);
    return response.data.data;
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

// Оновлення
// type UpdateEmployeeData = Partial<CreateEmployeeData>;

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const payload = {
        firstname: data.firstname,
        lastname: data.lastname,
        patronymic: data.patronymic ?? null,
        phone: data.phone,
        hire_date: data.hire_date,
        positionId: data.id_position,
      };
      const response = await api.patch(`/employees/${id}`, payload);
      return response.data.data as Employee;
    },
    onSuccess: (updatedEmployee) => {
      console.log('onSuccess: updatedEmployee:', updatedEmployee);  // ← що повернув бекенд?
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.refetchQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};