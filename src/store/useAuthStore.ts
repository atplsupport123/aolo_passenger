import { create } from 'zustand';
import { UserProfile } from '../types';
import { localSignOut, localDeleteAccount } from '../utils/localAuth';

interface AuthState {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  setIsAuthenticated: (val: boolean) => void;
  setUserProfile: (profile: UserProfile | null | ((prev: UserProfile | null) => UserProfile | null)) => void;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userProfile: null,
  setIsAuthenticated: (val: boolean) => set({ isAuthenticated: val }),
  setUserProfile: (updater) =>
    set((state) => ({
      userProfile: typeof updater === 'function' ? updater(state.userProfile) : updater,
    })),
  logout: () => {
    localSignOut().catch(() => {});
    set({ isAuthenticated: false, userProfile: null });
  },
  deleteAccount: async () => {
    await localDeleteAccount().catch(() => {});
    set({ isAuthenticated: false, userProfile: null });
  },
}));


