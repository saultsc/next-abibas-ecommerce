import { unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const documentId = parseInt(id);

		if (isNaN(documentId)) {
			return NextResponse.json({ error: 'ID de documento inválido' }, { status: 400 });
		}

		// TODO: Cuando exista tabla de documentos, obtener file_url de la BD
		// const document = await prisma.maintenance_documents.findUnique({
		//   where: { document_id: documentId }
		// });

		// Por ahora, el cliente debe enviar el file_url en el body
		const body = await request.json();
		const fileUrl = body.file_url as string;

		if (!fileUrl) {
			return NextResponse.json(
				{ error: 'No se proporcionó la URL del archivo' },
				{ status: 400 }
			);
		}

		// Extraer nombre del archivo de la URL
		const fileName = fileUrl.split('/').pop();
		if (!fileName) {
			return NextResponse.json({ error: 'URL de archivo inválida' }, { status: 400 });
		}

		// Eliminar archivo físico
		const filePath = path.join(process.cwd(), 'public', 'MaintenanceDocs', fileName);

		try {
			await unlink(filePath);
		} catch (error) {
			console.error('Error al eliminar archivo:', error);
			// Continuar aunque falle el borrado físico
		}

		// TODO: Cuando exista tabla, eliminar registro de BD
		// await prisma.maintenance_documents.delete({
		//   where: { document_id: documentId }
		// });

		return NextResponse.json(
			{
				message: 'Documento eliminado exitosamente',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error al eliminar documento:', error);
		return NextResponse.json({ error: 'Error al eliminar el documento' }, { status: 500 });
	}
}
