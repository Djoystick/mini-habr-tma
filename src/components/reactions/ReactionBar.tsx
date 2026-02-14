'use client';

type Props = {
  onToggle: (reactionType: 'like' | 'fire' | 'bookmark') => void;
};

export function ReactionBar({ onToggle }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <button type="button" onClick={() => onToggle('like')} aria-label="Нравится">
        👍
      </button>
      <button type="button" onClick={() => onToggle('fire')} aria-label="Огонь">
        🔥
      </button>
      <button type="button" onClick={() => onToggle('bookmark')} aria-label="В закладки">
        🔖
      </button>
    </div>
  );
}
