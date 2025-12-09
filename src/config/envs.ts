import { get } from 'env-var';

const isServer = typeof window === 'undefined';

export const envs = {
	NODE_ENV: get('NODE_ENV').default('development').asString(),

	// Database
	DATABASE_URL: isServer ? get('DATABASE_URL').required().asString() : '',
	DB_USER: isServer ? get('DB_USER').required().asString() : '',
	DB_PASSWORD: isServer ? get('DB_PASSWORD').required().asString() : '',
	DB_HOST: isServer ? get('DB_HOST').required().asString() : '',
	DB_NAME: isServer ? get('DB_NAME').required().asString() : '',

	// Jwr
	JWT_SECRET: isServer ? get('JWT_SECRET').required().asString() : '',
	JWT_EXPIRES_IN: get('JWT_EXPIRES_IN').default(7200).asIntPositive(), // 2 hours
};
