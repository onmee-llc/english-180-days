import {describe, it, expect} from 'vitest';
import {mergeProgress} from './mergeProgress.js';

describe('mergeProgress', () => {
  it('unions streak days from both sides', () => {
    const a = {streak: {'2026-08-22': true}};
    const b = {streak: {'2026-08-23': true}};
    expect(mergeProgress(a, b).streak).toEqual({
      '2026-08-22': true,
      '2026-08-23': true,
    });
  });

  it('unions completed lessons without duplicates', () => {
    const a = {completed: ['lesson-1']};
    const b = {completed: ['lesson-1', 'lesson-2']};
    expect(mergeProgress(a, b).completed.sort()).toEqual([
      'lesson-1',
      'lesson-2',
    ]);
  });

  it('picks the earliest firstVisit', () => {
    const a = {firstVisit: '2026-08-25'};
    const b = {firstVisit: '2026-08-22'};
    expect(mergeProgress(a, b).firstVisit).toBe('2026-08-22');
  });

  it('merges examResults keeping the highest scores and pass state', () => {
    const a = {
      examResults: {
        'lesson-1': {quizScore: 80, speakingScore: 70, passed: true},
      },
    };
    const b = {
      examResults: {
        'lesson-1': {quizScore: 100, speakingScore: 65, passed: false},
        'lesson-2': {quizScore: 90, speakingScore: 85, passed: true},
      },
    };
    const merged = mergeProgress(a, b);
    expect(merged.examResults['lesson-1'].quizScore).toBe(100);
    expect(merged.examResults['lesson-1'].speakingScore).toBe(70);
    expect(merged.examResults['lesson-1'].passed).toBe(true);
    expect(merged.examResults['lesson-2'].passed).toBe(true);
  });

  it('handles missing fields on both sides', () => {
    expect(mergeProgress({}, {})).toEqual({streak: {}, completed: [], examResults: {}});
  });
});
