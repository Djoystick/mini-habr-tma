// src/app/page.tsx
'use client';

export default function Home() {
  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">MiniHabr</h1>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Как мы запустили Telegram Mini App за вечер
        </h2>
        <p className="text-gray-500 text-sm mb-4">@Team • сегодня</p>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>💬 3</span>
          <span>👍 12</span>
        </div>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Supabase как заменитель собственного бэкенда
        </h2>
        <p className="text-gray-500 text-sm mb-4">@Dev • вчера</p>
        <div className="flex gap-4 text-sm text-gray-400">
          <span>💬 5</span>
          <span>👍 20</span>
        </div>
      </div>
    </div>
  );
}