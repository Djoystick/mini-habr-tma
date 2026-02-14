// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useProfile } from '@/components/profile/ProfileContext';
import { UserTable } from '@/components/admin/UserTable';
import { getInitDataSafe } from '@/lib/telegram';
import type { Database } from '@/types/database';

type Role = Database['public']['Enums']['user_role'];

type User = {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  role: Role;
};

export default function AdminPage() {
  const { profile, loading } = useProfile();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!profile || profile.role !== 'admin') {
        setLoadingUsers(false);
        return;
      }

      const initData = getInitDataSafe();
      if (!initData) {
        setLoadingUsers(false);
        return;
      }

      const res = await fetch('/api/admin/users', {
        headers: {
          'x-telegram-init-data': initData,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.error);
        setLoadingUsers(false);
        return;
      }
      setUsers(data);
      setLoadingUsers(false);
    };
    void load();
  }, [profile]);

  const handleChangeRole = async (userId: string, newRole: Role) => {
    if (!profile || profile.role !== 'admin') return;

    const initData = getInitDataSafe();
    if (!initData) return;

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-init-data': initData,
      },
      body: JSON.stringify({
        targetProfileId: userId,
        newRole,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error(data.error);
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
  };

  return (
    <AppShell>
      <h1>Админ-панель</h1>

      {loading && <div>Определяем вашу роль…</div>}

      {!loading && (!profile || profile.role !== 'admin') && (
        <div>Доступ запрещён. Нужна роль admin.</div>
      )}

      {!loading && profile?.role === 'admin' && (
        <>
          {loadingUsers && <div>Загружаем пользователей…</div>}
          {!loadingUsers && (
            <UserTable
              users={users}
              currentUserRole={profile.role}
              onChangeRole={handleChangeRole}
            />
          )}
        </>
      )}
    </AppShell>
  );
}
