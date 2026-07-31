import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LEGALIQ Database Seeding...');

  // 1. Upsert test user (Role: ATTORNEY)
  const user = await prisma.user.upsert({
    where: { email: 'test@luqx.tech' },
    update: {},
    create: {
      email: 'test@luqx.tech',
      fullName: 'Demo Attorney',
      role: Role.ATTORNEY,
      barNumber: 'CA-123456',
      jurisdiction: 'CA',
    },
  });
  console.log(`✅ User created/found: ${user.email} (ID: ${user.id})`);

  // 2. Create workspace ("Demo Firm") and link the user
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Demo Firm',
      members: {
        connect: { id: user.id },
      },
    },
  });
  console.log(`✅ Workspace created: ${workspace.name} (ID: ${workspace.id})`);

  // 3. Create case ("Demo Case") linked to user and workspace
  const demoCase = await prisma.case.create({
    data: {
      title: 'Demo Case',
      caseNumber: 'CIV-2026-001',
      jurisdiction: 'CA_SUPERIOR_COURT',
      workspaceId: workspace.id,
      userId: user.id,
    },
  });
  console.log(`✅ Case created: ${demoCase.title} (ID: ${demoCase.id})`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
