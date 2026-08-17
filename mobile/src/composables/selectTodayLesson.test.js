import {describe, it, expect} from 'vitest';
import {selectTodayLesson} from './selectTodayLesson.js';

// Sorted ascending by date, with a deliberate gap (no 2026-08-24).
const lessons = [
  {day: 1, date: '2026-08-22'},
  {day: 2, date: '2026-08-23'},
  {day: 3, date: '2026-08-25'},
];

describe('selectTodayLesson', () => {
  it('returns the lesson scheduled for today', () => {
    expect(selectTodayLesson(lessons, '2026-08-23')).toEqual({
      status: 'lesson',
      lesson: lessons[1],
    });
  });

  it('returns day 1 before the program starts', () => {
    expect(selectTodayLesson(lessons, '2026-08-01')).toEqual({
      status: 'lesson',
      lesson: lessons[0],
    });
  });

  it('reports completion after the last lesson', () => {
    expect(selectTodayLesson(lessons, '2026-09-01')).toEqual({
      status: 'complete',
    });
  });

  it('returns the next upcoming lesson on a gap day, not day 1', () => {
    expect(selectTodayLesson(lessons, '2026-08-24')).toEqual({
      status: 'lesson',
      lesson: lessons[2],
    });
  });
});
