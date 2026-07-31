import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import CreateCaseForm from '../../components/CreateCaseForm';

export const revalidate = 0;

export default async function WorkspaceDetailPage({ params }: { params: { id: string } }) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.id },
    include: {
      cases: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <div style={{ padding: '32px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link href="/dashboard" style={{ color: '#1e40af', textDecoration: 'none', fontSize: '14px' }}>
          &larr; Back to Workspaces
        </Link>
      </div>

      <header style={{ marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#111827' }}>
          Workspace: {workspace.name}
        </h1>
      </header>

      <section>
        <h2 style={{ fontSize: '20px', margin: '0 0 16px 0', color: '#1f2937' }}>Cases</h2>
        <CreateCaseForm workspaceId={workspace.id} />

        {workspace.cases.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No cases in this workspace yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {workspace.cases.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/cases/${c.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e40af' }}>{c.title}</h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#4b5563' }}>
                    <strong>No:</strong> {c.caseNumber || 'N/A'}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    <strong>Jurisdiction:</strong> {c.jurisdiction || 'N/A'}
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
