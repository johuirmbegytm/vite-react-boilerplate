// src/pages/EmployeeEdit.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateEmployee, useEmployee } from "../features/employees/queries";
import { employeeSchema, EmployeeFormData } from "../features/employees/schemas";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { usePositions } from "../features/positions/queries";

export const EmployeeEdit = () => {
  const { id: idStr } = useParams({ from: "/employees/$id/edit" });  // ← правильний шлях з /edit
  const id = Number(idStr);  // number для відображення

  const navigate = useNavigate();

  // Завантажуємо співробітника (idStr як string для queryKey)
  const { data: employee, isLoading: isEmployeeLoading } = useEmployee(idStr);
  const { data: positions = [], isLoading: isPositionsLoading } = usePositions();

  const updateMutation = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  // Заповнюємо форму
  useEffect(() => {
    if (employee) {
      reset({
        firstname: employee.firstname,
        lastname: employee.lastname,
        patronymic: employee.patronymic || '',
        phone: employee.phone,
        hire_date: employee.hire_date,
        id_position: employee.position?.id ?? undefined,
      });
    }
  }, [employee, reset]);

  const onSubmit = (data: EmployeeFormData) => {
    console.log('Оновлюємо співробітника:', data);

    updateMutation.mutate(
      {
        id: idStr,  // ← string для мутації
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          patronymic: data.patronymic ?? '',
          phone: data.phone,
          hire_date: data.hire_date,
          id_position: data.id_position ?? employee?.position?.id,
        },
      },
      {
        onSuccess: () => {
          alert('Співробітник успішно оновлений!');
          navigate({ to: "/employees" });
        },
        onError: (error: any) => {
          console.error('Повна помилка оновлення:', error);
          console.error('Status:', error.response?.status);
          console.error('Data від бекенду:', error.response?.data);
          alert('Помилка: ' + (error.response?.data?.errorMessage || error.message || 'Спробуйте ще раз'));
        },
      }
    );
  };

  if (isEmployeeLoading || isPositionsLoading) {
    return <div className="p-8 text-center">Завантаження даних...</div>;
  }

  if (!employee) {
    return <div className="p-8 text-center text-red-500">Співробітник не знайдений</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-8 text-center">Редагувати співробітника #{id}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Ім'я</label>
          <input
            {...register("firstname")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Прізвище</label>
          <input
            {...register("lastname")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">По батькові</label>
          <input
            {...register("patronymic")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Телефон</label>
          <input
            {...register("phone")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Дата найму</label>
          <input
            type="date"
            {...register("hire_date")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.hire_date && <p className="text-red-500 text-sm mt-1">{errors.hire_date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Посада</label>
          <select
            {...register('id_position', { valueAsNumber: true })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="" disabled>Оберіть посаду</option>
            {positions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.name} (з/п: {pos.salary})
              </option>
            ))}
          </select>
          {errors.id_position && <p className="text-red-500 text-sm mt-1">{errors.id_position.message}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {updateMutation.isPending ? "Збереження..." : "Зберегти зміни"}
          </button>
          <Link
            to="/employees"
            params={{ id: idStr }}  // ← string
            className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition"
          >
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  );
};