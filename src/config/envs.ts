import { get } from 'env-var';

// Helper to check if we're on the server side
const isServer = typeof window === 'undefined';

export const envs = {
	NODE_ENV: get('NODE_ENV').default('development').asString(),

	JWT_SECRET: isServer ? get('JWT_SECRET').required().asString() : '',
	JWT_EXPIRES_IN: get('JWT_EXPIRES_IN').default(7200).asIntPositive(), // 2 hours
};
