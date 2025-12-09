'use client';

import { createUpdateMaintenancePart, deleteMaintenancePart } from '@/actions/maintenance';
import { getMaintenancePartsByMaintenanceId } from '@/actions/maintenance/get-maintenance-parts';
import { Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import {
	IoAddCircleOutline,
	IoClose,
	IoCubeOutline,
	IoPricetagOutline,
	IoTrashOutline,
} from 'react-icons/io5';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

interface MaintenancePart {
	maintenance_part_id?: number;
	part_description: string;
	part_number: string | null;
	quantity: number;
	unit_cost: number;
	total_cost: number;
}

interface Props {
	maintenanceId?: number;
	parts?: MaintenancePart[];
	onPartsChange?: (parts: MaintenancePart[]) => void;
}

interface PartFormData {
	part_description: string;
	part_number: string;
	quantity: number;
	unit_cost: number;
}

export const MaintenanceParts = ({ maintenanceId, parts = [], onPartsChange }: Props) => {
	const [partsList, setPartsList] = useState<MaintenancePart[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPartId, setEditingPartId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<PartFormData>({
		part_description: '',
		part_number: '',
		quantity: 1,
		unit_cost: 0,
	});

	// Cargar partes cuando hay maintenanceId
	useEffect(() => {
		const loadParts = async () => {
			if (!maintenanceId) {
				setPartsList([]);
				return;
			}

			setLoading(true);
			const response = await getMaintenancePartsByMaintenanceId(maintenanceId);

			if (response.ok && response.parts) {
				const mappedParts = response.parts.map((part: any) => ({
					...part,
					unit_cost: Number(part.unit_cost),
					total_cost: Number(part.total_cost),
				}));
				setPartsList(mappedParts as any);
			}
			setLoading(false);
		};

		loadParts();
	}, [maintenanceId]);

	const handleOpenModal = () => {
		setIsModalOpen(true);
		setEditingPartId(null);
		setFormData({
			part_description: '',
			part_number: '',
			quantity: 1,
			unit_cost: 0,
		});
	};

	const handleSubmitPart = async () => {
		if (!formData.part_description.trim()) {
			toast.error('Ingrese una descripción');
			return;
		}

		// Modo local: sin maintenanceId
		if (!maintenanceId) {
			const totalCost = formData.quantity * formData.unit_cost;
			const newPart: MaintenancePart = {
				maintenance_part_id: editingPartId || undefined,
				part_description: formData.part_description,
				part_number: formData.part_number,
				quantity: formData.quantity,
				unit_cost: formData.unit_cost,
				total_cost: totalCost,
			};

			let updatedParts;
			if (editingPartId !== null) {
				// Editar parte existente
				updatedParts = parts.map((p, index) => (index === editingPartId ? newPart : p));
			} else {
				// Agregar nueva parte
				updatedParts = [...parts, newPart];
			}

			onPartsChange?.(updatedParts);
			setIsModalOpen(false);
			toast.success(editingPartId !== null ? 'Parte actualizada' : 'Parte agregada');
			return;
		}

		// Modo guardado: con maintenanceId
		setLoading(true);

		const response = await createUpdateMaintenancePart({
			maintenance_part_id: editingPartId || undefined,
			completed_maintenance_id: maintenanceId,
			part_description: formData.part_description,
			part_number: formData.part_number,
			quantity: formData.quantity,
			unit_cost: formData.unit_cost,
		});

		setLoading(false);

		if (!response.ok) {
			toast.error(response.message || 'Error al guardar la parte');
			return;
		}

		toast.success(editingPartId ? 'Parte actualizada' : 'Parte agregada');

		// Recargar partes
		const partsResponse = await getMaintenancePartsByMaintenanceId(maintenanceId);
		if (partsResponse.ok && partsResponse.parts) {
			const mappedParts = partsResponse.parts.map((part: any) => ({
				...part,
				unit_cost: Number(part.unit_cost),
				total_cost: Number(part.total_cost),
			}));
			setPartsList(mappedParts as any);
			// Notificar al padre para actualizar el costo total
			onPartsChange?.(mappedParts as any);
		}

		handleCloseModal();
	};

	const handleEditPart = (part: MaintenancePart, index: number) => {
		setEditingPartId(maintenanceId ? part.maintenance_part_id! : index);
		setFormData({
			part_description: part.part_description,
			part_number: part.part_number || '',
			quantity: part.quantity,
			unit_cost: part.unit_cost,
		});
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingPartId(null);
		setFormData({
			part_description: '',
			part_number: '',
			quantity: 1,
			unit_cost: 0,
		});
	};

	const handleDeletePart = async (partId: number, index: number) => {
		if (!confirm('¿Está seguro de eliminar esta parte?')) return;

		// Modo local
		if (!maintenanceId) {
			const updatedParts = parts.filter((_, i) => i !== index);
			onPartsChange?.(updatedParts);
			toast.success('Parte eliminada');
			return;
		}

		// Modo guardado
		setLoading(true);
		const response = await deleteMaintenancePart(partId);
		setLoading(false);

		if (!response.ok) {
			toast.error(response.message || 'Error al eliminar la parte');
			return;
		}

		toast.success('Parte eliminada');

		// Recargar partes
		const partsResponse = await getMaintenancePartsByMaintenanceId(maintenanceId);
		if (partsResponse.ok && partsResponse.parts) {
			const mappedParts = partsResponse.parts.map((part: any) => ({
				...part,
				unit_cost: Number(part.unit_cost),
				total_cost: Number(part.total_cost),
			}));
			setPartsList(mappedParts as any);
			onPartsChange?.(mappedParts as any);
		}
	};

	const calculateTotalCost = () => {
		const list = maintenanceId ? partsList : parts;
		return list.reduce((sum, part) => sum + part.total_cost, 0);
	};

	// Usar la lista correcta dependiendo del modo
	const displayParts = maintenanceId ? partsList : parts;

	if (loading) {
		return <div className="text-center py-4 text-sm text-gray-500">Cargando partes...</div>;
	}

	return (
		<div className="flex flex-col gap-3">
			{/* Header con botón agregar */}
			<div className="flex justify-between items-center">
				<span className="text-sm text-gray-600">
					Total: ${calculateTotalCost().toLocaleString()}
				</span>
				<button
					type="button"
					onClick={handleOpenModal}
					className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
					<IoAddCircleOutline className="text-lg" />
					Agregar
				</button>
			</div>

			{/* Lista de partes */}
			{displayParts.length === 0 ? (
				<div className="text-center py-8">
					<IoCubeOutline className="text-4xl text-gray-300 mx-auto mb-2" />
					<p className="text-gray-500 text-sm">No hay partes agregadas</p>
					<p className="text-gray-400 text-xs mt-1">
						Haz clic en "Agregar" para añadir partes
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{displayParts.map((part, index) => (
						<div
							key={part.maintenance_part_id || index}
							onClick={() => handleEditPart(part, index)}
							className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
							<div className="flex justify-between items-start mb-2">
								<div className="flex-1">
									<h4 className="text-sm font-semibold text-gray-800">
										{part.part_description}
									</h4>
									<p className="text-xs text-gray-500 mt-0.5">
										P/N: {part.part_number}
									</p>
								</div>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleDeletePart(part.maintenance_part_id || 0, index);
									}}
									className="text-red-500 hover:text-red-700 transition-colors ml-2 z-10"
									title="Eliminar parte">
									<IoTrashOutline className="text-lg" />
								</button>
							</div>

							<div className="flex justify-between items-center text-xs">
								<div className="flex gap-3">
									<span className="text-gray-600">
										Cant: <span className="font-medium">{part.quantity}</span>
									</span>
									<span className="text-gray-600">
										<IoPricetagOutline className="inline mr-1" />$
										{part.unit_cost.toLocaleString()} c/u
									</span>
								</div>
								<span className="text-sm font-bold text-gray-800">
									${part.total_cost.toLocaleString()}
								</span>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Modal para agregar/editar parte */}
			<Dialog
				open={isModalOpen}
				onClose={handleCloseModal}
				maxWidth="md"
				fullWidth
				PaperProps={{
					className: 'rounded-xl',
				}}>
				<DialogTitle className="flex items-center justify-between bg-linear-to-r from-blue-50 to-blue-100 border-b border-blue-200">
					<div>
						<h2 className="text-xl font-bold text-gray-800">
							{editingPartId ? 'Editar Parte/Material' : 'Agregar Parte/Material'}
						</h2>
						<p className="text-sm text-gray-600 mt-1">
							{editingPartId
								? 'Modifique los detalles de la parte'
								: 'Complete los detalles de la parte utilizada'}
						</p>
					</div>
					<IconButton
						onClick={handleCloseModal}
						className="hover:bg-blue-200 transition-colors">
						<IoClose size={24} />
					</IconButton>
				</DialogTitle>
				<DialogContent className="pt-6 pb-4">
					<div className="space-y-5 mt-2">
						{/* Descripción de la parte */}
						<TextField
							label="Descripción de la Parte *"
							variant="filled"
							fullWidth
							value={formData.part_description}
							onChange={(e) =>
								setFormData({ ...formData, part_description: e.target.value })
							}
							placeholder="Ej: Filtro de aceite sintético"
							helperText="Describa brevemente la parte o material"
						/>

						{/* Número de parte */}
						<TextField
							label="Número de Parte"
							variant="filled"
							fullWidth
							value={formData.part_number}
							onChange={(e) =>
								setFormData({ ...formData, part_number: e.target.value })
							}
							placeholder="Ej: FOL-2023-MB"
							helperText="Código o referencia del fabricante (opcional)"
						/>

						{/* Fila: Cantidad y Costo Unitario */}
						<div className="grid grid-cols-2 gap-4">
							<TextField
								label="Cantidad *"
								variant="filled"
								fullWidth
								type="number"
								value={formData.quantity}
								onChange={(e) =>
									setFormData({
										...formData,
										quantity: Math.max(1, Number(e.target.value)),
									})
								}
								inputProps={{ min: 1 }}
							/>

							<NumericFormat
								value={formData.unit_cost}
								onValueChange={(values) => {
									setFormData({
										...formData,
										unit_cost: values.floatValue || 0,
									});
								}}
								customInput={TextField}
								thousandSeparator=","
								decimalSeparator="."
								decimalScale={2}
								fixedDecimalScale
								valueIsNumericString
								prefix="$"
								variant="filled"
								label="Costo Unitario *"
								fullWidth
								placeholder="$0.00"
							/>
						</div>

						{/* Resumen del costo total */}
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-700">
									Costo Total:
								</span>
								<span className="text-xl font-bold text-blue-700">
									${(formData.quantity * formData.unit_cost).toFixed(2)}
								</span>
							</div>
							<p className="text-xs text-gray-600 mt-1">
								{formData.quantity} unidad{formData.quantity !== 1 ? 'es' : ''} × $
								{formData.unit_cost.toFixed(2)}
							</p>
						</div>

						{/* Botones */}
						<div className="flex gap-3 pt-2 border-t border-gray-200">
							<button
								type="button"
								onClick={handleSubmitPart}
								disabled={
									loading ||
									!formData.part_description ||
									formData.quantity < 1 ||
									formData.unit_cost <= 0
								}
								className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
								{loading
									? 'Guardando...'
									: editingPartId
									? 'Actualizar Parte'
									: 'Agregar Parte'}
							</button>
							<button
								type="button"
								onClick={handleCloseModal}
								disabled={loading}
								className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50">
								Cancelar
							</button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
