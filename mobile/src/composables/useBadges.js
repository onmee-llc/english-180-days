// Computed straight from state.progress (streak days + completed lessons)
// already tracked by useProgress.js — no separate badge schema/backend.
const BADGE_DEFS = [
  {
    id: 'streak-3',
    icon: '🔥',
    label: '3-day streak',
    metric: 'streakCount',
    threshold: 3,
  },
  {
    id: 'streak-7',
    icon: '🔥🔥',
    label: '7-day streak',
    metric: 'streakCount',
    threshold: 7,
  },
  {
    id: 'lessons-10',
    icon: '📚',
    label: '10 lessons done',
    metric: 'completedCount',
    threshold: 10,
  },
  {
    id: 'lessons-30',
    icon: '📚📚',
    label: '30 lessons done',
    metric: 'completedCount',
    threshold: 30,
  },
];

export function getBadges({streakCount, completedCount}) {
  const metrics = {streakCount, completedCount};
  return BADGE_DEFS.map((def) => ({
    id: def.id,
    icon: def.icon,
    label: def.label,
    earned: metrics[def.metric] >= def.threshold,
  }));
}
