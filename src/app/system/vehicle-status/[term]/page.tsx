
import { getVehicleStatusByTerm } from '@/actions';
import { Title } from '@/components';
import { VehicleStatus } from '@/interfaces';
import { VehicleStatusForm} from './ui/VehicleStatusForm';

interface Props {
    params: Promise<{
        term: string;
    }>;
}

export default async function VehicleStatusByTermPage({ params }: Props) {
    const { term } = await params;

    const { data: vehicleStatus } = await getVehicleStatusByTerm(term);
    const title = term === 'new' ? 'Nuevo estado de vehículo' : 'Editar estado de vehículo';
    return (
        <>
            <Title title={title} backUrl="/system/vehicle-status" />

            <VehicleStatusForm vehicleStatus={vehicleStatus ?? ({} as VehicleStatus)} />

        </>
    );
}