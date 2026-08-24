// Computed straight from state.progress (streak days, completed lessons, speak sessions)
// already tracked by useProgress.js — no separate badge schema/backend.
const BADGE_DEFS = [
  {
    id: 'first-step',
    icon: '🌱',
    label: 'First Step',
    description: 'Complete your first lesson',
    metric: 'completedCount',
    threshold: 1,
  },
  {
    id: 'streak-3',
    icon: '🔥',
    label: '3-day streak',
    description: 'Practice 3 days in a row',
    metric: 'streakCount',
    threshold: 3,
  },
  {
    id: 'streak-7',
    icon: '⚡',
    label: '7-day streak',
    description: 'Practice 7 days in a row',
    metric: 'streakCount',
    threshold: 7,
  },
  {
    id: 'streak-14',
    icon: '🌟',
    label: '14-day streak',
    description: 'Two full weeks of consistency',
    metric: 'streakCount',
    threshold: 14,
  },
  {
    id: 'lessons-10',
    icon: '📚',
    label: '10 lessons done',
    description: 'Complete 10 mastery lessons',
    metric: 'completedCount',
    threshold: 10,
  },
  {
    id: 'lessons-30',
    icon: '🎓',
    label: '30 lessons done',
    description: 'Complete 30 mastery lessons',
    metric: 'completedCount',
    threshold: 30,
  },
  {
    id: 'speak-master',
    icon: '🎙️',
    label: 'Voice Explorer',
    description: 'Practice speaking with AI 5 times',
    metric: 'speakCount',
    threshold: 5,
  },
];

export function getBadges({streakCount = 0, completedCount = 0, speakCount = 0} = {}) {
  const metrics = {streakCount, completedCount, speakCount};
  return BADGE_DEFS.map((def) => {
    const current = metrics[def.metric] || 0;
    const earned = current >= def.threshold;
    const progress = Math.min(1, current / def.threshold);
    return {
      id: def.id,
      icon: def.icon,
      label: def.label,
      description: def.description,
      threshold: def.threshold,
      current,
      progress,
      earned,
    };
  });
}

