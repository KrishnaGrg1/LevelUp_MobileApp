import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from '@/translation';
import { Crown, TrendingUp } from 'lucide-react-native';
import React from 'react';

interface ProfileHeaderProps {
  username: string;
  email: string;
  profilePicture?: string;
  level: number;
  isAdmin: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  email,
  profilePicture,
  level,
  isAdmin,
}) => {
  const { t } = useTranslation();

  return (
    <Box className="bg-primary-500 px-6 pb-8 pt-12">
      <VStack className="items-center">
        {/* Avatar */}
        <Box className="relative">
          <Avatar size="2xl" className="border-4 border-white">
            <AvatarFallbackText className="text-white">
              {username || 'User'}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: profilePicture,
              }}
            />
          </Avatar>
          {isAdmin && (
            <Box className="absolute -right-2 -top-2 h-10 w-10 items-center justify-center rounded-full border-4 border-primary-500 bg-yellow-500">
              <Icon as={Crown} size="sm" className="text-white" />
            </Box>
          )}
        </Box>

        {/* User Info */}
        <Heading size="2xl" className="mt-4 text-white">
          {username || 'User'}
        </Heading>
        <Text className="mt-1 text-typography-300">{email || 'user@example.com'}</Text>

        {/* Level Badge */}
        <Badge
          size="lg"
          variant="solid"
          className="mt-3 border-0 bg-white dark:bg-background-900"
        >
          <Icon as={TrendingUp} size="sm" className="text-primary-500" />
          <BadgeText className="ml-1 text-typography-900">
            {t('profile.level', 'Level')} {level}
          </BadgeText>
        </Badge>
      </VStack>
    </Box>
  );
};
