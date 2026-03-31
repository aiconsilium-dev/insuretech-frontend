import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

// localStorage에서 초기값 복원
const stored = localStorage.getItem('auth-storage');
const initial = stored ? (JSON.parse(stored) as { state?: { accessToken?: string } }) : null;

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: initial?.state?.accessToken ?? null,
  setAccessToken: (token: string) => {
    set({ accessToken: token });
    localStorage.setItem('auth-storage', JSON.stringify({ state: { accessToken: token } }));
  },
  logout: () => {
    set({ accessToken: null });
    localStorage.removeItem('auth-storage');
  },
}));
