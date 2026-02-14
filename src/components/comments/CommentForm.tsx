'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (content: string) => void;
  disabled?: boolean;
};

export function CommentForm({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ваш комментарий..."
        rows={3}
        disabled={disabled}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Отправить
      </button>
    </form>
  );
}
