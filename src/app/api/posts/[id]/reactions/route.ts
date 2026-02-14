// app/api/posts/[id]/reactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUserFromInitData } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

type ReactionBody = {
  reactionType: 'like' | 'fire' | 'bookmark';
};

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const postId = Number(id);
  if (!postId) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  let currentUserId: string;

  try {
    const currentUser = await getCurrentUserFromInitData(req);
    currentUserId = currentUser.id;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as ReactionBody;

  if (!body.reactionType) {
    return NextResponse.json({ error: 'reactionType required' }, { status: 400 });
  }

  // Простая логика "переключателя": если реакция уже есть - удаляем, иначе создаём
  const { data: existing, error: selectError } = await supabaseAdmin
    .from('reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', currentUserId)
    .eq('reaction_type', body.reactionType)
    .maybeSingle();

  if (selectError) {
    console.error(selectError);
    return NextResponse.json({ error: 'Failed to load reaction' }, { status: 500 });
  }

  if (existing) {
    const { error: deleteError } = await supabaseAdmin
      .from('reactions')
      .delete()
      .eq('id', existing.id);

    if (deleteError) {
      console.error(deleteError);
      return NextResponse.json({ error: 'Failed to remove reaction' }, { status: 500 });
    }

    return NextResponse.json({ status: 'removed' });
  }

  const { error: insertError } = await supabaseAdmin.from('reactions').insert({
    post_id: postId,
    user_id: currentUserId,
    reaction_type: body.reactionType,
  });

  if (insertError) {
    console.error(insertError);
    return NextResponse.json({ error: 'Failed to add reaction' }, { status: 500 });
  }

  return NextResponse.json({ status: 'added' });
}
