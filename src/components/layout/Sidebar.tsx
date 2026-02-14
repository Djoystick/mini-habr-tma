// components/layout/Sidebar.tsx
'use client';

import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.block}>
        <div className={styles.blockTitle}>Популярное</div>
        <ul className={styles.list}>
          <li>Сегодня</li>
          <li>Неделя</li>
          <li>Месяц</li>
        </ul>
      </div>
      <div className={styles.block}>
        <div className={styles.blockTitle}>Теги</div>
        <div className={styles.tags}>
          <span>#javascript</span>
          <span>#backend</span>
          <span>#telegram</span>
        </div>
      </div>
    </aside>
  );
}
