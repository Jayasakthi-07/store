'use client';

import { useState, useEffect } from 'react';
import { Trash, UploadCloud } from 'lucide-react';

export default function ProofsAdminPage() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      const res = await fetch('/api/admin/proof');
      const data = await res.json();
      setProofs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const files = Array.from(e.target.files);

    try {
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body,
        });
        const data = await res.json();
        
        if (data.url) {
           await fetch('/api/admin/proof', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ imageUrl: data.url })
           });
        }
      }
      fetchProofs();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this proof?')) return;
    try {
      await fetch(`/api/admin/proof?id=${id}`, { method: 'DELETE' });
      fetchProofs();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading proofs...</div>;

  return (
    <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Transaction Proofs</h2>
        
        <label className="btn btn-primary" style={{ cursor: 'pointer', gap: '8px' }}>
          <UploadCloud size={20} /> {uploading ? 'Uploading...' : 'Upload Proof'}
          <input type="file" multiple accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={handleFileUpload} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {proofs.map((proof) => (
          <div key={proof._id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', minHeight: '200px' }}>
             <img src={proof.imageUrl} alt="Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <button 
               className="btn-danger" 
               style={{ position: 'absolute', top: '8px', right: '8px', padding: '8px', borderRadius: '8px' }}
               onClick={() => handleDelete(proof._id)}
             >
               <Trash size={16} color="#fff" />
             </button>
          </div>
        ))}
        {proofs.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No proofs uploaded.
          </div>
        )}
      </div>
    </div>
  );
}
