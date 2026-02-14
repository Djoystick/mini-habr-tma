// app/api/profile/sync/route.ts
import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { Database } from '@/types/database';

type SyncProfileBody = {
  initData: string;
};

type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
};

function getTelegramSecretKey(botToken: string) {
  return createHmac('sha256', 'WebAppData').update(botToken).digest();
}

function validateInitData(initData: string, botToken: string): TelegramUser | null {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');

  if (!hash) {
    return null;
  }

  params.delete('hash');

  const dataCheckString = Array.from(params.entries())
    .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = getTelegramSecretKey(botToken);
  const computedHash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computedHash !== hash) {
    return null;
  }

  const userRaw = params.get('user');

  if (!userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as TelegramUser;
    if (!user.id) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SyncProfileBody;

  if (!body.initData) {
    return NextResponse.json({ error: 'initData is required' }, { status: 400 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN is not configured');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const user = validateInitData(body.initData, botToken);

  if (!user) {
    return NextResponse.json({ error: 'Invalid initData' }, { status: 401 });
  }

  const { id: telegramId, username, first_name, last_name, photo_url } = user;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .upsert(
      {
        telegram_id: telegramId,
        username,
        first_name,
        last_name,
        photo_url,
      },
      { onConflict: 'telegram_id' },
    )
    .select('*')
    .single();

  if (error || !data) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to sync profile' }, { status: 500 });
  }

  const profile = data as Database['public']['Tables']['profiles']['Row'];
  return NextResponse.json({
    id: profile.id,
    telegramId: profile.telegram_id,
    username: profile.username,
    firstName: profile.first_name,
    lastName: profile.last_name,
    photoUrl: profile.photo_url,
    role: profile.role ?? 'user',
  });
}
