# Hooks Usage Guide

## Authentication Hooks

### `useAuthUser()`

**Purpose**: Fetch and sync authenticated user data with the auth store.

**When to use**:

- In screen components that need fresh user data from the API
- When you need to ensure user data is up-to-date

**When NOT to use**:

- In layout components (causes hooks order violations)
- When you only need to check authentication status
- When you only need cached user data from the store

**Example**:

```tsx
import { useAuthUser } from '@/hooks/useAuthUser';
import { ActivityIndicator, View } from 'react-native';

export default function ProfileScreen() {
  const { user, isLoading, error } = useAuthUser();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error loading user</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user?.name}</Text>
    </View>
  );
}
```

### `useGetMe()`

**Purpose**: Low-level hook for fetching user data via React Query.

**When to use**:

- When you need fine-grained control over the query
- When building custom authentication logic

**When NOT to use**:

- In most cases, prefer `useAuthUser()` instead
- In layout components before QueryProvider is ready

---

## Best Practices

### ✅ DO:

1. **Use hooks in screen components** (after QueryProvider is ready)

   ```tsx
   // app/(main)/(tabs)/profile.tsx
   export default function ProfileScreen() {
     const { user } = useAuthUser();
     // ... rest of component
   }
   ```

2. **Access cached user data from store** when fresh data isn't needed

   ```tsx
   import authStore from '@/stores/auth.store';

   const user = authStore(state => state.user);
   ```

3. **Keep layouts simple** - only handle authentication checks
   ```tsx
   export default function MainLayout() {
     const isAuthenticated = authStore(state => state.isAuthenticated);
     // Just check auth, don't fetch data
   }
   ```

### ❌ DON'T:

1. **Don't call React Query hooks in layouts**

   ```tsx
   // ❌ BAD - Will cause "Cannot read property 'length'" error
   export default function MainLayout() {
     const { data } = useGetMe(); // DON'T DO THIS
   }
   ```

2. **Don't conditionally call hooks**

   ```tsx
   // ❌ BAD - Violates Rules of Hooks
   if (isAuthenticated) {
     const { data } = useGetMe(); // DON'T DO THIS
   }
   ```

3. **Don't nest hooks inside callbacks**
   ```tsx
   // ❌ BAD
   useEffect(() => {
     const { data } = useGetMe(); // DON'T DO THIS
   }, []);
   ```

---

## Architecture

```
┌─────────────────────────────────────┐
│  app/_layout.tsx                    │
│  - ThemeProvider                    │
│  - QueryProviders ← React Query     │
│  - Stack                            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  app/(main)/_layout.tsx             │
│  - Authentication checks only       │
│  - No data fetching                 │
│  - Redirects if not authenticated   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  app/(main)/(tabs)/screen.tsx       │
│  - useAuthUser() ← Fetch user       │
│  - Render UI with user data         │
└─────────────────────────────────────┘
```

This architecture ensures:

- ✅ React Query context is ready before hooks are called
- ✅ No Rules of Hooks violations
- ✅ Clear separation of concerns
- ✅ Predictable data flow
