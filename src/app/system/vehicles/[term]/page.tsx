import { getSupplierSearch, getVehicleStatuses, getVehicleTypes } from '@/actions';
import { getVehicleById } from '@/actions/vehicles';
import { Title } from '@/components';
import { Vehicle } from '@/interfaces';
import { VehicleForm } from './ui/VehicleForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function VehicleByTermPage({ params }: Props) {
	const { term } = await params;

	const [vehicleResult, vehicleTypesResult, vehicleStatusResult, suppliersResult] =
		await Promise.all([
			term === 'new'
				? Promise.resolve({ ok: true, vehicle: null })
				: getVehicleById(parseInt(term)),
			getVehicleTypes(),
			getVehicleStatuses(),
			getSupplierSearch(),
		]);

	const vehicleTypes = vehicleTypesResult.ok ? vehicleTypesResult.data ?? [] : [];
	const vehicleStatuses = vehicleStatusResult.ok ? vehicleStatusResult.data ?? [] : [];

	// Mapear suppliers: si no hay company_name, usar first_name + last_name
	const suppliers = suppliersResult.success
		? (suppliersResult.data?.map((s: any) => ({
				supplier_id: s.supplier_id,
				company_name:
					s.company_name ||
					(s.persons ? `${s.persons.first_name} ${s.persons.last_name}` : 'Sin nombre'),
		  })) as any[]) ?? []
		: [];

	const title = term === 'new' ? 'Nuevo vehículo' : 'Editar vehículo';

	return (
		<>
			<Title title={title} backUrl="/system/vehicles" />

			<VehicleForm
				vehicle={vehicleResult.vehicle || ({} as Vehicle)}
				vehicleTypes={vehicleTypes}
				vehicleStatuses={vehicleStatuses}
				suppliers={suppliers}
			/>
		</>
	);
}
