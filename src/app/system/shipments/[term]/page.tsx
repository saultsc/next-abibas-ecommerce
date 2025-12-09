import { ShipmentForm } from './ui/ShipmentForm';

export const revalidate = 0;

interface Props {
	params: Promise<{
		term: string;
	}>;
}

// Mock data para vehículos
const mockVehicles = [
	{ vehicle_id: 1, make: 'Mercedes-Benz', model: 'Sprinter 2500', license_plate: 'DEL-001' },
	{ vehicle_id: 2, make: 'Ford', model: 'Transit 350', license_plate: 'DEL-002' },
	{ vehicle_id: 3, make: 'Isuzu', model: 'NPR', license_plate: 'DEL-003' },
	{ vehicle_id: 4, make: 'RAM', model: 'ProMaster 2500', license_plate: 'DEL-004' },
	{ vehicle_id: 5, make: 'Chevrolet', model: 'Express 3500', license_plate: 'DEL-005' },
	{ vehicle_id: 6, make: 'Nissan', model: 'NV2500', license_plate: 'DEL-006' },
	{ vehicle_id: 7, make: 'Ford', model: 'E-Transit', license_plate: 'DEL-007' },
	{ vehicle_id: 8, make: 'Mercedes-Benz', model: 'eSprinter', license_plate: 'DEL-008' },
	{ vehicle_id: 9, make: 'RAM', model: 'ProMaster City', license_plate: 'DEL-009' },
	{ vehicle_id: 10, make: 'Chevrolet', model: 'Express 2500', license_plate: 'DEL-010' },
];

// Mock data para conductores (empleados)
const mockDrivers = [
	{ employee_id: 1, first_name: 'Carlos', last_name: 'Mendoza' },
	{ employee_id: 2, first_name: 'Ana', last_name: 'García' },
	{ employee_id: 3, first_name: 'Roberto', last_name: 'Silva' },
	{ employee_id: 4, first_name: 'María', last_name: 'López' },
	{ employee_id: 5, first_name: 'José', last_name: 'Ramírez' },
	{ employee_id: 6, first_name: 'Laura', last_name: 'Martínez' },
	{ employee_id: 7, first_name: 'Pedro', last_name: 'González' },
	{ employee_id: 8, first_name: 'Sofia', last_name: 'Hernández' },
	{ employee_id: 9, first_name: 'Diego', last_name: 'Torres' },
	{ employee_id: 10, first_name: 'Carmen', last_name: 'Ruiz' },
];

// Mock data para estados de envío
const mockShippingStatuses = [
	{ status_code: 'PENDING', description: 'Pendiente' },
	{ status_code: 'IN_TRANSIT', description: 'En Ruta' },
	{ status_code: 'DELIVERED', description: 'Entregado' },
	{ status_code: 'CANCELLED', description: 'Cancelado' },
	{ status_code: 'DELAYED', description: 'Retrasado' },
];

// Mock data para el envío (si es edición)
const mockShipment = {
	shipment_id: 1,
	shipment_number: 'SHP-2024-001',
	vehicle_id: 1,
	driver_id: 1,
	status_code: 'IN_TRANSIT',
	ship_date: new Date('2024-01-15'),
	delivery_date: null,
	notes: 'Ruta norte de la ciudad',
	state: 'A',
	created_at: new Date('2024-01-15'),
	updated_at: new Date('2024-01-15'),
};

export default async function ShipmentTermPage({ params }: Props) {
	const { term } = await params;
	const isNew = term === 'new';

	const shipment = isNew ? null : mockShipment;

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-800">
					{isNew ? 'Nuevo Envío' : `Envío ${shipment?.shipment_number}`}
				</h1>
				<p className="text-gray-600 mt-1">
					{isNew
						? 'Crea un nuevo envío y asigna las órdenes de entrega'
						: 'Gestiona los detalles del envío y sus órdenes'}
				</p>
			</div>

			<ShipmentForm
				shipment={shipment}
				vehicles={mockVehicles}
				drivers={mockDrivers}
				shippingStatuses={mockShippingStatuses}
				isNew={isNew}
			/>
		</div>
	);
}
