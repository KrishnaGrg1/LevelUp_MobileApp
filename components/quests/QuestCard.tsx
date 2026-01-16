import React from 'react';
import { Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import type { Quest } from '@/api/types/ai';
import { getQuestStatus, getTimeRemaining, getQuestBadgeColor } from '@/utils/questUtils';

interface QuestCardProps {
  quest: Quest;
  onStart: (questId: string) => void;
  onComplete: (questId: string) => void;
  isLoading?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onStart, onComplete, isLoading }) => {
  const status = getQuestStatus(quest);
  const timeInfo = getTimeRemaining(quest);
  const badgeColor = getQuestBadgeColor(quest.type);

  const handleStart = () => {
    Alert.alert('Start Quest', `Are you sure you want to start this quest?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start', onPress: () => onStart(quest.id) },
    ]);
  };

  const handleComplete = () => {
    Alert.alert('Complete Quest', `Ready to complete this quest?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: () => onComplete(quest.id) },
    ]);
  };

  const renderButton = () => {
    switch (status) {
      case 'not-started':
        return (
          <Button action="positive" onPress={handleStart} isDisabled={isLoading} className="mt-2">
            <ButtonText>Start Quest</ButtonText>
          </Button>
        );

      case 'in-progress':
        return (
          <VStack space="xs" className="mt-2">
            <Box className="h-2 w-full bg-background-200 dark:bg-background-800 rounded-full overflow-hidden">
              <Box
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${timeInfo.progressPercent}%` }}
              />
            </Box>
            <Text size="sm" className="text-typography-600 dark:text-typography-400 text-center">
              {timeInfo.remainingText}
            </Text>
          </VStack>
        );

      case 'ready':
        return (
          <Button action="positive" onPress={handleComplete} isDisabled={isLoading} className="mt-2">
            <ButtonText>Complete Quest</ButtonText>
          </Button>
        );

      case 'completed':
        return (
          <Badge
            size="lg"
            variant="solid"
            action="success"
            className="mt-2 self-stretch justify-center"
          >
            <BadgeText>✓ Completed</BadgeText>
          </Badge>
        );
    }
  };

  return (
    <Box className="bg-background-0 dark:bg-background-900 rounded-xl p-4 mb-3 border border-outline-200 dark:border-outline-800 shadow-sm">
      {/* Header */}
      <Box className="flex-row justify-between mb-3">
        <Box className="flex-row gap-2">
          <Badge 
            size="md" 
            variant="solid" 
            style={{ backgroundColor: badgeColor.backgroundColor }}
          >
            <BadgeText style={{ color: badgeColor.color }}>{quest.type}</BadgeText>
          </Badge>
        </Box>
        <Box className="flex-row items-center gap-1">
          <Text size="lg" bold className="text-typography-900 dark:text-typography-50">
            {quest.xpValue}
          </Text>
          <Text size="xs" className="text-typography-600 dark:text-typography-400 font-semibold">
            XP
          </Text>
        </Box>
      </Box>

      {/* Description */}
      <Text
        size="md"
        className="text-typography-900 dark:text-typography-50 mb-3 leading-5 font-medium"
      >
        {quest.description}
      </Text>

      {/* Footer */}
      <Box className="flex-row justify-between mb-2">
        <Text size="sm" className="text-typography-500 dark:text-typography-400">
          Quest #{quest.periodSeq}
        </Text>
        {quest.estimatedMinutes && (
          <Text size="sm" className="text-typography-500 dark:text-typography-400">
            ~{quest.estimatedMinutes} min
          </Text>
        )}
      </Box>

      {/* Action Button */}
      {isLoading ? (
        <Box className="mt-2 items-center">
          <Spinner size="small" />
        </Box>
      ) : (
        renderButton()
      )}
    </Box>
  );
};

export default QuestCard;
