// src/pages/EmployeeDetail.tsx
import { useEmployee } from "../features/employees/queries";
import { useParams } from "@tanstack/react-router";

export const EmployeeDetail = () => {
  const { id: idStr } = useParams({ from: "/employees/$id/" });

  const { data: employee, isLoading, isError } = useEmployee(idStr);

  if (isLoading) return <div className="p-8">Завантаження...</div>;

  if (isError || !employee) {
    return <div className="p-8 text-red-500">Співробітник не знайдений</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Деталі співробітника</h1>
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
        <p><strong>ID:</strong> {employee.id_employee}</p>
        <p><strong>ПІБ:</strong> {employee.lastname} {employee.firstname} {employee.patronymic || ''}</p>
        <p><strong>Телефон:</strong> {employee.phone}</p>
        <p><strong>Посада:</strong> {employee.position?.name || 'Без посади'} (з/п: {employee.position?.salary || '—'})</p>
        <p><strong>Дата найму:</strong> {employee.hire_date}</p>
      </div>
    </div>
  );
};