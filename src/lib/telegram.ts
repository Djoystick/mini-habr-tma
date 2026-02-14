// lib/telegram.ts
export type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
};

export function getTelegramUserSafe(): TelegramUser | null {
  if (typeof window === 'undefined') return null;

  const anyWindow = window as typeof window & {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: { user?: TelegramUser };
      };
    };
  };
  const tg = anyWindow.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  if (!user?.id) return null;

  return user;
}

export function getInitDataSafe(): string | null {
  if (typeof window === 'undefined') return null;

  const anyWindow = window as typeof window & {
    Telegram?: {
      WebApp?: {
        initData?: string;
      };
    };
  };

  const initData = anyWindow.Telegram?.WebApp?.initData;

  return initData && initData.length > 0 ? initData : null;
}
