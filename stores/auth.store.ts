// stores/auth.store.ts
import { User } from '@/api/generated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user?: User;
  authSession: string | undefined;
  isAdmin: boolean;
  setUser: (user: User) => void;
  setAdminStatus: (isAdmin: boolean) => void;
  setAuthSession: (authSession: string) => void;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const authStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
      authSession: undefined,
      user: undefined,
      isAdmin: false,
      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.isAdmin === true,
        });
      },
      setAuthSession: (authSession: string) => {
        set({ authSession, isAuthenticated: !!authSession });
      },
      setAdminStatus: (isAdmin: boolean) => set({ isAdmin }),
      logout: () =>
        set({
          user: undefined,
          isAuthenticated: false,
          isAdmin: false,
          authSession: undefined,
        }),
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default authStore;
