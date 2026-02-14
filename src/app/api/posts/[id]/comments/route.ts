// app/api/posts/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUserFromInitData } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

type CreateCommentBody = {
  content: string;
};

type CommentAuthorProfile = {
  first_name: string | null;
  username: string | null;
};

type CommentWithAuthor = {
  id: number;
  content: string;
  created_at: string;
  profiles: CommentAuthorProfile[] | CommentAuthorProfile | null;
};

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const postId = Number(id);
  if (!postId) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('comments')
    .select(
      `
      id,
      content,
      created_at,
      profiles (
        first_name,
        username
      )
    `,
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
  }

  const rows = data as CommentWithAuthor[];

  const formatted = rows.map((c) => {
    const profile = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;

    return {
      id: c.id,
      content: c.content,
      createdAt: c.created_at,
      author: profile?.first_name || profile?.username || 'Аноним',
    };
  });

  return NextResponse.json(formatted);
}

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

  const body = (await req.json()) as CreateCommentBody;

  if (!body.content?.trim()) {
    return NextResponse.json({ error: 'content required' }, { status: 400 });
  }

  const { data: inserted, error } = await supabaseAdmin
    .from('comments')
    .insert({
      post_id: postId,
      author_id: currentUserId,
      content: body.content.trim(),
    })
    .select(
      `
      id,
      content,
      created_at,
      profiles (
        first_name,
        username
      )
    `,
    )
    .single();

  if (error || !inserted) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }

  const typedInserted = inserted as CommentWithAuthor;

  const profile = Array.isArray(typedInserted.profiles)
    ? typedInserted.profiles[0]
    : typedInserted.profiles;

  return NextResponse.json({
    id: typedInserted.id,
    content: typedInserted.content,
    createdAt: typedInserted.created_at,
    author: profile?.first_name || profile?.username || 'Аноним',
  });
}
