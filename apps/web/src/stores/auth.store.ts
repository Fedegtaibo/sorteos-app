import { create } from 'zustand';

interface AuthStore {
  user: { id: string; email: string; role: string } | null;
  setUser: (user: AuthStore['user']) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
