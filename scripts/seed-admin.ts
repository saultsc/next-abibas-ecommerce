import { PrismaClient } from '@/generated';
import { PrismaMssql } from '@prisma/adapter-mssql';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Configuración directa de SQL Server
const sqlConfig = {
	user: process.env.DB_USER!,
	password: process.env.DB_PASSWORD!,
	database: process.env.DB_NAME!,
	server: process.env.DB_HOST!,
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

async function main() {
	console.log('🌱 Iniciando seed de usuario admin...');

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash('admin123', salt);

		// Verificar si el usuario admin ya existe
		const existingUser = await prisma.users.findFirst({
			where: { username: 'admin' },
		});

		if (existingUser) {
			console.log('⚠️  El usuario admin ya existe');
			return;
		}

		// Crear todo en una transacción
		await prisma.$transaction(async (tx) => {
			// 2. Crear persona
			const person = await tx.persons.create({
				data: {
					first_name: 'Admin',
					last_name: 'Sistema',
					email: 'admin@abibas.com',
					date_of_birth: new Date('1990-01-15'),
					document_type_id: 1,
					document_number: '001-0123456-7',
				},
			});
			console.log('✅ Persona creada con ID:', person.person_id);

			// 3. Crear usuario
			const user = await tx.users.create({
				data: {
					person_id: person.person_id,
					username: 'admin',
					password: hashedPassword,
					role_id: 1,
					state: 'A',
				},
			});

			// 4. Crear customer
			const customer = await tx.customers.create({
				data: {
					user_id: user.user_id,
					loyalty_points: 1000,
					total_spent: 0,
				},
			});

			// 5. Crear employee
			const employee = await tx.employees.create({
				data: {
					user_id: user.user_id,
					hire_date: new Date('2024-01-01'),
					department_id: 1,
				},
			});
			console.log('✅ Employee creado con ID:', employee.employee_id);

			// 6. Agregar dirección
			const address = await tx.addresses.create({
				data: {
					person_id: person.person_id,
					address_line1: 'Calle Principal No. 123',
					address_line2: 'Edificio Torre Admin, Piso 5',
					city_id: 1,
					postal_code: '10101',
					is_primary: true,
					state: 'A',
				},
			});

			const phone1 = await tx.phones.create({
				data: {
					phone_type_id: 1,
					person_id: person.person_id,
					phone_number: '8095551234',
					is_primary: true,
					state: 'A',
				},
			});

			const phone2 = await tx.phones.create({
				data: {
					phone_type_id: 3,
					person_id: person.person_id,
					phone_number: '8095555678',
					is_primary: false,
					state: 'A',
				},
			});
			console.log('✅ Teléfono de trabajo creado con ID:', phone2.phone_id);
		});

		console.log('\n✨ Usuario admin creado exitosamente!');
		console.log('📝 Credenciales:');
		console.log('   Username: admin');
		console.log('   Password: admin123');
	} catch (error) {
		console.error('❌ Error al crear usuario admin:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
