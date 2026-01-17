import { useTranslation } from '@/translation';
import { Tabs } from 'expo-router';
import { BookOpen, Home, Trophy, User } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { useColorScheme } from 'react-native';

// Memoize the entire component to prevent re-renders from parent
function TabLayoutInner() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  // Memoize all dynamic values to prevent creating new objects
  const isDark = colorScheme === 'dark';

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: '#3b82f6',
      tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
      tabBarStyle: {
        backgroundColor: isDark ? '#000000' : '#ffffff',
        borderTopColor: isDark ? '#1f2937' : '#e5e7eb',
      },
      tabBarLabelStyle: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
      },
    }),
    [isDark],
  );

  // Memoize tab screen options
  const dashboardOptions = useMemo(
    () => ({
      title: t('tabs.home', 'Home'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Home color={color} size={size} />
      ),
    }),
    [t],
  );

  const learnOptions = useMemo(
    () => ({
      title: t('tabs.learn', 'Learn'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <BookOpen color={color} size={size} />
      ),
    }),
    [t],
  );

  const challengesOptions = useMemo(
    () => ({
      title: t('tabs.challenges', 'Challenges'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Trophy color={color} size={size} />
      ),
    }),
    [t],
  );

  const profileOptions = useMemo(
    () => ({
      title: t('tabs.profile', 'Profile'),
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <User color={color} size={size} />
      ),
    }),
    [t],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="dashboard" options={dashboardOptions} />
      <Tabs.Screen name="quests" options={learnOptions} />
      <Tabs.Screen name="ai-chat" options={challengesOptions} />
      <Tabs.Screen name="leaderboard" options={profileOptions} />
      <Tabs.Screen name="profile" options={profileOptions} />
    </Tabs>
  );
}

// Export without memo to allow proper remounting
export default TabLayoutInner;
