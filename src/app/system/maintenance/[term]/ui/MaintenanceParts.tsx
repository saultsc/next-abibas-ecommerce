'use client';

import { Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { useState } from 'react';
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
	maintenance_part_id: number;
	part_description: string;
	part_number: string;
	quantity: number;
	unit_cost: number;
	total_cost: number;
	supplier_name: string;
}

interface Props {
	parts?: MaintenancePart[];
	onPartsChange?: (parts: MaintenancePart[]) => void;
}

interface PartFormData {
	part_description: string;
	part_number: string;
	quantity: number;
	unit_cost: number;
	supplier_name: string;
}

// Proveedores estáticos para el select
const mockSuppliers = [
	'Mercedes-Benz Parts',
	'Mobil 1',
	'Brembo',
	'Bosch',
	'Mann Filter',
	'Castrol',
	'Michelin',
	'Continental',
	'NGK',
	'Denso',
];

// Datos estáticos de ejemplo
const mockParts: MaintenancePart[] = [
	{
		maintenance_part_id: 1,
		part_description: 'Filtro de aceite sintético',
		part_number: 'FOL-2023-MB',
		quantity: 1,
		unit_cost: 450,
		total_cost: 450,
		supplier_name: 'Mercedes-Benz Parts',
	},
	{
		maintenance_part_id: 2,
		part_description: 'Aceite sintético 5W-40 (5 litros)',
		part_number: 'OIL-5W40-5L',
		quantity: 2,
		unit_cost: 1200,
		total_cost: 2400,
		supplier_name: 'Mobil 1',
	},
	{
		maintenance_part_id: 3,
		part_description: 'Pastillas de freno delanteras',
		part_number: 'BRK-F-2024',
		quantity: 1,
		unit_cost: 3500,
		total_cost: 3500,
		supplier_name: 'Brembo',
	},
	{
		maintenance_part_id: 4,
		part_description: 'Discos de freno',
		part_number: 'DSC-F-2024',
		quantity: 2,
		unit_cost: 2800,
		total_cost: 5600,
		supplier_name: 'Brembo',
	},
];

export const MaintenanceParts = ({ parts = mockParts, onPartsChange }: Props) => {
	const [partsList, setPartsList] = useState<MaintenancePart[]>(parts);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPartId, setEditingPartId] = useState<number | null>(null);
	const [formData, setFormData] = useState<PartFormData>({
		part_description: '',
		part_number: '',
		quantity: 1,
		unit_cost: 0,
		supplier_name: '',
	});

	const handleAddPart = () => {
		const total_cost = formData.quantity * formData.unit_cost;

		if (editingPartId) {
			// Modo edición
			const updatedParts = partsList.map((part) =>
				part.maintenance_part_id === editingPartId
					? {
							...part,
							...formData,
							total_cost,
					  }
					: part
			);
			setPartsList(updatedParts);
			if (onPartsChange) {
				onPartsChange(updatedParts);
			}
			toast.success('Parte actualizada exitosamente');
		} else {
			// Modo crear
			const newPart: MaintenancePart = {
				maintenance_part_id: Date.now(),
				...formData,
				total_cost,
			};

			const updatedParts = [...partsList, newPart];
			setPartsList(updatedParts);
			if (onPartsChange) {
				onPartsChange(updatedParts);
			}
			toast.success('Parte agregada exitosamente');
		}

		setIsModalOpen(false);
		setEditingPartId(null);

		// Reset form
		setFormData({
			part_description: '',
			part_number: '',
			quantity: 1,
			unit_cost: 0,
			supplier_name: '',
		});
	};

	const handleEditPart = (part: MaintenancePart) => {
		setEditingPartId(part.maintenance_part_id);
		setFormData({
			part_description: part.part_description,
			part_number: part.part_number,
			quantity: part.quantity,
			unit_cost: part.unit_cost,
			supplier_name: part.supplier_name,
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
			supplier_name: '',
		});
	};

	const handleDeletePart = (partId: number) => {
		const updatedParts = partsList.filter((part) => part.maintenance_part_id !== partId);
		setPartsList(updatedParts);
		if (onPartsChange) {
			onPartsChange(updatedParts);
		}
		toast.success('Parte eliminada');
	};

	const calculateTotalCost = () => {
		return partsList.reduce((sum, part) => sum + part.total_cost, 0);
	};

	return (
		<div className="flex flex-col gap-3">
			{/* Header con botón agregar */}
			<div className="flex justify-between items-center">
				<span className="text-sm text-gray-600">
					Total: ${calculateTotalCost().toLocaleString()}
				</span>
				<button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
					<IoAddCircleOutline className="text-lg" />
					Agregar
				</button>
			</div>

			{/* Lista de partes */}
			{partsList.length === 0 ? (
				<div className="text-center py-8">
					<IoCubeOutline className="text-4xl text-gray-300 mx-auto mb-2" />
					<p className="text-gray-500 text-sm">No hay partes agregadas</p>
					<p className="text-gray-400 text-xs mt-1">
						Haz clic en "Agregar" para añadir partes
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{partsList.map((part) => (
						<div
							key={part.maintenance_part_id}
							onClick={() => handleEditPart(part)}
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
										handleDeletePart(part.maintenance_part_id);
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

							<div className="mt-1.5 pt-1.5 border-t border-gray-100">
								<p className="text-xs text-gray-500">
									Proveedor: {part.supplier_name}
								</p>
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
				<DialogTitle className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
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

						{/* Proveedor */}
						<div>
							<TextField
								label="Proveedor *"
								variant="filled"
								fullWidth
								value={formData.supplier_name}
								onChange={(e) =>
									setFormData({ ...formData, supplier_name: e.target.value })
								}
								placeholder="Ej: Mercedes-Benz Parts"
								helperText="Nombre del proveedor de la parte"
								select
								SelectProps={{
									native: true,
								}}>
								{mockSuppliers.map((supplier) => (
									<option key={supplier} value={supplier}>
										{supplier}
									</option>
								))}
							</TextField>
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
								onClick={handleAddPart}
								disabled={
									!formData.part_description ||
									!formData.supplier_name ||
									formData.quantity < 1 ||
									formData.unit_cost <= 0
								}
								className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md">
								{editingPartId ? 'Actualizar Parte' : 'Agregar Parte'}
							</button>
							<button
								type="button"
								onClick={handleCloseModal}
								className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
								Cancelar
							</button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
