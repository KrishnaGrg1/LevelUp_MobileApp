// stores/auth.store.ts
import { User } from '@/api/generated';
import { setIntentionalLogout } from '@/providers/SocketProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user?: User;
  authSession: string | undefined;
  isAdmin: boolean;
  setUser: (user: User) => void;
  setAdminStatus: (isAdmin: boolean) => void;
  setAuthSession: (authSession?: string | null) => void;
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
      setAuthSession: (authSession?: string | null) => {
        set(state => ({
          authSession: authSession ?? state.authSession,
          // Never flip the user back to unauthenticated just because
          // the session string is momentarily missing. Use existing
          // auth flag unless we have a new, truthy session value.
          isAuthenticated: state.isAuthenticated || !!authSession,
        }));
      },
      setAdminStatus: (isAdmin: boolean) => set({ isAdmin }),
      logout: () => {
        // Signal intentional logout so socket can disconnect properly
        setIntentionalLogout(true);
        set({
          user: undefined,
          isAuthenticated: false,
          isAdmin: false,
          authSession: undefined,
        });
        // Reset flag after cleanup completes
        setTimeout(() => setIntentionalLogout(false), 100);
      },
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

// Hook to subscribe to username changes
// Returns username or undefined, ensuring stable reference
export function useUsername(): string | undefined {
  return authStore(state => state.user?.UserName);
}

export default authStore;


export function useUser(): User | undefined {
  // Use useShallow to combine both selectors
  const { user, hasHydrated } = authStore(
    useShallow(state => ({
      user: state.user,
      hasHydrated: state._hasHydrated,
    })),
  );

  // Always return a language - no conditional returns
  // If not hydrated or no language, use default
  if (!hasHydrated || !user) {
    return undefined;
  }

  return user;
}
