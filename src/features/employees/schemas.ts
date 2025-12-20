import { z } from 'zod';

export const employeeSchema = z.object({
  firstname: z.string().min(2, "Ім'я мінімум 2 символи"),
  lastname: z.string().min(2, "Прізвище мінімум 2 символи"),
  patronymic: z.string().optional(),
  phone: z.string().regex(/^\+380\d{9}$/, "Формат: +380XXXXXXXXX"),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Формат: YYYY-MM-DD"),
  id_position: z.number().int().positive("Оберіть дійсну посаду").min(1, "Оберіть посаду"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;