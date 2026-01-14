# LevelUp Mobile App 🚀

A modern mobile application built with Expo, React Native, and a powerful tech stack for seamless performance and user experience.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [Data Fetching](#data-fetching)
- [UI Components](#ui-components)
- [Scripts](#scripts)
- [Development](#development)
- [Learn More](#learn-more)

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0.25
- **Language**: TypeScript ~5.9.2
- **UI Library**: [Gluestack UI v3](https://gluestack.io/ui) - Modern, accessible component library
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight global state management
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query) - Powerful data synchronization
- **Routing**: [Expo Router v6](https://docs.expo.dev/router) - File-based routing
- **Animations**: React Native Reanimated ~4.1.0
- **Form Validation**: Zod + React Hook Form
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Internationalization**: Custom i18n with 7 languages (EN, AR, CN, FR, JP, NP, ES)

## ✨ Features

- 📱 Cross-platform (iOS, Android, Web)
- 🎨 Modern UI with Gluestack UI components
- 🎯 Type-safe development with TypeScript
- 🔄 Efficient data fetching and caching with TanStack Query
- 💾 Global state management with Zustand
- 🎭 Smooth animations with Reanimated
- 📐 Tailwind CSS styling via NativeWind
- 🧭 File-based navigation with Expo Router
- 🔐 Complete authentication system (Login, Register, Email Verification, Password Reset)
- 🌍 Multi-language support (English, Arabic, Chinese, French, Japanese, Nepali, Spanish)
- 🎮 AI-powered quest system with time tracking
- 🌓 Dark/Light theme support
- ✅ Form validation with Zod schemas

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (recommended) or npm
- **iOS**: Xcode (for iOS development on macOS)
- **Android**: Android Studio (for Android development)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KrishnaGrg1/LevelUp_MobileApp.git
   cd LevelUpMobileApp
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

   Or using npm:

   ```bash
   npm install
   ```

## 🎯 Getting Started

1. **Start the development server**

   ```bash
   pnpm start
   ```

   Or using npm:

   ```bash
   npm start
   ```

2. **Run on different platforms**

   In the terminal output, you'll find options to:
   - Press `i` - Open in iOS simulator
   - Press `a` - Open in Android emulator
   - Press `w` - Open in web browser
   - Scan QR code with Expo Go app on your physical device

## 📁 Project Structure

```
LevelUpMobileApp/
├── app/                    # App screens and navigation (Expo Router)
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── verifyEmail.tsx
│   │   ├── forgetPassword.tsx
│   │   └── resetPassword.tsx
│   ├── (main)/            # Main app screens (after auth)
│   │   ├── dashboard.tsx
│   │   ├── learn.tsx
│   │   ├── challenges.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Entry point
├── api/                   # API configuration and endpoints
│   ├── client.ts          # Axios instance
│   ├── generated.ts       # Generated API types
│   ├── endPoints/         # API endpoint modules
│   └── types/             # API type definitions
├── components/            # Reusable components
│   ├── auth/              # Auth-related components
│   ├── ui/                # UI components (Gluestack UI)
│   ├── LanguageSwitcher.tsx
│   └── ModeToggle.tsx
├── providers/             # Context providers
│   ├── QueryProvider.tsx  # TanStack Query setup
│   └── ThemeProvider.tsx  # Theme management
├── hooks/                 # Custom React hooks
│   └── useAuth.ts
├── stores/                # Zustand stores
│   ├── auth.store.ts
│   ├── language.store.ts
│   ├── theme.store.ts
│   └── pagination.store.ts
├── translation/           # Internationalization
│   ├── index.ts           # Translation utilities with t() function
│   ├── eng/               # English translations
│   ├── arab/              # Arabic translations
│   ├── chin/              # Chinese translations
│   ├── fr/                # French translations
│   ├── jap/               # Japanese translations
│   ├── nep/               # Nepali translations
│   └── span/              # Spanish translations
├── schemas/               # Zod validation schemas
│   ├── auth/              # Auth form schemas
│   └── quest/             # Quest schemas
├── styles/                # Theme configuration
└── assets/                # Images, fonts, and other assets
```

## 🌍 Internationalization (i18n)

The app supports 7 languages with a custom translation system:

- 🇬🇧 English (eng)
- 🇸🇦 Arabic (arab) - RTL support
- 🇨🇳 Chinese (chin)
- 🇫🇷 French (fr)
- 🇯🇵 Japanese (jap)
- 🇳🇵 Nepali (nep)
- 🇪🇸 Spanish (span)

### Translation System

The `t()` function supports:

- **Dot notation**: `t('auth.login.title')`
- **Namespace format**: `t('auth:login.title')`
- **Parameter replacement**: `t('quests.landing.minRequired', { minutes: 30 })` → "30 min required"
- **Fallback values**: `t('missing.key', 'Default text')`

### Usage Examples

```typescript
import { t } from "@/translation";

// Simple translation
const title = t("auth.login.title"); // "Login"

// With parameters
const message = t("quests.landing.minRemaining", { minutes: 15 }); // "15 min remaining"

// In React components (reactive)
import { useTranslation } from "@/translation";

function MyComponent() {
  const { t, language } = useTranslation();
  return <Text>{t("common.welcome")}</Text>;
}
```

### Adding Translations

1. Create/edit JSON file in language folder: `translation/eng/feature.json`
2. Add translations with placeholders: `{"message": "Hello {name}"}`
3. Import in language index: `import feature from './feature.json'`
4. Export in language object: `const eng = { ..., feature }`

## 💾 State Management

This project uses **Zustand** for global state management:

- **Lightweight**: Minimal boilerplate
- **TypeScript-friendly**: Full type safety
- **Persist**: localStorage/AsyncStorage integration

### Implemented Stores

```typescript
// stores/auth.store.ts - Authentication state
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(persist(...));

// stores/language.store.ts - Language preference
// stores/theme.store.ts - Dark/Light theme
// stores/pagination.store.ts - Pagination state
```

## 🔄 Data Fetching

**TanStack Query** is configured for efficient data fetching:

- **Location**: `providers/QueryProvider.tsx`
- **Configuration**:
  - Stale time: 5 minutes
  - Cache time: 10 minutes
  - Automatic refetching on window focus
  - Retry on failure

### API Integration

```typescript
// api/client.ts - Axios instance with interceptors
import axiosInstance from "@/api/client";

// api/endPoints/auth.service.ts - Authentication endpoints
export const authService = {
  login: (data: LoginData) => axiosInstance.post("/auth/login", data),
  register: (data: RegisterData) => axiosInstance.post("/auth/register", data),
  // ... more endpoints
};

// Usage in components with React Query
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/api/endPoints/auth.service";

function LoginForm() {
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Handle success
    },
  });

  return (
    <Button onPress={() => loginMutation.mutate({ email, password })}>
      <ButtonText>Login</ButtonText>
    </Button>
  );
}
```

## 🎨 UI Components

**Gluestack UI v3** provides accessible, customizable components:

- **Add components**:

  ```bash
  pnpm dlx gluestack-ui@latest add <component-name>
  ```

- **Example**: Add button, box, and text components

  ```bash
  pnpm dlx gluestack-ui@latest add button box text
  ```

- **Usage**:

  ```tsx
  import { Box, Button, Text } from '@/components/ui';

  <Box className="p-4">
    <Text>Hello World</Text>
    <Button onPress={() => {}}>
      <ButtonText>Click me</ButtonText>
    </Button>
  </Box>;
  ```

## 📜 Scripts

```bash
pnpm start          # Start Expo development server
pnpm android        # Run on Android emulator
pnpm ios            # Run on iOS simulator
pnpm web            # Run in web browser
pnpm lint           # Run ESLint
pnpm install        # Install dependencies
```

## 🔧 Development

### Authentication Flow

The app includes a complete authentication system:

1. **Login** → JWT token stored in Zustand + AsyncStorage
2. **Register** → Auto-navigate to email verification
3. **Email Verification** → OTP code validation
4. **Password Reset** → Email → OTP → New password
5. **Auto-logout** on token expiration

### File-Based Routing

This project uses Expo Router for navigation:

```
app/
├── index.tsx              # Entry screen (/)
├── (auth)/                # Auth group (no layout)
│   ├── login.tsx         # /login
│   ├── register.tsx      # /registerdark:bg-gray-900 p-4">
  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
    Hello World
  </Text>
</View>
```

### Form Validation

Use Zod schemas with React Hook Form:

```typescript
// schemas/auth/login.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// In component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { control, handleSubmit } = useForm({
  resolver: zodResolver(loginSchema),
});in)/               # Protected routes (requires auth)
    ├── _layout.tsx       # Tab navigation layout
    ├── dashboard.tsx     # /dashboard
    └── ...
```

### Protected Routes

Use `useAuth` hook to protect routes:

```typescript
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";

export default function ProtectedScreen() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <View>...</View>;
}
```

### Styling with NativeWind

Use Tailwind CSS classes directly in your components:

```tsx
<View className="flex-1 items-center justify-center bg-white p-4">
  <Text className="text-2xl font-bold text-gray-900">Hello World</Text>
</View>
```

### TypeScript Configuration

Full TypeScript support with strict mode enabled. Types are automatically generated for:

- Expo Router routes
- NativeWind classes
- Gluestack UI components

## 📚 Learn More

### Official Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [Gluestack UI](https://gluestack.io/ui/docs/home/overview/introduction)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Native](https://reactnative.dev/)

### Community

- [Expo GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)
- [React Native Community](https://github.com/react-native-community)

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For contributions, please contact the repository owner.

---

Made with ❤️ by [KrishnaGrg1](https://github.com/KrishnaGrg1)
