import React from "react";
import { RefreshControl } from "react-native";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import authStore from "@/stores/auth.store";
import { useTranslation } from "@/translation";
import { router } from "expo-router";
import {
  BookOpen,
  Crown,
  Flag,
  Target,
  Trophy,
  Zap,
} from "lucide-react-native";

function DashboardPage() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);
  const user = authStore((state) => state.user);
  const isAdmin = authStore((state) => state.isAdmin);
  const logout = authStore((state) => state.logout);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch user data and stats
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
    rank: 125,
  };

  const progressPercentage =
    (userStats.xp / userStats.xpToNextLevel) * 100 || 0;

  const recentAchievements = [
    { id: 1, name: "First Steps", icon: Trophy, color: "text-yellow-500" },
    { id: 2, name: "Week Warrior", icon: Target, color: "text-blue-500" },
    { id: 3, name: "Quick Learner", icon: Zap, color: "text-purple-500" },
  ];

  const activeChallenges = [
    {
      id: 1,
      title: "Complete 5 Coding Challenges",
      progress: 3,
      total: 5,
      xpReward: 500,
    },
    {
      id: 2,
      title: "Maintain 7-Day Streak",
      progress: 7,
      total: 7,
      xpReward: 1000,
    },
    {
      id: 3,
      title: "Read 3 Articles",
      progress: 1,
      total: 3,
      xpReward: 300,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background-0"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <Box className="bg-primary-500 px-6 pb-6 pt-12">
        <HStack className="items-center justify-between mb-4">
          <VStack>
            <Text className="text-sm text-white/70">
              {t("dashboard.welcome", "Welcome back")}
            </Text>
            <Heading size="xl" className="text-white">
              {user?.UserName || "User"}
            </Heading>
          </VStack>
          {isAdmin && (
            <Box className="h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
              <Icon as={Crown} size="sm" className="text-white" />
            </Box>
          )}
        </HStack>

        {/* Level Progress */}
        <Card className="border-0 bg-white/10 backdrop-blur-lg p-4">
          <HStack className="items-center justify-between mb-2">
            <Text className="text-sm text-white/80">
              {t("dashboard.level", "Level")} {userStats.level}
            </Text>
            <Text className="text-xs text-white/60">
              {userStats.xp} / {userStats.xpToNextLevel} XP
            </Text>
          </HStack>
          <Box className="h-2 overflow-hidden rounded-full bg-white/20">
            <Box
              className="h-full bg-white"
              style={{ width: `${progressPercentage}%` }}
            />
          </Box>
        </Card>
      </Box>

      <Box className="px-6 py-6">
        {/* Stats Grid */}
        <HStack space="sm" className="mb-6">
          <Card className="flex-1 border-0 bg-white dark:bg-background-900 p-3">
            <Icon as={Target} size="md" className="text-blue-500" />
            <Text className="mt-2 text-xl font-bold text-typography-900">
              {userStats.completedChallenges}/{userStats.totalChallenges}
            </Text>
            <Text className="text-xs text-typography-400">
              {t("dashboard.challenges", "Challenges")}
            </Text>
          </Card>
          <Card className="flex-1 border-0 bg-white dark:bg-background-900 p-3">
            <Icon as={Zap} size="md" className="text-orange-500" />
            <Text className="mt-2 text-xl font-bold text-typography-900">
              {userStats.streak}
            </Text>
            <Text className="text-xs text-typography-400">
              {t("dashboard.dayStreak", "Streak")}
            </Text>
          </Card>
          <Card className="flex-1 border-0 bg-white dark:bg-background-900 p-3">
            <Icon as={Trophy} size="md" className="text-yellow-500" />
            <Text className="mt-2 text-xl font-bold text-typography-900">
              #{userStats.rank}
            </Text>
            <Text className="text-xs text-typography-400">
              {t("dashboard.globalRank", "Rank")}
            </Text>
          </Card>
        </HStack>

        {/* Active Challenges */}
        <VStack space="sm" className="mb-6">
          <Text className="text-base font-semibold text-typography-900">
            {t("dashboard.activeChallenges", "Active Challenges")}
          </Text>
          {activeChallenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="border-0 bg-white dark:bg-background-900 p-3"
            >
              <HStack className="items-center justify-between mb-2">
                <Text className="flex-1 text-sm font-medium text-typography-900">
                  {challenge.title}
                </Text>
                <HStack className="items-center" space="xs">
                  <Icon as={Zap} size="xs" className="text-orange-500" />
                  <Text className="text-sm font-semibold text-typography-900">
                    {challenge.xpReward}
                  </Text>
                </HStack>
              </HStack>
              <Box className="h-1.5 overflow-hidden rounded-full bg-background-100">
                <Box
                  className="h-full bg-primary-500"
                  style={{
                    width: `${(challenge.progress / challenge.total) * 100}%`,
                  }}
                />
              </Box>
              <Text className="mt-1 text-xs text-typography-400">
                {challenge.progress}/{challenge.total}{" "}
                {t("dashboard.completed", "completed")}
              </Text>
            </Card>
          ))}
        </VStack>

        {/* Quick Actions */}
        <HStack space="sm">
          <Button
            variant="outline"
            className="flex-1 border-primary-500"
            onPress={() => console.log("Challenges - Coming soon")}
          >
            <Icon as={Flag} size="sm" className="text-primary-500" />
            <ButtonText className="ml-2 text-primary-500">
              {t("dashboard.browseChallenges", "Challenges")}
            </ButtonText>
          </Button>
          <Button
            className="flex-1 bg-primary-500"
            onPress={() => console.log("Learn - Coming soon")}
          >
            <Icon as={BookOpen} size="sm" className="text-white" />
            <ButtonText className="ml-2">
              {t("dashboard.learn", "Learn")}
            </ButtonText>
          </Button>
        </HStack>
      </Box>
    </ScrollView>
  );
}

export default React.memo(DashboardPage);
