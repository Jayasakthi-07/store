'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UploadCloud, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ProductEditorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    images: [] as string[],
    status: 'available',
    isFeatured: false,
  });

  useEffect(() => {
    if (editId) {
      fetchProduct();
    }
  }, [editId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${editId}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setFormData({
        title: data.title,
        price: data.price.toString(),
        description: data.description,
        images: data.images || [],
        status: data.status,
        isFeatured: data.isFeatured,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetArr: 'images') => {
    if (!e.target.files) return;
    setUploading(true);
    const files = Array.from(e.target.files);

    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body,
        });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      }
      setFormData(prev => ({
        ...prev,
        [targetArr]: [...prev[targetArr], ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number, targetArr: 'images') => {
    setFormData(prev => {
      const updated = [...prev[targetArr]];
      updated.splice(index, 1);
      return { ...prev, [targetArr]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editId ? `/api/admin/products/${editId}` : '/api/admin/products';
      const method = editId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Action failed');
      
      router.push('/admin/inventory');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/admin/inventory" className="btn btn-secondary" style={{ padding: '8px' }}>
          <ArrowLeft size={20} />
        </Link>
        <h2>{editId ? 'Edit Product' : 'Add New Product'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="glass" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Title (Short)</label>
            <input required type="text" className="input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. S2 ELITE PASS ID" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Price (₹)</label>
            <input required type="number" className="input" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="e.g. 5000" />
          </div>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Description & Details (Multiline formatting supported)</label>
           <textarea required className="input" style={{ minHeight: '200px' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Status</label>
            <select className="input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '30px' }}>
            <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} style={{ width: '20px', height: '20px' }} />
            <label htmlFor="isFeatured" style={{ color: 'var(--text-primary)', cursor: 'pointer' }}>Feature on homepage</label>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0' }} />

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Product Images (up to 30)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            {formData.images.map((src, i) => (
              <div key={i} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={src} alt="img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => removeImage(i, 'images')} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px', color: 'white' }}><X size={14}/></button>
              </div>
            ))}
            <label style={{ width: '100px', height: '100px', borderRadius: '8px', border: '1px dashed var(--accent)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--accent)' }}>
              <UploadCloud size={24} />
              <span style={{ fontSize: '12px', marginTop: '4px' }}>Upload</span>
              <input type="file" multiple accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={(e) => handleFileUpload(e, 'images')} />
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }} disabled={loading || uploading}>
          {loading ? 'Saving...' : uploading ? 'Uploading images...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}

export default function ProductEditor() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <ProductEditorForm />
    </Suspense>
  );
}
