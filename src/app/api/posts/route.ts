// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type PostListProfile = {
  first_name: string | null;
  username: string | null;
};

type PostListCountRow = {
  count: number;
};

type PostListRow = {
  id: number;
  title: string;
  subtitle: string | null;
  content: string;
  created_at: string;
  profiles: PostListProfile[] | PostListProfile | null;
  comments: PostListCountRow[] | null;
  reactions: PostListCountRow[] | null;
};

export async function GET(_req: NextRequest) {
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
      ),
      comments:comments(count),
      reactions:reactions(count)
    `,
    )
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }

  const rows = data as PostListRow[];

  const formatted = rows.map((post) => {
    const profile = Array.isArray(post.profiles)
      ? post.profiles[0]
      : post.profiles;

    const commentsCount = Array.isArray(post.comments)
      ? post.comments[0]?.count ?? 0
      : 0;

    const reactionsCount = Array.isArray(post.reactions)
      ? post.reactions[0]?.count ?? 0
      : 0;

    return {
      id: post.id,
      title: post.title,
      subtitle: post.subtitle,
      content: post.content,
      createdAt: post.created_at,
      author: profile?.first_name || profile?.username || 'Неизвестный автор',
      commentsCount,
      reactionsCount,
    };
  });

  return NextResponse.json(formatted);
}
    