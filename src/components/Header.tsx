'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './header.module.css';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>A8X<span>.STORE</span></Link>
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>Home</Link>
        <Link href="/sales" className={`${styles.navLink} ${pathname === '/sales' ? styles.active : ''}`}>Sales</Link>
        <Link href="/proof" className={`${styles.navLink} ${pathname === '/proof' ? styles.active : ''}`}>Proof</Link>
      </nav>
    </header>
  );
}
