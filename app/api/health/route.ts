import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ status: 'ok', userCount });
  } catch (error) {
    console.error('Health Check DB Error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to query database' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
