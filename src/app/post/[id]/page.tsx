// app/post/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { CommentList } from '@/components/comments/CommentList';
import { CommentForm } from '@/components/comments/CommentForm';
import { ReactionBar } from '@/components/reactions/ReactionBar';
import { useProfile } from '@/components/profile/ProfileContext';
import { getInitDataSafe } from '@/lib/telegram';

type Post = {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  author: string;
  createdAt: string;
};

type Comment = {
  id: number;
  content: string;
  author: string;
  createdAt: string;
};

interface PostPageProps {
  params: { id: string };
}

export default function PostPage({ params }: PostPageProps) {
  const postId = Number(params.id);
  const { profile, loading: profileLoading } = useProfile();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [postRes, commentsRes] = await Promise.all([
        fetch(`/api/posts/${postId}`),
        fetch(`/api/posts/${postId}/comments`),
      ]);

      const postData = await postRes.json();
      const commentsData = await commentsRes.json();

      setPost(postData);
      setComments(commentsData);
      setLoading(false);
    };
    void load();
  }, [postId]);

  const handleSubmitComment = async (content: string) => {
    if (!profile) return;

    const initData = getInitDataSafe();
    if (!initData) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (res.ok) {
      setComments((prev) => [...prev, data]);
    } else {
      console.error(data.error);
    }
  };

  const handleToggleReaction = async (reactionType: 'like' | 'fire' | 'bookmark') => {
    if (!profile) return;

    const initData = getInitDataSafe();
    if (!initData) return;

    const res = await fetch(`/api/posts/${postId}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
      body: JSON.stringify({ reactionType }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(data.error);
    } else {
      console.log('Reaction status:', data.status);
    }
  };

  return (
    <AppShell>
      {loading && <div>Загружаем пост…</div>}
      {!loading && !post && <div>Пост не найден</div>}
      {!loading && post && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1>{post.title}</h1>
          {post.subtitle && <p style={{ color: '#6b7280' }}>{post.subtitle}</p>}
          <div style={{ fontSize: 13, color: '#6b7280' }}>
            {post.author} •{' '}
            {new Date(post.createdAt).toLocaleDateString('ru-RU')}
          </div>
          <p>{post.content}</p>

          <ReactionBar onToggle={handleToggleReaction} />

          <h2>Комментарии</h2>
          <CommentList comments={comments} />
          <CommentForm
            onSubmit={handleSubmitComment}
            disabled={profileLoading || !profile}
          />
          {!profile && !profileLoading && (
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              Не удалось получить данные пользователя Telegram — комментарии отключены.
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
