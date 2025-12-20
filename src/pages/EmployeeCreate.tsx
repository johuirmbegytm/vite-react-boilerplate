import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEmployee } from "../features/employees/queries";
import { employeeSchema, EmployeeFormData } from "../features/employees/schemas";
import { Link, useNavigate } from "@tanstack/react-router";
import { usePositions } from "../features/positions/queries";

export const EmployeeCreate = () => {
  const navigate = useNavigate();
  const createMutation = useCreateEmployee();

  const { data: positions = [], isLoading: isPositionsLoading } = usePositions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = (data: EmployeeFormData) => {
    console.log('Отправляем:', data);

    createMutation.mutate({
      firstname: data.firstname,
      lastname: data.lastname,
      patronymic: data.patronymic ?? '',
      phone: data.phone,
      hire_date: data.hire_date,
      positionId: data.id_position,  // ← ВОТ ТУТ! positionId вместо id_position
    }, {
      onSuccess: () => {
        navigate({ to: "/employees" });
      },
      onError: (error: any) => {
        console.error('Ошибка:', error.response?.data);
      },
    });
  };

  if (isPositionsLoading) return <div className="p-8 text-center">Завантаження посад...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Створити співробітника</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Ім'я</label>
          <input {...register("firstname")} className="w-full p-2 border rounded" />
          {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
        </div>
        <div>
          <label>Прізвище</label>
          <input {...register("lastname")} className="w-full p-2 border rounded" />
          {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
        </div>
        <div>
          <label>По батькові</label>
          <input {...register("patronymic")} className="w-full p-2 border rounded" />
          {errors.patronymic && <p className="text-red-500">{errors.patronymic.message}</p>}
        </div>
        <div>
          <label>Телефон</label>
          <input {...register("phone")} className="w-full p-2 border rounded" />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <label>Дата найму</label>
          <input type="date" {...register("hire_date")} className="w-full p-2 border rounded" />
          {errors.hire_date && <p className="text-red-500">{errors.hire_date.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Посада</label>
          <select
            {...register('id_position', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
            required
            defaultValue=""
          >
            <option value="" disabled>Оберіть посаду</option>
            {positions.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.name} (з/п: {pos.salary})
              </option>
            ))}
          </select>
          {errors.id_position && <p className="text-red-500 text-sm">{errors.id_position.message}</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded">
          Створити
        </button>
        <Link to="/employees" className="ml-4 text-blue-600">Скасувати</Link>
      </form>
    </div>
  );
};