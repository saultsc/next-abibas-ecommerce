import { Party } from '@/interfaces';
import { Prisma } from '@prisma/client';

export interface PhoneType {
	phone_type_id: number;
	type_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export interface Phone {
	phone_id: number;
	party_id: number;
	phone_type_id: number;
	phone_number: string;
	is_primary: boolean;
	state: string;
	created_at: Date;
	updated_at: Date;
	phone_types?: PhoneType;
	parties?: Party;
}

export type PhoneTypesWhereInput = Prisma.phone_typesWhereInput;
export type PhoneTypesInclude = Prisma.phone_typesInclude;

export type PhonesWhereInput = Prisma.phonesWhereInput;
export type PhonesInclude = Prisma.phonesInclude;
