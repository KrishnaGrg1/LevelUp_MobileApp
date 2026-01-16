import type { Quest, QuestStatus, TimeRemaining } from '@/api/types/ai';

export function getQuestStatus(quest: Quest): QuestStatus {
  if (quest.isCompleted || quest.completedAt) return 'completed';

  if (quest.startedAt) {
    const timeRemaining = getTimeRemaining(quest);
    return timeRemaining.isReady ? 'ready' : 'in-progress';
  }

  return 'not-started';
}

export function getTimeRemaining(quest: Quest): TimeRemaining {
  if (!quest.startedAt) {
    const required = quest.estimatedMinutes || 30;
    return {
      isReady: false,
      remainingMinutes: required,
      remainingText: `${required} min required`,
      progressPercent: 0,
    };
  }

  const requiredMinutes = quest.estimatedMinutes || 30;
  const startTime = new Date(quest.startedAt).getTime();
  const now = Date.now();
  const elapsedMinutes = Math.floor((now - startTime) / (1000 * 60));
  const remainingMinutes = Math.max(0, requiredMinutes - elapsedMinutes);
  const progressPercent = Math.min(100, (elapsedMinutes / requiredMinutes) * 100);

  return {
    isReady: remainingMinutes === 0,
    remainingMinutes,
    remainingText:
      remainingMinutes > 0 ? `${remainingMinutes} min remaining` : 'Ready to complete!',
    progressPercent,
  };
}

export function formatQuestPeriod(periodStatus: Quest['periodStatus']): string {
  const periodMap: Record<Quest['periodStatus'], string> = {
    TODAY: 'Today',
    YESTERDAY: 'Yesterday',
    DAY_BEFORE_YESTERDAY: '2 Days Ago',
    THIS_WEEK: 'This Week',
    LAST_WEEK: 'Last Week',
    TWO_WEEKS_AGO: '2 Weeks Ago',
  };

  return periodMap[periodStatus] || periodStatus;
}

export function getQuestBadgeColor(
  type: Quest['type'],
): { backgroundColor: string; color: string } {
  if (type === 'Daily') {
    return { backgroundColor: '#9333EA', color: '#FFFFFF' };
  }
  return { backgroundColor: '#4F46E5', color: '#FFFFFF' };
}

export function getStatusColor(status: QuestStatus): string {
  const colorMap: Record<QuestStatus, string> = {
    'not-started': '#6B7280',
    'in-progress': '#3B82F6',
    ready: '#10B981',
    completed: '#059669',
  };

  return colorMap[status];
}
