import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from '@/translation';
import React from 'react';

interface ProgressCardProps {
  currentXP: number;
  xpToNextLevel: number;
  currentLevel: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  currentXP,
  xpToNextLevel,
  currentLevel,
}) => {
  const { t } = useTranslation();
  const progressPercentage = (currentXP / xpToNextLevel) * 100;

  return (
    <Card className="mb-6 border-0 bg-white p-4 shadow-sm dark:bg-background-900">
      <HStack className="items-center justify-between">
        <VStack className="flex-1">
          <Text className="text-sm font-medium text-typography-500">
            {t('profile.nextLevel', 'Next Level')}
          </Text>
          <Text className="mt-1 text-lg font-bold text-typography-900">
            {currentXP} / {xpToNextLevel} XP
          </Text>
        </VStack>
        <Box className="h-16 w-16 items-center justify-center rounded-full bg-primary-500">
          <Text className="text-2xl font-bold text-white">{currentLevel + 1}</Text>
        </Box>
      </HStack>
      <Box className="mt-3 h-2 overflow-hidden rounded-full bg-background-100">
        <Box
          className="h-full bg-primary-500"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </Box>
    </Card>
  );
};
