import { Prisma } from '@prisma/client';
import { Phone } from './pohone.interface';

export interface Party {
	party_id: number;
	party_type: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export interface DocumentType {
	document_type_id: number;
	type_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export interface Person {
	person_id: number;
	first_name: string;
	last_name: string;
	date_of_birth: Date | null;
	email: string | null;
	created_at: Date;
	updated_at: Date;
	document_types?: DocumentType;
	phones?: Phone[];
}

export type PartiesWhereInput = Prisma.partiesWhereInput;
export type PartiesInclude = Prisma.partiesInclude;

export type DocumentTypesWhereInput = Prisma.document_typesWhereInput;
export type DocumentTypesInclude = Prisma.document_typesInclude;

export type PersonsWhereInput = Prisma.personsWhereInput;
export type PersonsInclude = Prisma.personsInclude;
