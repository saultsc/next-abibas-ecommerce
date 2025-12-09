import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const maintenanceId = formData.get('maintenanceId') as string;

		if (!file) {
			return NextResponse.json(
				{ error: 'No se proporcionó ningún archivo' },
				{ status: 400 }
			);
		}

		if (!maintenanceId) {
			return NextResponse.json(
				{ error: 'No se proporcionó ID de mantenimiento' },
				{ status: 400 }
			);
		}

		// Validar tamaño (10MB)
		if (file.size > 10 * 1024 * 1024) {
			return NextResponse.json({ error: 'El archivo excede 10MB' }, { status: 400 });
		}

		// Validar tipo de archivo
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'image/jpeg',
			'image/png',
		];

		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
		}

		// Generar nombre único
		const timestamp = Date.now();
		const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
		const fileName = `${maintenanceId}_${timestamp}_${originalName}`;

		// Convertir archivo a buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Guardar en public/maintenance-docs
		const publicPath = path.join(process.cwd(), 'public', 'maintenance-docs');
		const filePath = path.join(publicPath, fileName);

		await writeFile(filePath, buffer);

		// Calcular tamaño en formato legible
		const fileSizeKB = (file.size / 1024).toFixed(2);
		const fileSize =
			file.size > 1024 * 1024
				? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
				: `${fileSizeKB} KB`;

		// URL pública del archivo
		const fileUrl = `/maintenance-docs/${fileName}`;

		// Preparar respuesta con información del documento
		const document = {
			document_id: timestamp, // Temporal, debería ser de BD
			document_name: file.name,
			document_type: getDocumentType(file.type),
			file_size: fileSize,
			upload_date: new Date(),
			uploaded_by: 'Usuario Actual', // TODO: obtener del session
			file_url: fileUrl,
		};

		return NextResponse.json(
			{
				message: 'Archivo subido exitosamente',
				document,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error al subir documento:', error);
		return NextResponse.json({ error: 'Error al procesar el archivo' }, { status: 500 });
	}
}

function getDocumentType(mimeType: string): string {
	const typeMap: Record<string, string> = {
		'application/pdf': 'PDF',
		'application/msword': 'DOC',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
		'image/jpeg': 'JPG',
		'image/png': 'PNG',
	};

	return typeMap[mimeType] || 'Otro';
}
