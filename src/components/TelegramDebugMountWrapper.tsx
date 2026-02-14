'use client';

import dynamic from 'next/dynamic';

const TelegramDebugMount = dynamic(
  () => import('./TelegramDebugMount').then((m) => ({ default: m.TelegramDebugMount })),
  { ssr: false }
);

export function TelegramDebugMountWrapper() {
  return <TelegramDebugMount />;
}
