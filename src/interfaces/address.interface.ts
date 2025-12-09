import { Prisma } from '@/generated';

import { Person } from '@/interfaces';

export interface Country {
	country_id: number;
	country_name: string;
	country_code: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export interface Province {
	province_id: number;
	country_id: number;
	province_name: string;
	province_code?: string | null | undefined;
	state: string;
	created_at: Date;
	updated_at: Date;
	countries?: Country;
}

export interface City {
	city_id: number;
	province_id: number;
	city_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
	provinces?: Province;
}

export interface Address {
	address_id: number;
	person_id: number;
	address_line1: string;
	address_line2?: string | null | undefined;
	city_id: number;
	postal_code: string;
	is_primary: boolean;
	state: string;
	created_at: Date;
	updated_at: Date;
	cities?: City;
	persons?: Person;
}

export type CountryWhereInput = Prisma.countriesWhereInput;
export type CountryInclude = Prisma.countriesInclude;

export type ProvinceWhereInput = Prisma.provincesWhereInput;
export type ProvinceInclude = Prisma.provincesInclude;

export type CityWhereInput = Prisma.citiesWhereInput;
export type CityInclude = Prisma.citiesInclude;

export type AddressWhereInput = Prisma.addressesWhereInput;
export type AddressInclude = Prisma.addressesInclude;
