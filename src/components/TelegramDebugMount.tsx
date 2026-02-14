'use client';

import { useEffect, useState } from 'react';
import { TelegramDebugOverlay } from './TelegramDebugOverlay';

export function TelegramDebugMount() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isDev = process.env.NODE_ENV !== 'production';
    const hasDebug = typeof window !== 'undefined' && window.location.search.includes('debug=1');
    setShow(isDev || hasDebug);
  }, []);

  if (!show) return null;
  return <TelegramDebugOverlay />;
}
