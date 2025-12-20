import { createFileRoute } from "@tanstack/react-router";
import { EmployeeDetail } from "../../../pages/EmployeeDetail";

export const Route = createFileRoute("/employees/$id/")({
  component: EmployeeDetail,
});