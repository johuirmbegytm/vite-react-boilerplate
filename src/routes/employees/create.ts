import { createFileRoute } from "@tanstack/react-router";
import { EmployeeCreate } from "../../pages/EmployeeCreate"

export const Route = createFileRoute("/employees/create")({
  component: EmployeeCreate,
});