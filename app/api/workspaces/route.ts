import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
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

    const workspace = await prisma.workspace.create({
      data: {
        name,
        members: {
          connect: { id: user.id },
        },
      },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create workspace' }, { status: 500 });
  }
}
