'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../page.module.css';
import { Search, Send, Camera, X, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';

export default function SalesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ telegramLink: '', instagramLink: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, filter]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/public/data?settings=true');
      const data = await res.json();
      setSettings(data);
    } catch (e) { console.error(e); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ search, filter });
      const res = await fetch(`/api/public/data?${query.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.status === 'sold') return;
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleContact = (platform: 'telegram' | 'instagram') => {
    const link = platform === 'telegram' ? settings.telegramLink : settings.instagramLink;
    if (link) {
      window.open(link, '_blank');
    } else {
      alert(`Seller has not configured ${platform} yet.`);
    }
    setModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <Header />

      <h1 style={{ marginBottom: '24px', fontSize: '32px' }}>All IDs on Sale</h1>

      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Search by ID, bundles, level..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterSelectWrapper}>
          <select 
            className={styles.filterSelect}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All IDs</option>
            <option value="available">Available</option>
            <option value="featured">Featured First</option>
            <option value="sold">Sold Out</option>
          </select>
          <ChevronDown className={styles.filterArrow} size={20} />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading inventory...</div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product._id} className={`${styles.card} glass`}>
              <Link href={`/product/${product._id}`} style={{ display: 'block' }}>
                {product.isFeatured && product.status !== 'sold' && <div className={styles.cardBadge}>FEATURED</div>}
                {product.status === 'sold' && <div className={`${styles.cardBadge} ${styles.cardBadgeSold}`}>SOLD OUT</div>}
                
                <div className={styles.cardImageWrapper}>
                  <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={product.title} 
                    className={styles.cardImage} 
                  />
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{product.title}</h3>
                  <div className={styles.cardPrice}>₹{product.price.toLocaleString()}</div>
                  <div className={styles.cardDescription}>{product.description}</div>
                  
                  <button 
                    className={`btn ${product.status === 'sold' ? 'btn-secondary' : 'btn-primary'} ${styles.buyNowBtn}`}
                    onClick={(e) => handleBuyNow(product, e)}
                    disabled={product.status === 'sold'}
                  >
                    {product.status === 'sold' ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </div>
              </Link>
            </div>
          ))}
          {products.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No IDs found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Buy Now Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>
            </div>
            
            <img 
               src={selectedProduct?.images?.[0] || 'https://via.placeholder.com/150'} 
               alt={selectedProduct?.title}
               style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)', marginBottom: '16px' }}
            />
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Contact Seller</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
               Choose a platform to message the seller regarding <strong>{selectedProduct?.title}</strong>
            </p>

            <button className={`${styles.modalOption} ${styles.tgBtn}`} onClick={() => handleContact('telegram')}>
              <Send size={24} /> Message on Telegram
            </button>
            <button className={`${styles.modalOption} ${styles.igBtn}`} onClick={() => handleContact('instagram')}>
              <Camera size={24} /> Message on Instagram
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
