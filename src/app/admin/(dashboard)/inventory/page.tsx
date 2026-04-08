'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash, Plus } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <h2>All IDs</h2>
        <Link href="/admin/inventory/edit" className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={18} /> Add New ID
        </Link>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)' }}>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>Title</th>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>Price</th>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>Status</th>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>Featured</th>
              <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>{product.title}</td>
                  <td style={{ padding: '16px 24px' }}>₹{product.price}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      background: product.status === 'available' ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 69, 58, 0.2)',
                      color: product.status === 'available' ? '#34C759' : '#FF453A' 
                    }}>
                      {product.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>{product.isFeatured ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Link href={`/admin/inventory/edit?id=${product._id}`} className="btn btn-secondary" style={{ padding: '8px' }}>
                      <Edit size={16} />
                    </Link>
                    <button className="btn btn-danger" style={{ padding: '8px' }} onClick={() => handleDelete(product._id)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
