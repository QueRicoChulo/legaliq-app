import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const payloadHash = crypto.createHash('sha256').update(buffer).digest('hex');

    const uploadDir = '/opt/legaliq/uploads';
    await mkdir(uploadDir, { recursive: true });

    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeFileName);
    await writeFile(filePath, buffer);

    const document = await prisma.document.create({
      data: {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        storagePath: filePath,
        storageType: 'VPS',
        hash: payloadHash,
        caseId,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
