'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateWorkspaceForm() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setName('');
        router.refresh();
      } else {
        alert('Failed to create workspace');
      }
    } catch (err) {
      alert('Error creating workspace');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="New Workspace Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', width: '260px' }}
        required
      />
      <button
        type="submit"
        disabled={loading}
        style={{ padding: '8px 16px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {loading ? 'Creating...' : '+ Create Workspace'}
      </button>
    </form>
  );
}
