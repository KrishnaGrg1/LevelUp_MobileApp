import { Box } from '@/components/ui/box';
import { ScrollView } from '@/components/ui/scroll-view';
import React from 'react';

import LogOutButton from '@/components/LogOutButton';
import authStore from '@/stores/auth.store';
import { useTranslation } from '@/translation';
import { router } from 'expo-router';
import { Edit, Settings } from 'lucide-react-native';

// Import new components
import {
  AccountInfoCard,
  MenuItemsList,
  ProfileHeader,
  ProgressCard,
  StatsCards,
  type MenuItem,
} from '../../../../components/profile';

function ProfilePage() {
  // Hooks
  const { t } = useTranslation();
  const user = authStore(state => state.user);
  const isAdmin = authStore(state => state.isAdmin);

  // Calculated values
  const completedChallenges = user?.Quest?.filter(x => x.isCompleted).length || 0;

  const formatDate = (dateInput: Date | string | undefined) => {
    if (!dateInput) return 'Unknown';
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return date.toLocaleDateString();
  };

  // User stats
  const userStats = {
    level: user?.level || 1,
    profilePicture: user?.profilePicture,
    xp: user?.xp || 0,
    xpToNextLevel: 1000,
    completedChallenges: completedChallenges,
    joinedDate: formatDate(user?.createdAt),
    rank: 125,
    badges: 8,
  };

  // Menu items data
  const menuItems: MenuItem[] = [
    {
      id: 1,
      icon: Edit,
      label: t('profile.editProfile'),
      onPress: () => router.push('/(main)/(tabs)/profile/editProfile'),
    },
    {
      id: 2,
      icon: Settings,
      label: t('profile.settings'),
      onPress: () => router.push('/(main)/(tabs)/profile/Setting'),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background-0">
      {/* Header Section */}
      <ProfileHeader
        username={user?.UserName || 'User'}
        email={user?.email || 'user@example.com'}
        profilePicture={userStats.profilePicture}
        level={userStats.level}
        isAdmin={isAdmin}
      />

      {/* Stats Section */}
      <Box className="bg-primary-500 px-6">
        <StatsCards
          completedChallenges={userStats.completedChallenges}
          rank={userStats.rank}
          badges={userStats.badges}
        />
      </Box>

      {/* Content Section */}
      <Box className="px-6 py-6">
        {/* Progress Card */}
        <ProgressCard
          currentXP={userStats.xp}
          xpToNextLevel={userStats.xpToNextLevel}
          currentLevel={userStats.level}
        />

        {/* Menu Items */}
        <MenuItemsList menuItems={menuItems} />

        {/* Logout Button */}
        <LogOutButton />

        {/* Account Info */}
        <AccountInfoCard
          email={user?.email || 'user@example.com'}
          joinedDate={userStats.joinedDate}
        />
      </Box>
    </ScrollView>
  );
}

export default ProfilePage;
