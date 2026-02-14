// src/lib/server/auth.ts

import 'server-only';
import { createHmac } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Database } from '@/types/database';

/**
 * Роли системы. Совпадает с enum user_role в Supabase.
 */
export type UserRole = Database['public']['Enums']['user_role'];

/**
 * Объект Telegram user из initData
 */
type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
};

/**
 * Объект, который возвращает helper
 */
export type AuthenticatedUser = {
  id: string; // UUID профиля (profiles.id)
  telegramId: number;
  role: UserRole;
};

/**
 * Генерация секретного ключа Telegram
 */
function getTelegramSecretKey(botToken: string): Buffer {
  return createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
}

/**
 * Валидация initData по официальной схеме Telegram
 */
function validateInitData(
  initData: string,
  botToken: string
): TelegramUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');

  if (!hash) return null;

  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = getTelegramSecretKey(botToken);

  const computedHash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computedHash !== hash) return null;

  const userRaw = params.get('user');
  if (!userRaw) return null;

  try {
    const user = JSON.parse(userRaw) as TelegramUser;
    if (!user.id) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Основной helper:
 * 1. Валидирует initData
 * 2. Загружает профиль из БД
 * 3. Возвращает identity + role
 */
async function getCurrentUserFromInitDataString(
  initData: string,
): Promise<AuthenticatedUser> {
  if (!initData) {
    throw new Error('Unauthorized');
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    throw new Error('Unauthorized');
  }

  const telegramUser = validateInitData(initData, botToken);

  if (!telegramUser) {
    throw new Error('Unauthorized');
  }

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('id, telegram_id, role')
    .eq('telegram_id', telegramUser.id)
    .single();

  if (error || !profile) {
    throw new Error('Unauthorized');
  }

  return {
    id: profile.id,
    telegramId: profile.telegram_id,
    role: profile.role,
  };
}

/**
 * Основной server helper:
 * 1. Читает заголовок x-telegram-init-data
 * 2. Валидирует initData
 * 3. Загружает профиль из БД
 * 4. Возвращает identity + role
 */
export async function getCurrentUserFromInitData(
  request: Request,
): Promise<AuthenticatedUser> {
  const initData = request.headers.get('x-telegram-init-data');

  if (!initData) {
    throw new Error('Unauthorized');
  }

  return getCurrentUserFromInitDataString(initData);
}
