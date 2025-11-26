import React from "react";
import { RefreshControl } from "react-native";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import authStore from "@/stores/auth.store";
import { useTranslation } from "@/translation";
import { router } from "expo-router";
import {
  Award,
  Calendar,
  ChevronRight,
  Crown,
  Edit,
  LogOut,
  Mail,
  Settings,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react-native";

function ProfilePage() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);
  const user = authStore((state) => state.user);
  const isAdmin = authStore((state) => state.isAdmin);
  const logout = authStore((state) => state.logout);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch user profile data
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  // Mock data - replace with real API data
  const userStats = {
    level: user?.level || 1,
    xp: user?.xp || 0,
    xpToNextLevel: 1000,
    totalChallenges: 24,
    completedChallenges: 12,
    streak: 7,
    joinedDate: "Jan 2025",
    rank: 125,
    badges: 8,
  };

  const achievements = [
    {
      id: 1,
      name: "Early Adopter",
      description: "Joined during beta",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      earned: true,
    },
    {
      id: 2,
      name: "Week Warrior",
      description: "7-day streak",
      icon: Trophy,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      earned: true,
    },
    {
      id: 3,
      name: "Quick Learner",
      description: "Completed 10 lessons",
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      earned: true,
    },
    {
      id: 4,
      name: "Challenge Master",
      description: "Complete 50 challenges",
      icon: Target,
      color: "text-gray-400",
      bgColor: "bg-gray-50",
      earned: false,
    },
  ];

  const menuItems = [
    {
      id: 1,
      icon: Edit,
      label: t("profile.editProfile", "Edit Profile"),
      onPress: () => console.log("Edit profile - Coming soon"),
    },
    {
      id: 2,
      icon: Settings,
      label: t("profile.settings", "Settings"),
      onPress: () => router.push("/"),
    },
    {
      id: 3,
      icon: Trophy,
      label: t("profile.achievements", "Achievements"),
      onPress: () => console.log("Achievements - Coming soon"),
    },
    {
      id: 4,
      icon: Award,
      label: t("profile.badges", "Badges"),
      onPress: () => console.log("Badges - Coming soon"),
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background-0"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with Profile Info */}
      <Box className="bg-primary-500 px-6 pb-8 pt-12">
        <VStack className="items-center">
          {/* Avatar */}
          <Box className="relative">
            <Avatar size="2xl" className="border-4 border-white">
              <AvatarFallbackText className="text-white">
                {user?.UserName || "User"}
              </AvatarFallbackText>
            </Avatar>
            {isAdmin && (
              <Box className="absolute -right-2 -top-2 h-10 w-10 items-center justify-center rounded-full bg-yellow-500 border-4 border-primary-500">
                <Icon as={Crown} size="sm" className="text-white" />
              </Box>
            )}
          </Box>

          {/* User Info */}
          <Heading size="2xl" className="mt-4 text-white">
            {user?.UserName || "User"}
          </Heading>
          <Text className="mt-1 text-typography-300">
            {user?.email || "user@example.com"}
          </Text>

          {/* Level Badge */}
          <Badge
            size="lg"
            variant="solid"
            className="mt-3 border-0 bg-white dark:bg-background-900"
          >
            <Icon as={TrendingUp} size="sm" className="text-primary-500" />
            <BadgeText className="ml-1 text-typography-900">
              {t("profile.level", "Level")} {userStats.level}
            </BadgeText>
          </Badge>

          {/* Stats */}
          <HStack className="mt-6 w-full" space="md">
            <Card className="flex-1 border-0 bg-white dark:bg-background-900 items-center p-3 shadow-sm">
              <Text className="text-2xl font-bold text-typography-900">
                {userStats.completedChallenges}
              </Text>
              <Text className="mt-1 text-xs text-typography-500">
                {t("profile.challenges", "Challenges")}
              </Text>
            </Card>
            <Card className="flex-1 border-0 bg-white dark:bg-background-900 items-center p-3 shadow-sm">
              <Text className="text-2xl font-bold text-typography-900">
                #{userStats.rank}
              </Text>
              <Text className="mt-1 text-xs text-typography-500">
                {t("profile.rank", "Rank")}
              </Text>
            </Card>
            <Card className="flex-1 border-0 bg-white dark:bg-background-900 items-center p-3 shadow-sm">
              <Text className="text-2xl font-bold text-typography-900">
                {userStats.badges}
              </Text>
              <Text className="mt-1 text-xs text-typography-500">
                {t("profile.badges", "Badges")}
              </Text>
            </Card>
          </HStack>
        </VStack>
      </Box>

      <Box className="px-6 py-6">
        {/* Progress Card */}
        <Card className="mb-6 border-0 bg-white dark:bg-background-900 p-4 shadow-sm">
          <HStack className="items-center justify-between">
            <VStack className="flex-1">
              <Text className="text-sm font-medium text-typography-500">
                {t("profile.nextLevel", "Next Level")}
              </Text>
              <Text className="mt-1 text-lg font-bold text-typography-900">
                {userStats.xp} / {userStats.xpToNextLevel} XP
              </Text>
            </VStack>
            <Box className="h-16 w-16 items-center justify-center rounded-full bg-primary-500">
              <Text className="text-2xl font-bold text-white">
                {userStats.level + 1}
              </Text>
            </Box>
          </HStack>
          <Box className="mt-3 h-2 overflow-hidden rounded-full bg-background-100">
            <Box
              className="h-full bg-primary-500"
              style={{
                width: `${(userStats.xp / userStats.xpToNextLevel) * 100}%`,
              }}
            />
          </Box>
        </Card>

        {/* Achievements */}
        <VStack space="md" className="mb-6">
          <HStack className="items-center justify-between">
            <Heading size="lg" className="text-typography-900">
              {t("profile.achievements", "Achievements")}
            </Heading>
            <Pressable>
              <Text className="text-sm font-medium text-typography-900">
                {t("profile.viewAll", "View All")}
              </Text>
            </Pressable>
          </HStack>
          <HStack space="md" className="flex-wrap">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`w-[48%] mb-3 border ${
                  achievement.earned
                    ? "border-outline-100"
                    : "border-outline-50"
                } p-4 ${!achievement.earned && "opacity-50"}`}
              >
                <Box
                  className={`h-12 w-12 items-center justify-center rounded-full ${achievement.bgColor}`}
                >
                  <Icon
                    as={achievement.icon}
                    size="lg"
                    className={achievement.color}
                  />
                </Box>
                <Text className="mt-3 font-semibold text-typography-900">
                  {achievement.name}
                </Text>
                <Text className="mt-1 text-xs text-typography-500">
                  {achievement.description}
                </Text>
              </Card>
            ))}
          </HStack>
        </VStack>

        {/* Menu Items */}
        <VStack space="sm" className="mb-6">
          {menuItems.map((item) => (
            <Pressable key={item.id} onPress={item.onPress}>
              <Card className="border-0 bg-white dark:bg-background-900 p-4 shadow-sm">
                <HStack className="items-center justify-between">
                  <HStack className="items-center" space="md">
                    <Box className="h-10 w-10 items-center justify-center rounded-full bg-background-100">
                      <Icon
                        as={item.icon}
                        size="md"
                        className="text-typography-900"
                      />
                    </Box>
                    <Text className="font-medium text-typography-900">
                      {item.label}
                    </Text>
                  </HStack>
                  <Icon
                    as={ChevronRight}
                    size="md"
                    className="text-typography-500"
                  />
                </HStack>
              </Card>
            </Pressable>
          ))}
        </VStack>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="border-red-500"
          onPress={handleLogout}
        >
          <Icon as={LogOut} size="sm" className="text-red-500" />
          <ButtonText className="ml-2 text-red-500">
            {t("profile.logout", "Logout")}
          </ButtonText>
        </Button>

        {/* Account Info */}
        <Card className="mt-6 border-0 bg-white dark:bg-background-900 p-4 shadow-sm">
          <Text className="text-sm font-medium text-typography-500">
            {t("profile.accountInfo", "Account Information")}
          </Text>
          <VStack className="mt-3" space="sm">
            <HStack className="items-center" space="sm">
              <Icon as={Mail} size="sm" className="text-typography-500" />
              <Text className="text-sm text-typography-900">
                {user?.email || "user@example.com"}
              </Text>
            </HStack>
            <HStack className="items-center" space="sm">
              <Icon as={Calendar} size="sm" className="text-typography-500" />
              <Text className="text-sm text-typography-900">
                {t("profile.joined", "Joined")} {userStats.joinedDate}
              </Text>
            </HStack>
          </VStack>
        </Card>
      </Box>
    </ScrollView>
  );
}

export default React.memo(ProfilePage);
