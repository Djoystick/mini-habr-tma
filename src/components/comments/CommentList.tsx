'use client';

type Comment = {
  id: number;
  content: string;
  author: string;
  createdAt: string;
};

type Props = {
  comments: Comment[];
};

export function CommentList({ comments }: Props) {
  if (comments.length === 0) return <p>Комментариев пока нет.</p>;
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {comments.map((c) => (
        <li key={c.id} style={{ marginBottom: 8, padding: 8, background: '#f3f4f6', borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{c.author} • {c.createdAt}</div>
          <div>{c.content}</div>
        </li>
      ))}
    </ul>
  );
}
