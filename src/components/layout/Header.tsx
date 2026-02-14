// components/layout/Header.tsx
'use client';

import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>MiniHabr</div>
      <nav className={styles.nav}>
        <button className={styles.navItem}>Лента</button>
        <button className={styles.navItem}>Хабы</button>
        <button className={styles.navItem}>Компаниям</button>
      </nav>
    </header>
  );
}
