import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from '@/translation';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  earned: boolean;
}

interface AchievementsListProps {
  achievements: Achievement[];
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
  const { t } = useTranslation();

  return (
    <VStack space="md" className="mb-6">
      <HStack className="items-center justify-between">
        <Heading size="lg" className="text-typography-900">
          {t('profile.achievements', 'Achievements')}
        </Heading>
        <Pressable>
          <Text className="text-sm font-medium text-typography-900">
            {t('profile.viewAll', 'View All')}
          </Text>
        </Pressable>
      </HStack>
      
      <HStack space="md" className="flex-wrap">
        {achievements.map(achievement => (
          <Card
            key={achievement.id}
            className={`mb-3 w-[48%] border ${
              achievement.earned ? 'border-outline-100' : 'border-outline-50'
            } p-4 ${!achievement.earned && 'opacity-50'}`}
          >
            <Box
              className={`h-12 w-12 items-center justify-center rounded-full ${achievement.bgColor}`}
            >
              <Icon as={achievement.icon} size="lg" className={achievement.color} />
            </Box>
            <Text className="mt-3 font-semibold text-typography-900">{achievement.name}</Text>
            <Text className="mt-1 text-xs text-typography-500">{achievement.description}</Text>
          </Card>
        ))}
      </HStack>
    </VStack>
  );
};
