// src/features/employees/types.ts
export interface Employee {
  id_employee: number; 
  firstname: string;
  lastname: string;
  patronymic: string;
  phone: string;
  hire_date: string;
  position: {
    id: number;
    name: string;
    salary: string;
  } 
}