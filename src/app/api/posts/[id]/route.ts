// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface Params {
  params: Promise<{ id: string }>;
}

type PostAuthorProfile = {
  first_name: string | null;
  username: string | null;
};

type PostWithAuthor = {
  id: number;
  title: string;
  subtitle: string | null;
  content: string;
  created_at: string;
  profiles: PostAuthorProfile[] | PostAuthorProfile | null;
};

export async function GET(_req: NextRequest, { params }: Params) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!id) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('posts')
    .select(
      `
      id,
      title,
      subtitle,
      content,
      created_at,
      profiles (
        first_name,
        username
      )
    `,
    )
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(error);
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const typedData = data as PostWithAuthor;

  const profile = Array.isArray(typedData.profiles)
    ? typedData.profiles[0]
    : typedData.profiles;

  const author =
    profile?.first_name || profile?.username || 'Неизвестный автор';

  return NextResponse.json({
    id: typedData.id,
    title: typedData.title,
    subtitle: typedData.subtitle,
    content: typedData.content,
    createdAt: typedData.created_at,
    author,
  });
}
