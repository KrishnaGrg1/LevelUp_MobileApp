import React from "react";
import { RefreshControl } from "react-native";

import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useTranslation } from "@/translation";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react-native";

function ChallengesPage() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"active" | "completed">(
    "active"
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch challenges
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Mock data - replace with real API data
  const stats = {
    totalChallenges: 24,
    completed: 12,
    streak: 7,
    totalXP: 5420,
  };

  const challenges = [
    {
      id: 1,
      title: "Complete 5 Coding Problems",
      description: "Solve 5 algorithm challenges",
      difficulty: "Medium",
      difficultyColor: "bg-orange-500",
      category: "Coding",
      xpReward: 500,
      participants: 1234,
      timeLeft: "2 days",
      progress: 3,
      total: 5,
      isActive: true,
    },
    {
      id: 2,
      title: "30-Day Learning Streak",
      description: "Learn something new every day",
      difficulty: "Hard",
      difficultyColor: "bg-red-500",
      category: "Habit",
      xpReward: 1500,
      participants: 856,
      timeLeft: "23 days",
      progress: 7,
      total: 30,
      isActive: true,
    },
    {
      id: 3,
      title: "Master React Hooks",
      description: "Complete all React Hooks lessons",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      category: "Learning",
      xpReward: 300,
      participants: 2341,
      timeLeft: "5 days",
      progress: 8,
      total: 10,
      isActive: true,
    },
    {
      id: 4,
      title: "First Challenge Complete",
      description: "Complete your first challenge",
      difficulty: "Easy",
      difficultyColor: "bg-green-500",
      category: "Achievement",
      xpReward: 100,
      participants: 5432,
      completedDate: "Nov 20, 2025",
      progress: 1,
      total: 1,
      isActive: false,
    },
  ];

  const activeChallenges = challenges.filter((c) => c.isActive);
  const completedChallenges = challenges.filter((c) => !c.isActive);

  return (
    <ScrollView
      className="flex-1 bg-background-0"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <Box className="bg-primary-500 px-6 pb-8 pt-12">
        <Heading size="3xl" className="text-white">
          {t("challenges.title", "Challenges")}
        </Heading>
        <Text className="mt-2 text-primary-100">
          {t("challenges.subtitle", "Test your skills")}
        </Text>

        {/* Stats Cards */}
        <HStack className="mt-6" space="md">
          <Card className="flex-1 border-0 bg-white dark:bg-background-900 p-3 shadow-sm">
            <Icon as={Trophy} size="md" className="text-yellow-500" />
            <Text className="mt-2 text-xl font-bold text-typography-900">
              {stats.completed}/{stats.totalChallenges}
            </Text>
            <Text className="text-xs text-typography-500">
              {t("challenges.completed", "Completed")}
            </Text>
          </Card>
          <Card className="flex-1 border-0 bg-white dark:bg-background-900 p-3 shadow-sm">
            <Icon as={Flame} size="md" className="text-orange-500" />
            <Text className="mt-2 text-xl font-bold text-typography-900">
              {stats.streak}
            </Text>
            <Text className="text-xs text-typography-500">
              {t("challenges.dayStreak", "Day Streak")}
            </Text>
          </Card>
          <Card className="flex-1 border-0 bg-white dark:bg-background-900 p-3 shadow-sm">
            <Icon as={Zap} size="md" className="text-purple-500" />
            <Text className="mt-2 text-xl font-bold text-typography-900">
              {stats.totalXP}
            </Text>
            <Text className="text-xs text-typography-500">
              {t("challenges.totalXP", "Total XP")}
            </Text>
          </Card>
        </HStack>
      </Box>

      <Box className="px-6 py-6">
        {/* Tabs */}
        <HStack className="mb-6" space="md">
          <Pressable
            className={`flex-1 rounded-lg border py-3 ${
              activeTab === "active"
                ? "border-typography-900 bg-typography-900"
                : "border-outline-200 bg-transparent"
            }`}
            onPress={() => setActiveTab("active")}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "active" ? "text-white" : "text-typography-900"
              }`}
            >
              {t("challenges.active", "Active")} ({activeChallenges.length})
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 rounded-lg border py-3 ${
              activeTab === "completed"
                ? "border-typography-900 bg-typography-900"
                : "border-outline-200 bg-transparent"
            }`}
            onPress={() => setActiveTab("completed")}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "completed" ? "text-white" : "text-typography-900"
              }`}
            >
              {t("challenges.completed", "Completed")} (
              {completedChallenges.length})
            </Text>
          </Pressable>
        </HStack>

        {/* Challenges List */}
        <VStack space="md">
          {(activeTab === "active"
            ? activeChallenges
            : completedChallenges
          ).map((challenge) => (
            <Pressable key={challenge.id}>
              <Card className="border-0 bg-white dark:bg-background-900 p-4 shadow-sm">
                {/* Header */}
                <HStack className="items-start justify-between">
                  <VStack className="flex-1">
                    <HStack className="items-center" space="sm">
                      <Badge
                        size="sm"
                        variant="solid"
                        className={`${challenge.difficultyColor} border-0`}
                      >
                        <BadgeText>{challenge.difficulty}</BadgeText>
                      </Badge>
                      <Badge
                        size="sm"
                        variant="outline"
                        className="border-outline-300"
                      >
                        <BadgeText className="text-typography-900">
                          {challenge.category}
                        </BadgeText>
                      </Badge>
                    </HStack>
                    <Text className="mt-2 text-lg font-semibold text-typography-900">
                      {challenge.title}
                    </Text>
                    <Text className="mt-1 text-sm text-typography-500">
                      {challenge.description}
                    </Text>
                  </VStack>
                  {challenge.isActive ? (
                    <Box className="h-12 w-12 items-center justify-center rounded-full bg-background-100">
                      <Icon
                        as={TrendingUp}
                        size="lg"
                        className="text-blue-500"
                      />
                    </Box>
                  ) : (
                    <Box className="h-12 w-12 items-center justify-center rounded-full bg-green-500">
                      <Icon
                        as={CheckCircle2}
                        size="lg"
                        className="text-white"
                      />
                    </Box>
                  )}
                </HStack>

                {/* Progress */}
                <Box className="mt-4">
                  <HStack className="mb-2 items-center justify-between">
                    <Text className="text-sm text-typography-500">
                      {t("challenges.progress", "Progress")}
                    </Text>
                    <Text className="text-sm font-semibold text-typography-900">
                      {challenge.progress}/{challenge.total}
                    </Text>
                  </HStack>
                  <Box className="h-2 overflow-hidden rounded-full bg-background-100">
                    <Box
                      className={`h-full ${
                        challenge.isActive ? "bg-primary-500" : "bg-green-500"
                      }`}
                      style={{
                        width: `${
                          (challenge.progress / challenge.total) * 100
                        }%`,
                      }}
                    />
                  </Box>
                </Box>

                {/* Footer */}
                <HStack className="mt-4 items-center justify-between">
                  <HStack space="md">
                    <HStack className="items-center" space="xs">
                      <Icon as={Zap} size="sm" className="text-orange-500" />
                      <Text className="text-sm font-bold text-typography-900">
                        {challenge.xpReward} XP
                      </Text>
                    </HStack>
                    <HStack className="items-center" space="xs">
                      <Icon
                        as={Users}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text className="text-sm text-typography-500">
                        {challenge.participants}
                      </Text>
                    </HStack>
                  </HStack>
                  {challenge.isActive ? (
                    <HStack className="items-center" space="xs">
                      <Icon as={Clock} size="sm" className="text-red-500" />
                      <Text className="text-sm font-medium text-red-500">
                        {challenge.timeLeft}
                      </Text>
                    </HStack>
                  ) : (
                    <HStack className="items-center" space="xs">
                      <Icon
                        as={Calendar}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text className="text-sm text-typography-500">
                        {challenge.completedDate}
                      </Text>
                    </HStack>
                  )}
                </HStack>
              </Card>
            </Pressable>
          ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}

export default React.memo(ChallengesPage);
