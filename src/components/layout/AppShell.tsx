// components/layout/AppShell.tsx
'use client';

import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.main}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
