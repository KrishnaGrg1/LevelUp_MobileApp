import React from "react";
import { RefreshControl } from "react-native";

import { Box } from "@/components/ui/box";
import { ScrollView } from "@/components/ui/scroll-view";
import { VStack } from "@/components/ui/vstack";

import { CommunitiesSection } from "@/components/dashboard/CommunitiesSection";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";

import { useMyCommunities } from "@/hooks/queries/useCommunities";

function DashboardPage() {
  const [refreshing, setRefreshing] = React.useState(false);
  const { refetch: refetchCommunities } = useMyCommunities();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchCommunities();
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchCommunities]);

  return (
    <Box className="flex-1 bg-background-50">
      {/* Welcome Header with Avatar, Tokens, Language Switcher */}
      <WelcomeHeader />

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <VStack space="md" className="pb-6">
          {/* Communities Section - Horizontal Scroll */}
          <CommunitiesSection />

          {/* TODO: Add more sections in future phases:
              - Recommended Quests
              - Recent Activity
              - Quick Actions
          */}
        </VStack>
      </ScrollView>
    </Box>
  );
}

export default React.memo(DashboardPage);
