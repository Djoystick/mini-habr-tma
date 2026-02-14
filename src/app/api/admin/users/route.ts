// src/app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUserFromInitData } from '@/lib/auth';
import type { Database } from '@/types/database';

type UpdateRoleBody = {
  targetProfileId: string;
  newRole: Database['public']['Enums']['user_role'];
};

/**
 * GET — список всех пользователей
 * Доступно только admin
 */
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromInitData(req);

    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, telegram_id, username, first_name, last_name, role')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error(error);
      return NextResponse.json(
        { error: 'FAILED_TO_LOAD_USERS' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      data.map((u) => ({
        id: u.id,
        telegramId: u.telegram_id,
        username: u.username,
        firstName: u.first_name,
        lastName: u.last_name,
        role: u.role,
      })),
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
}

/**
 * POST — изменение роли пользователя
 * Только admin
 */
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromInitData(req);

    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
    }

    const body = (await req.json()) as UpdateRoleBody;

    if (!body.targetProfileId || !body.newRole) {
      return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role: body.newRole })
      .eq('id', body.targetProfileId);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'FAILED_TO_UPDATE_ROLE' },
        { status: 500 },
      );
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
}
