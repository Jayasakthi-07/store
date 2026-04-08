'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../admin-layout.module.css';
import { LayoutDashboard, Package, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
    { name: 'Proofs', path: '/admin/proof', icon: <Package size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div style={{ padding: '8px', background: 'var(--accent)', borderRadius: '8px' }}>
            <Package size={24} color="#000" />
          </div>
          <span className={styles.logoText}>A8X Admin</span>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin');
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <main className={styles.main}>
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="btn btn-secondary d-md-none" 
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ padding: '8px' }}
            >
              <Menu size={24} />
            </button>
            <h1 className={styles.headerTitle}>Admin Panel</h1>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
