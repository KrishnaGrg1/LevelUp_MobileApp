import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from '@/translation';
import { Calendar, Mail } from 'lucide-react-native';
import React from 'react';

interface AccountInfoCardProps {
  email: string;
  joinedDate: string;
}

export const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ email, joinedDate }) => {
  const { t } = useTranslation();

  return (
    <Card className="mt-6 border-0 bg-white p-4 shadow-sm dark:bg-background-900">
      <Text className="text-sm font-medium text-typography-500">
        {t('profile.accountInfo', 'Account Information')}
      </Text>
      <VStack className="mt-3" space="sm">
        <HStack className="items-center" space="sm">
          <Icon as={Mail} size="sm" className="text-typography-500" />
          <Text className="text-sm text-typography-900">
            {email || 'user@example.com'}
          </Text>
        </HStack>
        <HStack className="items-center" space="sm">
          <Icon as={Calendar} size="sm" className="text-typography-500" />
          <Text className="text-sm text-typography-900">
            {t('profile.joined', 'Joined')} {joinedDate}
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
};
