// components/posts/PostCard.tsx
'use client';

import Link from 'next/link';
import styles from './PostCard.module.css';

export interface PostCardProps {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  createdAt: string;
  commentsCount: number;
  reactionsCount: number;
}

export function PostCard(props: PostCardProps) {
  const { id, title, subtitle, author, createdAt, commentsCount, reactionsCount } = props;

  return (
    <article className={styles.card}>
      <Link href={`/post/${id}`} className={styles.title}>
        {title}
      </Link>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      <div className={styles.meta}>
        <span>{author}</span>
        <span>•</span>
        <span>{createdAt}</span>
      </div>
      <div className={styles.footer}>
        <span>💬 {commentsCount}</span>
        <span>👍 {reactionsCount}</span>
      </div>
    </article>
  );
}
