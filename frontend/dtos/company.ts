import { Employee } from "./employee";

export interface Company {
  id: string;
  name: string;
  employeeCount: number;
  createdAt: string;
  employees: Employee[];
}
