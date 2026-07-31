'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DocumentUploadForm({ caseId }: { caseId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/cases/${caseId}/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setFile(null);
        // Reset file input element
        const input = document.getElementById('file-input') as HTMLInputElement;
        if (input) input.value = '';
        router.refresh();
      } else {
        alert('File upload failed');
      }
    } catch (err) {
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} style={{ marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        id="file-input"
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
        required
      />
      <button
        type="submit"
        disabled={uploading || !file}
        style={{
          padding: '8px 16px',
          background: uploading ? '#9ca3af' : '#1e40af',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </form>
  );
}
