'use client';

import { useEffect } from 'react';
import { useRawInitData } from '@tma.js/sdk-react';

export const dynamic = 'force-dynamic'; // Отключает prerender на сервере, фиксит "window is not defined" [web:9]

export default function InitDataPage() {
  const rawInitData = useRawInitData();

  useEffect(() => {
    if (rawInitData) {
      // Сохраняем initData для использования в app (localStorage или context)
      localStorage.setItem('tgWebAppData', rawInitData);
      console.log('Init data saved:', rawInitData);
      
      // Опционально: редирект на главную после инициализации
      // window.location.href = '/';
    }
  }, [rawInitData]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Инициализация Telegram Mini App</h1>
      <p>Init data: {rawInitData ? 'Загружено' : 'Загрузка...'}</p>
      {rawInitData && (
        <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>
          {rawInitData.slice(0, 100)}...
        </p>
      )}
    </div>
  );
}
