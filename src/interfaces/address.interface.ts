export interface Contry {
	contry_id: number;
	contry_name: string;
	contry_code: string;
	state: string;
	created_at: Date;
	updated_at: Date;
}

export interface Province {
	province_id: number;
	contry_id: number;
	province_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
	contries?: Contry[];
}

export interface City {
	city_id: number;
	province_id: number;
	city_name: string;
	state: string;
	created_at: Date;
	updated_at: Date;
	provinces?: Province[];
}

export interface Address {
	address_id: number;
	person_id: number;
	street: string;
	city_id: number;
	created_at: Date;
	updated_at: Date;
	cities?: City[];
}
