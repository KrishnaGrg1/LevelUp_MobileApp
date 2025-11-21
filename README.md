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
- **State Management**: Zustand (Coming Soon) - Lightweight global state management
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query) - Powerful data synchronization
- **Routing**: [Expo Router v6](https://docs.expo.dev/router) - File-based routing
- **Animations**: React Native Reanimated ~4.1.0

## ✨ Features

- 📱 Cross-platform (iOS, Android, Web)
- 🎨 Modern UI with Gluestack UI components
- 🎯 Type-safe development with TypeScript
- 🔄 Efficient data fetching and caching with TanStack Query
- 💾 Global state management with Zustand
- 🎭 Smooth animations with Reanimated
- 📐 Tailwind CSS styling via NativeWind
- 🧭 File-based navigation with Expo Router

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
│   ├── (tabs)/            # Tab-based navigation
│   ├── _layout.tsx        # Root layout with providers
│   └── global.css         # Global Tailwind styles
├── components/            # Reusable components
│   ├── providers/         # Context providers
│   │   └── react-query.tsx # TanStack Query configuration
│   └── ui/                # UI components (Gluestack UI)
├── constants/             # App constants and theme
├── hooks/                 # Custom React hooks
├── assets/                # Images, fonts, and other assets
└── scripts/               # Build and utility scripts
```

## 💾 State Management

This project uses **Zustand** for global state management:

- **Lightweight**: Minimal boilerplate
- **TypeScript-friendly**: Full type safety
- **DevTools**: Redux DevTools integration
- **Middleware**: Persist, immer support

Example usage:

```typescript
// stores/useUserStore.ts
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## 🔄 Data Fetching

**TanStack Query** is configured for efficient data fetching:

- **Location**: `components/providers/react-query.tsx`
- **Configuration**:
  - Stale time: 60 seconds
  - Retry: 1 attempt
  - SSR-compatible setup

Example usage:

```typescript
import { useQuery } from '@tanstack/react-query';

function UserProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  // Component logic
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
  </Box>
  ```

## 📜 Scripts

```bash
pnpm start          # Start Expo development server
pnpm android        # Run on Android emulator
pnpm ios            # Run on iOS simulator
pnpm web            # Run in web browser
pnpm lint           # Run ESLint
pnpm reset-project  # Reset to clean project structure
```

## 🔧 Development

### File-Based Routing

This project uses Expo Router for navigation. Create new screens by adding files to the `app/` directory:

```
app/
├── index.tsx              # Home screen (/)
├── profile.tsx            # Profile screen (/profile)
└── (tabs)/
    ├── _layout.tsx        # Tab layout
    ├── index.tsx          # First tab
    └── explore.tsx        # Second tab
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
