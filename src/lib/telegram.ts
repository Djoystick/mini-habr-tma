// lib/telegram.ts
export type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
};

export function getTelegramWebApp(): { initData?: string; initDataUnsafe?: { user?: TelegramUser } } | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { Telegram?: { WebApp?: { initData?: string; initDataUnsafe?: { user?: TelegramUser } } } }).Telegram?.WebApp ?? null;
}

export function getTelegramUserSafe(): TelegramUser | null {
  const tg = getTelegramWebApp();
  if (!tg) return null;
  const user = tg.initDataUnsafe?.user;
  if (!user?.id) return null;
  return user;
}

export function getInitDataSafe(): string | null {
  const tg = getTelegramWebApp();
  if (!tg) return null;
  const initData = tg.initData;
  return initData && initData.length > 0 ? initData : null;
}
