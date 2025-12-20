// src/pages/EmployeesList.tsx
import { useEmployees, useDeleteEmployee } from "../features/employees/queries";


import { Link } from "@tanstack/react-router";

export const EmployeesList = () => {
  const { data: employees, isLoading, isError, error } = useEmployees();
  const deleteMutation = useDeleteEmployee();
  console.log('Дані співробітників:', employees);

  if (isLoading) {
    return <div className="p-8 text-center text-xl">Завантаження співробітників...</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Помилка завантаження: {(error as any)?.message || "Щось пішло не так"}
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return <div className="p-8 text-center text-xl">Співробітників не знайдено</div>;
  }

    return (
        <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Співробітники</h1>
        <Link
            to="/employees/create"
            className="inline-block mb-8 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
        >
            Додати співробітника
        </Link>
        <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="w-full table-fixed border-collapse bg-white">
            <thead>
                <tr className="bg-gray-800 text-white">
                <th className="p-4 text-left w-24">ID</th>
                <th className="p-4 text-left w-80">ПІБ</th>
                <th className="p-4 text-left w-48">Телефон</th>
                <th className="p-4 text-left w-64">Посада</th>
                <th className="p-4 text-left w-40">Дата найму</th>
                <th className="p-4 text-left w-48">Дії</th>
                </tr>
            </thead>
            <tbody>
            {employees?.map((emp) => (
              <tr key={emp.id_employee} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{emp.id_employee}</td>
                <td className="p-4">
                  {emp.lastname} {emp.firstname} {emp.patronymic || ''}
                </td>
                <td className="p-4">{emp.phone}</td>
                <td className="p-4">{emp.position?.name || 'Без посади'}</td>
                <td className="p-4">{emp.hire_date}</td>
                <td className="p-4">
                  <div className="flex gap-4">
                    <Link
                      to="/employees/$id"
                      params={{ id: String(emp.id_employee) }}  // ← String() на всяк випадок
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Переглянути"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        </Link>

                        <Link
                                  to="/employees/$id/edit"
                                  params={{ id: String(emp.id_employee) }}
                                  className="text-amber-600 hover:text-amber-800 transition"
                                  title="Редагувати"
                                >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm('Ви впевнені, що хочете видалити цього співробітника?')) {
                              deleteMutation.mutate(String(emp.id_employee));
                            }
                          }}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Видалити"
                          disabled={deleteMutation.isPending}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>                        
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};


