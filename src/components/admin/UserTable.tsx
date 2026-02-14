'use client';

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

type Props = {
  users: User[];
  currentUserRole: Role;
  onChangeRole: (userId: string, newRole: Role) => void;
};

export function UserTable({ users, currentUserRole, onChangeRole: _onChangeRole }: Props) {
  return (
    <div>
      {users.length === 0 && <p>Нет пользователей</p>}
      {users.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>ID</th>
              <th style={{ textAlign: 'left' }}>Username</th>
              <th style={{ textAlign: 'left' }}>Имя</th>
              <th style={{ textAlign: 'left' }}>Роль</th>
              {currentUserRole === 'admin' && <th style={{ textAlign: 'left' }}>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id.slice(0, 8)}…</td>
                <td>{u.username ?? '—'}</td>
                <td>{u.firstName ?? u.lastName ?? '—'}</td>
                <td>{u.role}</td>
                {currentUserRole === 'admin' && (
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => _onChangeRole(u.id, e.target.value as Role)}
                    >
                      <option value="user">user</option>
                      <option value="moderator">moderator</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
