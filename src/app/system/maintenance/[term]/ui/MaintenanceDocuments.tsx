'use client';

import { useState } from 'react';
import {
	IoAddCircleOutline,
	IoCloudUploadOutline,
	IoDocumentTextOutline,
	IoDownloadOutline,
	IoTrashOutline,
} from 'react-icons/io5';
import { toast } from 'sonner';

interface MaintenanceDocument {
	maintenance_document_id?: number;
	document_url: string;
	document_name?: string | null;
}

type DocumentInput = MaintenanceDocument | File;

interface Props {
	maintenanceId?: number;
	documents?: DocumentInput[];
	onDocumentsChange?: (documents: DocumentInput[]) => void;
}

export const MaintenanceDocuments = ({
	maintenanceId,
	documents = [],
	onDocumentsChange,
}: Props) => {
	const [documentsList, setDocumentsList] = useState<MaintenanceDocument[]>([]);
	const [showUploadForm, setShowUploadForm] = useState(false);
	const [uploading, setUploading] = useState(false);

	// Usar la lista correcta dependiendo del modo
	const displayDocuments = maintenanceId ? documentsList : documents;

	const handleUploadDocument = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validar tamaño (10MB)
		if (file.size > 10 * 1024 * 1024) {
			toast.error('El archivo no debe superar 10MB');
			event.target.value = '';
			return;
		}

		// Validar tipo
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'image/jpeg',
			'image/png',
		];

		if (!allowedTypes.includes(file.type)) {
			toast.error('Tipo de archivo no permitido (solo PDF, DOC, DOCX, JPG, PNG)');
			event.target.value = '';
			return;
		}

		setUploading(true);

		try {
			// Modo local: sin maintenanceId - agregar el archivo directamente
			if (!maintenanceId) {
				const updatedDocuments = [...documents, file];
				onDocumentsChange?.(updatedDocuments);
				toast.success('Documento agregado (se subirá al guardar)');
				setShowUploadForm(false);
				event.target.value = '';
				setUploading(false);
				return;
			}

			// Modo guardado: con maintenanceId
			const formData = new FormData();
			formData.append('file', file);
			formData.append('maintenanceId', maintenanceId.toString());

			const response = await fetch('/api/maintenance/upload-document', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Error al subir el archivo');
			}

			const data = await response.json();

			setDocumentsList([...documentsList, data.document]);
			toast.success('Documento subido exitosamente');
			setShowUploadForm(false);
			event.target.value = '';
		} catch (error) {
			console.error('Error al subir documento:', error);
			toast.error(error instanceof Error ? error.message : 'Error al subir el documento');
			event.target.value = '';
		} finally {
			setUploading(false);
		}
	};

	const handleDeleteDocument = async (doc: DocumentInput, index: number) => {
		if (!confirm(`¿Está seguro de eliminar este documento?`)) return;

		// Modo local
		if (!maintenanceId) {
			const updatedDocuments = documents.filter((_, i) => i !== index);
			onDocumentsChange?.(updatedDocuments);
			toast.success('Documento eliminado');
			return;
		}

		// Modo guardado: con maintenanceId - solo si no es un File
		if (doc instanceof File) {
			toast.error('Este documento aún no ha sido guardado');
			return;
		}

		try {
			const response = await fetch(
				`/api/maintenance/documents/${doc.maintenance_document_id}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ file_url: doc.document_url }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Error al eliminar el documento');
			}

			setDocumentsList(
				documentsList.filter(
					(d) => d.maintenance_document_id !== doc.maintenance_document_id
				)
			);
			toast.success('Documento eliminado exitosamente');
		} catch (error) {
			console.error('Error al eliminar documento:', error);
			toast.error(error instanceof Error ? error.message : 'Error al eliminar el documento');
		}
	};

	const handleDownloadDocument = (doc: MaintenanceDocument) => {
		window.open(doc.document_url, '_blank');
	};

	const getFileExtension = (doc: DocumentInput) => {
		if (doc instanceof File) {
			return doc.name.split('.').pop()?.toLowerCase() || 'file';
		}
		const fileName = doc.document_name || doc.document_url.split('/').pop() || '';
		const ext = fileName.split('.').pop()?.toLowerCase();
		return ext || 'file';
	};

	const getDocumentName = (doc: DocumentInput) => {
		if (doc instanceof File) {
			return doc.name;
		}
		return doc.document_name || 'Documento sin nombre';
	};

	const getDocumentUrl = (doc: DocumentInput) => {
		if (doc instanceof File) {
			return URL.createObjectURL(doc);
		}
		return doc.document_url;
	};

	const getDocumentId = (doc: DocumentInput, index: number) => {
		if (doc instanceof File) {
			return `file-${index}`;
		}
		return doc.maintenance_document_id || index;
	};

	return (
		<div className="flex flex-col gap-3">
			{/* Header con botón subir */}
			<div className="flex justify-between items-center">
				<span className="text-sm text-gray-600">
					{displayDocuments.length}{' '}
					{displayDocuments.length === 1 ? 'documento' : 'documentos'}
				</span>
				<button
					type="button"
					onClick={() => setShowUploadForm(!showUploadForm)}
					className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
					<IoAddCircleOutline className="text-lg" />
					Subir
				</button>
			</div>

			{/* Lista de documentos */}
			{displayDocuments.length === 0 ? (
				<div className="text-center py-8">
					<IoCloudUploadOutline className="text-4xl text-gray-300 mx-auto mb-2" />
					<p className="text-gray-500 text-sm">No hay documentos adjuntos</p>
					<p className="text-gray-400 text-xs mt-1">
						Haz clic en "Subir" para añadir documentos
					</p>
				</div>
			) : (
				<div className="space-y-2">
					{displayDocuments.map((doc, index) => (
						<div
							key={getDocumentId(doc, index)}
							className="bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
							<div className="flex gap-3">
								{/* Icono del documento */}
								<div className="shrink-0">
									<IoDocumentTextOutline className="text-2xl text-blue-500" />
								</div>

								{/* Información del documento */}
								<div className="flex-1 min-w-0">
									<h4 className="text-sm font-semibold text-gray-800 truncate">
										{getDocumentName(doc)}
									</h4>
									<div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
										<span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase">
											{getFileExtension(doc)}
										</span>
										{doc instanceof File && (
											<span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
												Pendiente de subir
											</span>
										)}
									</div>
								</div>

								{/* Acciones */}
								<div className="flex flex-col gap-1">
									{!(doc instanceof File) && (
										<button
											type="button"
											onClick={() => handleDownloadDocument(doc)}
											className="text-green-600 hover:text-green-700 transition-colors"
											title="Abrir/Descargar">
											<IoDownloadOutline className="text-lg" />
										</button>
									)}
									<button
										type="button"
										onClick={() => handleDeleteDocument(doc, index)}
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

			{/* Formulario para subir documento */}
			{showUploadForm && (
				<div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
					<div className="flex items-center gap-2 mb-2">
						<IoCloudUploadOutline className="text-blue-600 text-xl" />
						<p className="text-xs text-blue-700 font-medium">Subir nuevo documento</p>
					</div>
					<div className="space-y-2">
						<div className="bg-white p-3 rounded border border-dashed border-blue-300">
							<input
								type="file"
								accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
								onChange={handleUploadDocument}
								disabled={uploading}
								className="w-full text-xs"
							/>
							<p className="text-xs text-gray-400 mt-2">
								PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
							</p>
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setShowUploadForm(false)}
								disabled={uploading}
								className="text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50">
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
