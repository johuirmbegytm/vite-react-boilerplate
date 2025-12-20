// src/routes/employees/$id.edit.ts
import { createFileRoute } from "@tanstack/react-router";
import { EmployeeEdit } from "../../../pages/EmployeeEdit";

export const Route = createFileRoute("/employees/$id/edit")({
  component: EmployeeEdit,
});