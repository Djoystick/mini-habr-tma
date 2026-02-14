'use client';

import dynamic from 'next/dynamic';

// Content uses @tma.js/sdk-react (window). Load only on client to avoid prerender "window is not defined".
const LaunchParamsContent = dynamic(() => import('./LaunchParamsContent'), {
  ssr: false,
  loading: () => <div style={{ padding: 16 }}>Loading…</div>,
});

export default function LaunchParamsPageClient() {
  return <LaunchParamsContent />;
}
