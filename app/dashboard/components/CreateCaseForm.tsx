'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCaseForm({ workspaceId }: { workspaceId: string }) {
  const [title, setTitle] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, caseNumber, jurisdiction, workspaceId }),
      });

      if (res.ok) {
        setTitle('');
        setCaseNumber('');
        setJurisdiction('');
        router.refresh();
      } else {
        alert('Failed to create case');
      }
    } catch (err) {
      alert('Error creating case');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <input
        type="text"
        placeholder="Case Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', flex: '1 1 200px' }}
        required
      />
      <input
        type="text"
        placeholder="Case Number (e.g. 2026-CV-0100)"
        value={caseNumber}
        onChange={(e) => setCaseNumber(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', flex: '1 1 150px' }}
      />
      <input
        type="text"
        placeholder="Jurisdiction (e.g. CA Superior)"
        value={jurisdiction}
        onChange={(e) => setJurisdiction(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', flex: '1 1 150px' }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{ padding: '8px 16px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {loading ? 'Creating...' : '+ Create Case'}
      </button>
    </form>
  );
}
