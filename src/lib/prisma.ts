import { envs } from '@/config';
import { PrismaClient } from '@/generated';
import { PrismaMssql } from '@prisma/adapter-mssql';

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

// Usar una instancia global en desarrollo para evitar múltiples conexiones
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
