'use client';

import dynamic from 'next/dynamic';

// Content uses @tma.js/sdk-react and TON Connect (window). Load only on client to avoid prerender "window is not defined".
const TONConnectContent = dynamic(() => import('./TONConnectContent'), {
  ssr: false,
  loading: () => <div style={{ padding: 16 }}>Loading…</div>,
});

export default function TONConnectPageClient() {
  return <TONConnectContent />;
}
