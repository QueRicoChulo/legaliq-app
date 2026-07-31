import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import CreateWorkspaceForm from './components/CreateWorkspaceForm';

export const revalidate = 0;

export default async function DashboardPage() {
  let user = await prisma.user.findUnique({
    where: { email: 'test@luqx.tech' },
    include: {
      workspaces: {
        include: { _count: { select: { cases: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@luqx.tech',
      },
      include: {
        workspaces: {
          include: { _count: { select: { cases: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  return (
    <div style={{ padding: '32px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#111827' }}>LEGALIQ Dashboard</h1>
        <p style={{ margin: 0, color: '#6b7280' }}>Active User: <strong>test@luqx.tech</strong> (Development Mode)</p>
      </header>

      <section>
        <h2 style={{ fontSize: '20px', margin: '0 0 16px 0', color: '#1f2937' }}>Workspaces</h2>
        <CreateWorkspaceForm />

        {user.workspaces.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No workspaces found. Create one above to get started.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {user.workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={`/dashboard/workspaces/${ws.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e40af' }}>{ws.name}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {ws._count.cases} {ws._count.cases === 1 ? 'Case' : 'Cases'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
