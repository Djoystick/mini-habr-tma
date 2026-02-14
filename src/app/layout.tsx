// app/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'
import Script from 'next/script'
import { TelegramDebugMountWrapper } from '@/components/TelegramDebugMountWrapper'

export const metadata = {
  title: 'MiniHabr — Telegram Mini App',
  description: 'Простейший Habr-подобный Telegram Mini App',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {children}
        <TelegramDebugMountWrapper />
      </body>
    </html>
  )
}
