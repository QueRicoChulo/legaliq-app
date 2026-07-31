import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/prisma';
import DocumentUploadForm from '../../components/DocumentUploadForm';

export const revalidate = 0;

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const caseItem = await prisma.case.findUnique({
    where: { id: params.id },
    include: {
      workspace: true,
      documents: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!caseItem) {
    notFound();
  }

  const auditLogs = await prisma.$queryRaw<Array<{ entity_id: string; current_hash: string }>>`
    SELECT entity_id, current_hash FROM audit_log WHERE entity_type = 'Document'
  `;

  const auditedMap = new Map(auditLogs.map((a) => [a.entity_id, a.current_hash]));

  return (
    <div style={{ padding: '32px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link href={`/dashboard/workspaces/${caseItem.workspaceId}`} style={{ color: '#1e40af', textDecoration: 'none', fontSize: '14px' }}>
          &larr; Back to Workspace ({caseItem.workspace.name})
        </Link>
      </div>

      <header style={{ marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#111827' }}>
          Case: {caseItem.title}
        </h1>
        <p style={{ margin: '0 0 4px 0', color: '#4b5563' }}><strong>Case Number:</strong> {caseItem.caseNumber || 'N/A'}</p>
        <p style={{ margin: 0, color: '#4b5563' }}><strong>Jurisdiction:</strong> {caseItem.jurisdiction || 'N/A'}</p>
      </header>

      <section>
        <h2 style={{ fontSize: '20px', margin: '0 0 16px 0', color: '#1f2937' }}>Documents & Audit Chain</h2>
        <DocumentUploadForm caseId={caseItem.id} />

        {caseItem.documents.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No documents uploaded to this case yet.</p>
        ) : (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', color: '#374151' }}>File Name</th>
                  <th style={{ padding: '12px 16px', color: '#374151' }}>Upload Date</th>
                  <th style={{ padding: '12px 16px', color: '#374151' }}>Hash</th>
                  <th style={{ padding: '12px 16px', color: '#374151' }}>Audit Status</th>
                </tr>
              </thead>
              <tbody>
                {caseItem.documents.map((doc) => {
                  const isChained = auditedMap.has(doc.id);
                  const displayHash = auditedMap.get(doc.id) || doc.hash || 'N/A';

                  return (
                    <tr key={doc.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '500', color: '#111827' }}>{doc.fileName}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                        {new Date(doc.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#4b5563', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {displayHash}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {isChained ? (
                          <span style={{
                            padding: '4px 8px',
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            ✓ CHAINED
                          </span>
                        ) : (
                          <span style={{
                            padding: '4px 8px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            ⏳ PENDING
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
