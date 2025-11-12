'use client';
import { useRouter } from 'next/navigation';

import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createOrUpdateVehicleStatus, deleteVehicleStatus } from '@/actions';
import { DeleteButton, StateSwitch, SystemInfoCard } from '@/components';
import { VehicleStatus } from '@/interfaces';

interface Props {
    vehicleStatus: VehicleStatus;
}

interface FormInputs {
    status_name: string;
    state: string;
}

export const VehicleStatusForm = ({ vehicleStatus }: Props) => {
    const router = useRouter();

    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormInputs>({
        defaultValues: {
            status_name: vehicleStatus.status_name,
            state: vehicleStatus.state ?? 'A',
        },
        mode: 'onChange',
    });

    const onSubmit = async (data: FormInputs) => {
        const formData = new FormData();

        const { status_name, state } = data;

        if (vehicleStatus.vehicle_status_id) {
            formData.append('vehicle_status_id', vehicleStatus.vehicle_status_id.toString());
        }

        formData.append('status_name', status_name);
        formData.append('state', state);

        const { success, data: vehicleStatusData, message } = await createOrUpdateVehicleStatus(formData);

        if (!success) {
            toast.error(message || 'Error al guardar el estado de vehículo');
            return;
        }

        toast.success(message || 'Estado de vehículo guardado exitosamente');
        router.replace(`/system/vehicle-status/${vehicleStatusData?.vehicle_status_id}`);
    };

    const handleDelete = async () => {
        if (!vehicleStatus.vehicle_status_id) return;
        const { success, message } = await deleteVehicleStatus(vehicleStatus.vehicle_status_id);

        if (!success) {
            toast.error(message || 'No se pudo eliminar el estado de vehículo');
            return;
        }

        toast.success('Estado de vehículo eliminado exitosamente');
        router.replace('/system/vehicle-status');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto mb-6 pb-6">
            {/* Nombre del tipo de estado del vehiculo */}
            <div className="w-full mb-4">
                <TextField
                    label="Nombre del tipo de estado del vehículo *"
                    variant="filled"
                    className="w-full"
                    error={!!errors.status_name}
                    helperText={errors.status_name?.message}
                    {...register('status_name', {
                        required: 'El nombre del tipo de estado del vehículo es requerido',
                        minLength: {
                            value: 2,
                            message: 'El nombre debe tener al menos 2 caracteres',
                        },
                        maxLength: {
                            value: 100,
                            message: 'El nombre no puede exceder 100 caracteres',
                        },
                    })}
                />
            </div>
           
            {/* Estado */}
            <StateSwitch
                state={watch('state')}
                onStateChange={(newState) => setValue('state', newState)}
                entityName="categoría"
                gender="la"
            />

            {/* Información del Sistema */}
            {vehicleStatus.vehicle_status_id && (
                <SystemInfoCard
                    idValue={vehicleStatus.vehicle_status_id}
                    createdAt={vehicleStatus.created_at}
                    updatedAt={vehicleStatus.updated_at}
                />
            )}

            {/* Botones */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    Guardar
                </button>

                {vehicleStatus.vehicle_status_id && (
                    <DeleteButton onDelete={handleDelete} itemName={vehicleStatus.status_name} />
                )}
            </div>
        </form>
    );
};