'use client';

import { useCallback, useEffect, useState } from 'react';
import { getTelegramWebApp, getInitDataSafe } from '@/lib/telegram';

type LogEntry = { id: number; type: 'error' | 'rejection'; message: string; stack?: string };

export function TelegramDebugOverlay() {
  const [open, setOpen] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [info, setInfo] = useState<{ initData: boolean; platform: string; colorScheme: string; viewportHeight: number } | null>(null);
  const idRef = { current: 0 };

  useEffect(() => {
    const tg = getTelegramWebApp();
    const initData = getInitDataSafe();
    setInfo({
      initData: Boolean(initData && initData.length > 0),
      platform: typeof navigator !== 'undefined' ? (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? '—' : '—',
      colorScheme: typeof window !== 'undefined' ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : '—',
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
  }, []);

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      setLogs((prev) => [...prev, { id: ++idRef.current, type: 'error', message: e.message ?? String(e), stack: e.error?.stack }]);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg = e.reason?.message ?? String(e.reason);
      setLogs((prev) => [...prev, { id: ++idRef.current, type: 'rejection', message: msg, stack: e.reason?.stack }]);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 8,
          right: 8,
          zIndex: 9998,
          padding: '4px 8px',
          fontSize: 10,
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
        }}
      >
        Debug
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '40vh',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        color: '#e0e0e0',
        fontSize: 11,
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid #444',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderBottom: '1px solid #444' }}>
        <span>Telegram Debug</span>
        <div>
          <button type="button" onClick={clearLogs} style={{ marginRight: 8, padding: '2px 6px', fontSize: 10 }}>Clear</button>
          <button type="button" onClick={() => setOpen(false)} style={{ padding: '2px 6px', fontSize: 10 }}>Close</button>
        </div>
      </div>
      {info && (
        <div style={{ padding: '6px 8px', borderBottom: '1px solid #333' }}>
          initData: {info.initData ? 'yes' : 'no'} | platform: {info.platform} | colorScheme: {info.colorScheme} | viewportHeight: {info.viewportHeight}
        </div>
      )}
      <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
        {logs.length === 0 && <div style={{ color: '#888' }}>No errors yet.</div>}
        {logs.map((l) => (
          <div key={l.id} style={{ marginBottom: 6, color: l.type === 'rejection' ? '#f88' : '#f66' }}>
            [{l.type}] {l.message}
            {l.stack && <pre style={{ margin: '2px 0 0 0', fontSize: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{l.stack}</pre>}
          </div>
        ))}
      </div>
    </div>
  );
}
