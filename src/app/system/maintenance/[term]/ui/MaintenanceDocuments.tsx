'use client';

import { useState } from 'react';
import {
	IoAddCircleOutline,
	IoCalendarOutline,
	IoCloudUploadOutline,
	IoDocumentTextOutline,
	IoDownloadOutline,
	IoTrashOutline,
} from 'react-icons/io5';

interface MaintenanceDocument {
	document_id: number;
	document_name: string;
	document_type: string;
	file_size: string;
	upload_date: Date;
	uploaded_by: string;
	file_url?: string;
}

interface Props {
	documents?: MaintenanceDocument[];
	onDocumentsChange?: (documents: MaintenanceDocument[]) => void;
}

// Datos estáticos de ejemplo
const mockDocuments: MaintenanceDocument[] = [
	{
		document_id: 1,
		document_name: 'Factura_Mantenimiento_2024-11-15.pdf',
		document_type: 'Factura',
		file_size: '245 KB',
		upload_date: new Date('2024-11-15'),
		uploaded_by: 'Juan Pérez',
		file_url: '/documents/factura_001.pdf',
	},
	{
		document_id: 2,
		document_name: 'Orden_Trabajo_MB_Sprinter.pdf',
		document_type: 'Orden de Trabajo',
		file_size: '180 KB',
		upload_date: new Date('2024-11-15'),
		uploaded_by: 'Juan Pérez',
		file_url: '/documents/orden_001.pdf',
	},
	{
		document_id: 3,
		document_name: 'Reporte_Diagnostico.pdf',
		document_type: 'Reporte Diagnóstico',
		file_size: '1.2 MB',
		upload_date: new Date('2024-11-15'),
		uploaded_by: 'Técnico Mercedes',
		file_url: '/documents/diagnostico_001.pdf',
	},
	{
		document_id: 4,
		document_name: 'Garantia_Repuestos.pdf',
		document_type: 'Garantía',
		file_size: '95 KB',
		upload_date: new Date('2024-11-15'),
		uploaded_by: 'Mercedes-Benz Parts',
		file_url: '/documents/garantia_001.pdf',
	},
];

export const MaintenanceDocuments = ({ documents = mockDocuments, onDocumentsChange }: Props) => {
	const [documentsList, setDocumentsList] = useState<MaintenanceDocument[]>(documents);
	const [showUploadForm, setShowUploadForm] = useState(false);

	const handleUploadDocument = () => {
		setShowUploadForm(true);
		// Aquí se implementaría la lógica para subir documentos
		console.log('Subir nuevo documento');
	};

	const handleDeleteDocument = (docId: number) => {
		const updatedDocs = documentsList.filter((doc) => doc.document_id !== docId);
		setDocumentsList(updatedDocs);
		if (onDocumentsChange) {
			onDocumentsChange(updatedDocs);
		}
		console.log('Eliminar documento:', docId);
	};

	const handleDownloadDocument = (doc: MaintenanceDocument) => {
		console.log('Descargar documento:', doc.document_name);
		// Aquí se implementaría la lógica de descarga
	};

	const getDocumentIcon = (type: string) => {
		return <IoDocumentTextOutline className="text-2xl text-blue-500" />;
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('es-ES', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	return (
		<div className="flex flex-col gap-3">
			{/* Header con botón subir */}
			<div className="flex justify-between items-center">
				<span className="text-sm text-gray-600">
					{documentsList.length} {documentsList.length === 1 ? 'documento' : 'documentos'}
				</span>
				<button
					type="button"
					onClick={handleUploadDocument}
					className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
					<IoAddCircleOutline className="text-lg" />
					Subir
				</button>
			</div>

			{/* Lista de documentos */}
			{documentsList.length === 0 ? (
				<div className="text-center py-8">
					<IoCloudUploadOutline className="text-4xl text-gray-300 mx-auto mb-2" />
					<p className="text-gray-500 text-sm">No hay documentos adjuntos</p>
					<p className="text-gray-400 text-xs mt-1">
						Haz clic en "Subir" para añadir documentos
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{documentsList.map((doc) => (
						<div
							key={doc.document_id}
							className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
							<div className="flex gap-3">
								{/* Icono del documento */}
								<div className="flex-shrink-0">
									{getDocumentIcon(doc.document_type)}
								</div>

								{/* Información del documento */}
								<div className="flex-1 min-w-0">
									<h4 className="text-sm font-semibold text-gray-800 truncate">
										{doc.document_name}
									</h4>
									<div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
										<span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
											{doc.document_type}
										</span>
										<span>{doc.file_size}</span>
									</div>
									<div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
										<IoCalendarOutline className="text-xs" />
										{formatDate(doc.upload_date)} · {doc.uploaded_by}
									</div>
								</div>

								{/* Acciones */}
								<div className="flex flex-col gap-1">
									<button
										type="button"
										onClick={() => handleDownloadDocument(doc)}
										className="text-green-600 hover:text-green-700 transition-colors"
										title="Descargar">
										<IoDownloadOutline className="text-lg" />
									</button>
									<button
										type="button"
										onClick={() => handleDeleteDocument(doc.document_id)}
										className="text-red-500 hover:text-red-700 transition-colors"
										title="Eliminar">
										<IoTrashOutline className="text-lg" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Formulario para subir documento (placeholder) */}
			{showUploadForm && (
				<div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
					<div className="flex items-center gap-2 mb-2">
						<IoCloudUploadOutline className="text-blue-600 text-xl" />
						<p className="text-xs text-blue-700 font-medium">Subir nuevo documento</p>
					</div>
					<div className="space-y-2">
						<div className="bg-white p-3 rounded border border-dashed border-blue-300 text-center">
							<p className="text-xs text-gray-600">
								Arrastre archivos aquí o haga clic para seleccionar
							</p>
							<p className="text-xs text-gray-400 mt-1">
								PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
							</p>
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
								Seleccionar archivo
							</button>
							<button
								type="button"
								onClick={() => setShowUploadForm(false)}
								className="text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
