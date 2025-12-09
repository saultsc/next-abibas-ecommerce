import 'dotenv/config';

import { PrismaMssql } from '@prisma/adapter-mssql';

import { envs } from '@/config';
import { PrismaClient } from '@/generated';

const sqlConfig = {
	user: envs.DB_USER,
	password: envs.DB_PASSWORD,
	database: envs.DB_NAME,
	server: envs.DB_HOST,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
};

const adapter = new PrismaMssql(sqlConfig);
const prisma = new PrismaClient({ adapter });

export { prisma };
