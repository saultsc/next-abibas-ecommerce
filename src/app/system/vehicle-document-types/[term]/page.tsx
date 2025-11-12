
import { getVehicleDocumentTypesByTerm } from '@/actions';
import { Title } from '@/components';
import { VehicleDocumentType } from '@/interfaces';
import {VehicleDocumentTypeForm } from './ui/VehicleDocumentTypeForm';

interface Props {
    params: Promise<{
        term: string;
    }>;
}

export default async function VehicleDocumentTypeByTermPage({ params }: Props) {
    const { term } = await params;

    const { data: vehicleDocumentType } = await getVehicleDocumentTypesByTerm(term);
    const title = term === 'new' ? 'Nuevo tipo de documento de vehículo' : 'Editar tipo de documento de vehículo';
    return (
        <>
            <Title title={title} backUrl="/system/vehicle-document-types" />
            <VehicleDocumentTypeForm vehicleDocumentType={vehicleDocumentType ?? ({} as VehicleDocumentType)} />

        </>
    );
}