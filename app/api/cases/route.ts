import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, caseNumber, jurisdiction, workspaceId } = await req.json();

    if (!title || !workspaceId) {
      return NextResponse.json({ error: 'Title and workspaceId are required' }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    let user = await prisma.user.findUnique({
      where: { email: 'test@luqx.tech' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@luqx.tech',
        },
      });
    }

    const newCase = await prisma.case.create({
      data: {
        title,
        caseNumber: caseNumber || `CASE-${Date.now()}`,
        jurisdiction: jurisdiction || 'CA_SUPERIOR_COURT',
        workspaceId: workspace.id,
        userId: user.id,
      },
    });

    return NextResponse.json(newCase, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create case' }, { status: 500 });
  }
}
