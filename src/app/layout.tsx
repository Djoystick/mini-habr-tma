// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import { TelegramDebugMountWrapper } from '@/components/TelegramDebugMountWrapper';

export const metadata = {
  title: 'MiniHabr — Telegram Mini App',
  description: 'Простейший Habr-подобный Telegram Mini App',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        {children}
        <TelegramDebugMountWrapper />
      </body>
    </html>
  );
}
