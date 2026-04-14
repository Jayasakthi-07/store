'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './productDetails.module.css';
import Header from '@/components/Header';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [settings, setSettings] = useState<any>({ telegramLink: '', instagramLink: '' });
  const [loading, setLoading] = useState(true);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [prodRes, settRes] = await Promise.all([
        fetch(`/api/public/products/${id}`),
        fetch('/api/public/data?settings=true')
      ]);
      const prodData = await prodRes.json();
      const settData = await settRes.json();
      
      setProduct(prodData);
      setSettings(settData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product?.images) {
      setActiveIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product?.images) {
      setActiveIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  if (!product || product.error) return <div style={{ textAlign: 'center', padding: '40px' }}>Product not found.</div>;

  const images = product.images || [];
  const currentImage = images[activeIndex] || 'https://via.placeholder.com/600';

  return (
    <div className={styles.container}>
      <Header />

      <button onClick={() => router.back()} className={styles.backBtn}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className={styles.layout}>
        {/* Left Column: Gallery & Description */}
        <div className={styles.leftColumn}>
          <div className={styles.gallery}>
            <div className={styles.mainImageContainer} onClick={() => setZoomOpen(true)}>
              {images.length > 1 && (
                <div className={`${styles.navArrow} ${styles.arrowLeft}`} onClick={prevImage}>
                  <ChevronLeft size={24} />
                </div>
              )}
              
              <img src={currentImage} alt="Main" className={styles.mainImage} />
              
              {images.length > 1 && (
                <div className={`${styles.navArrow} ${styles.arrowRight}`} onClick={nextImage}>
                  <ChevronRight size={24} />
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className={styles.thumbnailGrid}>
                {images.map((img: string, i: number) => (
                  <img 
                    key={i} 
                    src={img} 
                    alt={`Thumb ${i}`} 
                    className={`${styles.thumbnail} ${activeIndex === i ? styles.active : ''}`}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.descriptionBox}>
            <div className={styles.descriptionLabel}>Account Details</div>
            <div className={styles.descriptionContent}>{product.description}</div>
          </div>
        </div>

        {/* Right Column: Title, Price, Buy Now */}
        <div className={styles.rightColumn}>
          <div className={`${styles.statusBadge} ${product.status === 'sold' ? styles.sold : ''}`}>
            {product.status === 'sold' ? 'SOLD OUT' : 'AVAILABLE'}
          </div>
          
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.price}>₹{product.price ? Number(product.price).toLocaleString() : 'N/A'}</div>

          <div className={styles.buyNowBox}>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '18px' }}
              onClick={() => setModalOpen(true)}
              disabled={product.status === 'sold'}
            >
              {product.status === 'sold' ? 'Unavailable' : 'Buy Now'}
            </button>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Secure transaction via verified seller.
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomOpen && (
        <div className={styles.zoomModalOverlay} onClick={() => setZoomOpen(false)}>
          <div className={styles.closeZoom} onClick={() => setZoomOpen(false)}>
            <X size={32} />
          </div>
          <img src={currentImage} alt="Zoomed" className={styles.zoomImage} onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Buy Now Modal */}
      {modalOpen && (
        <div className="modalOverlay" onClick={() => setModalOpen(false)}>
          <div className="modalContent" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>
            </div>
            <img 
               src={currentImage} 
               alt={product.title}
               style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)', marginBottom: '16px' }}
            />
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Contact Seller</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
               Choose a platform to message the seller regarding <strong>{product.title}</strong>
            </p>
            <button className="modalOption tgBtn" onClick={() => handleContact('telegram')}>
              <Send size={24} /> Message on Telegram
            </button>
            <button className="modalOption igBtn" onClick={() => handleContact('instagram')}>
              <Camera size={24} /> Message on Instagram
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
