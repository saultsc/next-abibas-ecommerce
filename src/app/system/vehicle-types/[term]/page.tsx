import { getVehicleTypeByTerm } from '@/actions';
import { Title } from '@/components';
import { VehicleType } from '@/interfaces';
import { VehicleTypesForm } from './ui/VehicleTypesForm';

interface Props {
	params: Promise<{
		term: string;
	}>;
}

export default async function VehicleTypeByTermPage({ params }: Props) {
	const { term } = await params;

	const { data: vehicleType } = await getVehicleTypeByTerm(term);
	const title = term === 'new' ? 'Nuevo tipo de vehículo' : 'Editar tipo de vehículo';

	return (
		<>
			<Title title={title} backUrl="/system/vehicle-types" />

			<VehicleTypesForm vehicleType={vehicleType ?? ({} as VehicleType)} />
		</>
	);
}
