import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/translation';
import React from 'react';

interface StatsCardsProps {
  completedChallenges: number;
  rank: number;
  badges: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  completedChallenges,
  rank,
  badges,
}) => {
  const { t } = useTranslation();

  return (
    <HStack className="mt-6 w-full" space="md">
      <Card className="flex-1 items-center border-0 bg-white p-3 shadow-sm dark:bg-background-900">
        <Text className="text-2xl font-bold text-typography-900">
          {completedChallenges}
        </Text>
        <Text className="mt-1 text-xs text-typography-500">
          {t('profile.challenges', 'Challenges')}
        </Text>
      </Card>
      
      <Card className="flex-1 items-center border-0 bg-white p-3 shadow-sm dark:bg-background-900">
        <Text className="text-2xl font-bold text-typography-900">#{rank}</Text>
        <Text className="mt-1 text-xs text-typography-500">{t('profile.rank', 'Rank')}</Text>
      </Card>
      
      <Card className="flex-1 items-center border-0 bg-white p-3 shadow-sm dark:bg-background-900">
        <Text className="text-2xl font-bold text-typography-900">{badges}</Text>
        <Text className="mt-1 text-xs text-typography-500">
          {t('profile.badges', 'Badges')}
        </Text>
      </Card>
    </HStack>
  );
};
