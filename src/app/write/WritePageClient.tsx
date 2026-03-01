'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useProfile } from '@/components/profile/ProfileContext';
import { getInitDataSafe } from '@/lib/telegram';

type FormState = {
  title: string;
  branch: string;
  subtitle: string;
  content: string;
};

const INITIAL_STATE: FormState = {
  title: '',
  branch: 'Общее',
  subtitle: '',
  content: '',
};

export default function WritePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const { profile, loading } = useProfile();
  const canWrite = profile?.role === 'admin' || profile?.role === 'moderator';

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const contentLength = useMemo(() => form.content.trim().length, [form.content]);

  useEffect(() => {
    const loadPostForEdit = async () => {
      if (!editId) return;

      const res = await fetch(`/api/posts/${editId}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage('Не удалось загрузить публикацию для редактирования.');
        return;
      }

      setForm({
        title: data.title ?? '',
        branch: data.branch ?? 'Общее',
        subtitle: data.subtitle ?? '',
        content: data.content ?? '',
      });
    };

    void loadPostForEdit();
  }, [editId]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canWrite || saving) return;

    const initData = getInitDataSafe();

    if (!initData) {
      setMessage('Не удалось получить Telegram initData.');
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const targetUrl = editId ? `/api/posts/${editId}` : '/api/posts';
      const res = await fetch(targetUrl, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-init-data': initData,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error ?? (editId ? 'Не удалось обновить новость.' : 'Не удалось создать новость.'));
        return;
      }

      setMessage(editId ? 'Публикация обновлена.' : 'Новость опубликована.');
      setForm(INITIAL_STATE);
      router.push(`/post/${editId ?? data.id}`);
    } catch {
      setMessage('Сетевая ошибка при публикации.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{editId ? 'Редактирование новости' : 'Создание новости'}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Редактор и администратор могут публиковать новости. Редактор управляет только своими публикациями.
        </p>

        {loading && <div className="mt-6 text-sm text-slate-500">Проверяем права…</div>}

        {!loading && !canWrite && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Доступ запрещён. Нужна роль admin или editor.
          </div>
        )}

        {!loading && canWrite && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Заголовок</span>
              <input
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-emerald-400"
                placeholder="Например: Telegram представил обновление Mini Apps"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Ветка</span>
                <input
                  value={form.branch}
                  onChange={(e) => handleChange('branch', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-emerald-400"
                  placeholder="Технологии"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Подзаголовок</span>
                <input
                  value={form.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-emerald-400"
                  placeholder="Короткое описание"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Текст новости</span>
              <textarea
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="min-h-[220px] w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-0 focus:border-emerald-400"
                placeholder="Полный текст публикации..."
                required
              />
              <span className="text-xs text-slate-500">Символов: {contentLength}</span>
            </label>

            {message && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {message}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (editId ? 'Сохраняем…' : 'Публикуем…') : (editId ? 'Сохранить изменения' : 'Опубликовать')}
              </button>

              <button
                type="button"
                onClick={() => router.push('/my-posts')}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Мои новости
              </button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}