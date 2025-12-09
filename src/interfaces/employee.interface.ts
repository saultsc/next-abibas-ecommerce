import { Prisma } from '@/generated';

export interface Department {
	department_id: number;
	department_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export interface Employee {
	employee_id: number;
	user_id: number;
	hire_date: Date;
	department_id: number | null;
	created_at: Date;
	updated_at: Date;
	departments?: Department;
}

export type DepartmentWhereInput = Prisma.departmentsWhereInput;
export type DepartmentInclude = Prisma.departmentsInclude;

export type EmployeeWhereInput = Prisma.employeesWhereInput;
export type EmployeeInclude = Prisma.employeesInclude;
