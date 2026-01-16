import AIQuestsComponent from '@/components/quests/AIQuestsComponent';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const QuestsScreen = () => {
  const { communityId } = useLocalSearchParams<{ communityId: string }>();

  return <AIQuestsComponent communityId={communityId} />;
};

export default QuestsScreen;

