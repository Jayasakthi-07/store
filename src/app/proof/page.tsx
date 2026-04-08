'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import styles from '../page.module.css';

export default function ProofsPage() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      const res = await fetch('/api/public/proof');
      const data = await res.json();
      setProofs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Transaction Proofs</h1>
        <p style={{ color: 'var(--text-secondary)' }}>100% Secure & Trusted Store</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading proofs...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {proofs.map((proof) => (
            <div key={proof._id} className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <img src={proof.imageUrl} alt="Proof" style={{ width: '100%', display: 'block' }} />
            </div>
          ))}
          {proofs.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No proofs uploaded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
