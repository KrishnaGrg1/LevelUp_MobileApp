import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import React from 'react';

export interface MenuItem {
  id: number;
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

interface MenuItemsListProps {
  menuItems: MenuItem[];
}

export const MenuItemsList: React.FC<MenuItemsListProps> = ({ menuItems }) => {
  return (
    <VStack space="sm" className="mb-6">
      {menuItems.map(item => (
        <Pressable key={item.id} onPress={item.onPress}>
          <Card className="border-0 bg-white p-4 shadow-sm dark:bg-background-900">
            <HStack className="items-center justify-between">
              <HStack className="items-center" space="md">
                <Box className="h-10 w-10 items-center justify-center rounded-full bg-background-100">
                  <Icon as={item.icon} size="md" className="text-typography-900" />
                </Box>
                <Text className="font-medium text-typography-900">{item.label}</Text>
              </HStack>
              <Icon as={ChevronRight} size="md" className="text-typography-500" />
            </HStack>
          </Card>
        </Pressable>
      ))}
    </VStack>
  );
};
