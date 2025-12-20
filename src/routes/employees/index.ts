// src/routes/employees/index.ts
import { createFileRoute } from "@tanstack/react-router";
import { EmployeesList } from "../../pages/EmployeesList";

export const Route = createFileRoute("/employees/")({
  component: EmployeesList,
});
