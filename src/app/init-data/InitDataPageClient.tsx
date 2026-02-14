'use client';

import dynamic from 'next/dynamic';

// InitDataClient uses @tma.js/sdk-react which accesses window at runtime.
// ssr: false is only allowed in Client Components; loading here avoids "window is not defined" during prerender/SSR.
const InitDataClient = dynamic(() => import('./InitDataClient'), {
  ssr: false,
  loading: () => <div style={{ padding: 16 }}>Loading…</div>,
});

export default function InitDataPageClient() {
  return <InitDataClient />;
}
