import {describe, it, expect, beforeEach} from 'vitest';
import {useMasteryPoints, MASTERY_LEVELS, XP_REWARDS} from './useMasteryPoints.js';

describe('useMasteryPoints', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined' && typeof localStorage.clear === 'function') {
      localStorage.clear();
    }
    const {resetXp} = useMasteryPoints();
    resetXp();
  });

  it('starts at level 1 with 0 XP', () => {
    const {totalXp, currentLevel, levelProgressPercent} = useMasteryPoints();
    expect(totalXp.value).toBe(0);
    expect(currentLevel.value.level).toBe(1);
    expect(levelProgressPercent.value).toBe(0);
  });

  it('adds XP correctly and updates total', () => {
    const {totalXp, addXp} = useMasteryPoints();
    addXp(XP_REWARDS.EXAM_PASSED, 'Passed Exam');
    expect(totalXp.value).toBe(50);
  });

  it('advances to Level 2 when passing 250 XP', () => {
    const {totalXp, currentLevel, addXp} = useMasteryPoints();
    addXp(300, 'Multiple study sessions');
    expect(totalXp.value).toBe(300);
    expect(currentLevel.value.level).toBe(2);
    expect(currentLevel.value.titleEn).toBe('Technical Communicator');
  });

  it('advances to Level 3 and 4 with higher XP', () => {
    const {currentLevel, addXp} = useMasteryPoints();
    addXp(800, 'Advanced lessons');
    expect(currentLevel.value.level).toBe(3);

    addXp(1000, 'Mastery achieved');
    expect(currentLevel.value.level).toBe(4);
  });
});
