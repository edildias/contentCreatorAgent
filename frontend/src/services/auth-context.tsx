import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { User } from '@/types/user';
import { api } from './api';

interface AuthState {
  user: User | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null });

  useEffect(() => {
    const token = window.localStorage.getItem('topvoice.token');
    const userRaw = window.localStorage.getItem('topvoice.user');
    if (token && userRaw) {
      setState({ token, user: JSON.parse(userRaw) });
    }
  }, []);

  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common.Authorization = `Bearer ${state.token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [state.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      login: async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        setState({ user: data.user, token: data.token });
        window.localStorage.setItem('topvoice.token', data.token);
        window.localStorage.setItem('topvoice.user', JSON.stringify(data.user));
      },
      logout: () => {
        setState({ user: null, token: null });
        window.localStorage.removeItem('topvoice.token');
        window.localStorage.removeItem('topvoice.user');
      }
    }),
    [state.token, state.user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
