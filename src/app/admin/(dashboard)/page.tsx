import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { Package, CheckCircle, Star } from 'lucide-react';

export const revalidate = 0; // Don't cache admin stats

export default async function AdminDashboard() {
  await connectToDatabase();
  
  const totalProducts = await Product.countDocuments();
  const availableProducts = await Product.countDocuments({ status: 'available' });
  const soldProducts = await Product.countDocuments({ status: 'sold' });
  const featuredProducts = await Product.countDocuments({ isFeatured: true });

  const stats = [
    { label: 'Total IDs', value: totalProducts, icon: <Package size={24} color="var(--accent)" /> },
    { label: 'Available', value: availableProducts, icon: <CheckCircle size={24} color="#34C759" /> },
    { label: 'Sold', value: soldProducts, icon: <CheckCircle size={24} color="#FF453A" /> },
    { label: 'Featured', value: featuredProducts, icon: <Star size={24} color="#FFD60A" /> },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
      {stats.map((stat, idx) => (
        <div key={idx} className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
            {stat.icon}
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
