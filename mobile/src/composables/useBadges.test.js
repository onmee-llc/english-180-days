import {describe, it, expect} from 'vitest';
import {getBadges} from './useBadges.js';

describe('getBadges', () => {
  it('marks nothing earned with no progress', () => {
    const badges = getBadges({streakCount: 0, completedCount: 0});
    expect(badges.every((b) => !b.earned)).toBe(true);
  });

  it('earns the 3-day streak badge but not the 7-day one at 3 days', () => {
    const badges = getBadges({streakCount: 3, completedCount: 0});
    expect(badges.find((b) => b.id === 'streak-3').earned).toBe(true);
    expect(badges.find((b) => b.id === 'streak-7').earned).toBe(false);
  });

  it('earns both lesson-count badges once past the higher threshold', () => {
    const badges = getBadges({streakCount: 0, completedCount: 30});
    expect(badges.find((b) => b.id === 'lessons-10').earned).toBe(true);
    expect(badges.find((b) => b.id === 'lessons-30').earned).toBe(true);
  });
});
