import { Prisma } from '@prisma/client';

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
	document_number: string;
	document_type_id: number;
	department_id: number | null;
	created_at: Date;
	updated_at: Date;
	departments?: Department;
}

export type DepartmentsWhereInput = Prisma.departmentsWhereInput;
export type DepartmentsInclude = Prisma.departmentsInclude;

export type EmployeeWhereInput = Prisma.employeesWhereInput;
export type EmployeeInclude = Prisma.employeesInclude;
