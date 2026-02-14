// components/profile/ProfileContext.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getInitDataSafe, getTelegramUserSafe } from '@/lib/telegram';
import type { Database } from '@/types/database';

type Role = Database['public']['Enums']['user_role'];

type Profile = {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  role: Role;
};

type ProfileContextValue = {
  profile: Profile | null;
  loading: boolean;
};

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  loading: true,
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProfileContextValue>({
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const tgUser = getTelegramUserSafe();
    const initData = getInitDataSafe();

    if (!tgUser || !initData) {
      setState({ profile: null, loading: false });
      return;
    }

    const syncProfile = async () => {
      try {
        const res = await fetch('/api/profile/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-telegram-init-data': initData,
          },
          body: JSON.stringify({
            initData,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);
          setState({ profile: null, loading: false });
          return;
        }

        setState({
          profile: {
            id: data.id,
            telegramId: data.telegramId,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            photoUrl: data.photoUrl,
            role: data.role,
          },
          loading: false,
        });
      } catch (e) {
        console.error(e);
        setState({ profile: null, loading: false });
      }
    };

    void syncProfile();
  }, []);

  return <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  return useContext(ProfileContext);
}
