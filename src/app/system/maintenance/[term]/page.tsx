import { getMaintenanceById, maintenanceTypeSearch } from '@/actions/maintenance';

import { getSupplierSearch, vehicleSearch } from '@/actions';
import { Title } from '@/components';
import { notFound } from 'next/navigation';
import { MaintenanceForm } from './ui/MaintenanceForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function MaintenanceByTermPage({ params }: Props) {
	const { term } = await params;

	// Obtener datos del mantenimiento si estamos en modo edición
	let maintenance = null;
	if (term !== 'new') {
		const maintenanceId = parseInt(term);
		if (isNaN(maintenanceId)) {
			notFound();
		}

		const result = await getMaintenanceById(maintenanceId);
		if (!result.ok || !result.maintenance) {
			notFound();
		}
		maintenance = {
			...result.maintenance,
			completion_date: result.maintenance.completion_date ?? undefined,
			mileage_at_service: Number(result.maintenance.mileage_at_service),
			total_cost: Number(result.maintenance.total_cost),
			notes: result.maintenance.notes ?? undefined,
		};
	}

	// Obtener tipos de mantenimiento
	const maintenanceTypesResult = await maintenanceTypeSearch();
	const maintenanceTypes =
		maintenanceTypesResult.ok && maintenanceTypesResult.maintenanceTypes
			? maintenanceTypesResult.maintenanceTypes.map((mt) => ({
					...mt,
					description: mt.description ?? undefined,
			  }))
			: [];

	// Obtener proveedores
	const suppliersResult = await getSupplierSearch();
	// Mapear suppliers: si no hay company_name, usar first_name + last_name
	const suppliers = suppliersResult.success
		? (suppliersResult.data?.map((s: any) => ({
				supplier_id: s.supplier_id,
				company_name:
					s.company_name ||
					(s.persons ? `${s.persons.first_name} ${s.persons.last_name}` : 'Sin nombre'),
		  })) as any[]) ?? []
		: [];

	// Obtener vehículos
	const vehiclesResult = await vehicleSearch();
	const vehicles = vehiclesResult.ok ? vehiclesResult.vehicles : [];

	const title = term === 'new' ? 'Nuevo mantenimiento' : 'Editar mantenimiento';

	return (
		<>
			<Title title={title} backUrl="/system/maintenance" />

			<MaintenanceForm
				maintenance={maintenance}
				maintenanceTypes={maintenanceTypes || []}
				suppliers={suppliers || []}
				vehicles={vehicles || []}
			/>
		</>
	);
}
