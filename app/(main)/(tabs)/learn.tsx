import React from 'react';
import { RefreshControl } from 'react-native';

import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { useTranslation } from '@/translation';
import { Clock, Search, Star } from 'lucide-react-native';

function LearnPage() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch learning content
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Mock data - replace with real API data
  const categories = [
    { id: 1, name: 'Programming', count: 24, color: 'bg-blue-500' },
    { id: 2, name: 'Design', count: 18, color: 'bg-purple-500' },
    { id: 3, name: 'Marketing', count: 12, color: 'bg-green-500' },
    { id: 4, name: 'Business', count: 15, color: 'bg-orange-500' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Introduction to React Native',
      description: 'Learn the basics of building mobile apps',
      duration: '4h 30m',
      lessons: 12,
      rating: 4.8,
      thumbnail: '📱',
      progress: 65,
    },
    {
      id: 2,
      title: 'Advanced TypeScript',
      description: 'Master advanced TypeScript concepts',
      duration: '6h 15m',
      lessons: 18,
      rating: 4.9,
      thumbnail: '📘',
      progress: 30,
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      description: 'Create beautiful user interfaces',
      duration: '5h 45m',
      lessons: 15,
      rating: 4.7,
      thumbnail: '🎨',
      progress: 0,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background-0"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <Box className="bg-primary-500 px-6 pb-6 pt-12">
        <Heading size="xl" className="mb-4 text-white">
          {t('learn.title', 'Learn')}
        </Heading>

        {/* Search Bar */}
        <Box>
          <Input className="border-0 bg-white/10">
            <InputSlot className="pl-3">
              <InputIcon as={Search} className="text-white/60" />
            </InputSlot>
            <InputField
              placeholder={t('learn.search', 'Search courses...')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="text-white placeholder:text-white/60"
            />
          </Input>
        </Box>
      </Box>

      <Box className="px-6 py-6">
        {/* Courses */}
        <VStack space="sm">
          <Text className="mb-2 text-base font-semibold text-typography-900">
            {t('learn.myCourses', 'My Courses')}
          </Text>

          {courses.map(course => (
            <Pressable key={course.id}>
              <Card className="border-0 bg-white p-3 dark:bg-background-900">
                <HStack space="sm">
                  {/* Thumbnail */}
                  <Box className="h-16 w-16 items-center justify-center rounded-lg bg-background-100">
                    <Text className="text-2xl">{course.thumbnail}</Text>
                  </Box>

                  {/* Content */}
                  <VStack className="flex-1">
                    <Text className="text-sm font-medium text-typography-900">{course.title}</Text>
                    <HStack className="mt-1 items-center" space="sm">
                      <HStack className="items-center" space="xs">
                        <Icon as={Clock} size="xs" className="text-typography-400" />
                        <Text className="text-xs text-typography-400">{course.duration}</Text>
                      </HStack>
                      <HStack className="items-center" space="xs">
                        <Icon as={Star} size="xs" className="text-yellow-500" />
                        <Text className="text-xs text-typography-400">{course.rating}</Text>
                      </HStack>
                    </HStack>

                    {course.progress > 0 && (
                      <Box className="mt-2">
                        <Box className="h-1 overflow-hidden rounded-full bg-background-100">
                          <Box
                            className="h-full bg-primary-500"
                            style={{ width: `${course.progress}%` }}
                          />
                        </Box>
                        <Text className="mt-1 text-xs text-typography-400">
                          {course.progress}% {t('learn.progress', 'complete')}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </HStack>
              </Card>
            </Pressable>
          ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}

export default React.memo(LearnPage);
