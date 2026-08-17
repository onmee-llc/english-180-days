/**
 * Picks what the Today screen should show for a given date.
 *
 * `lessons` must be sorted ascending by `date` (build-content.js guarantees
 * this). Returns `{status: 'lesson', lesson}` or `{status: 'complete'}`.
 * The three non-obvious cases: before the program starts (show day 1), after
 * the last lesson (the program is over — don't loop back to day 1), and a gap
 * day inside the program with nothing scheduled (show the next lesson up).
 */
export function selectTodayLesson(lessons, todayISO) {
  const exact = lessons.find((l) => l.date === todayISO);
  if (exact) return {status: 'lesson', lesson: exact};

  if (lessons.length && todayISO < lessons[0].date) {
    return {status: 'lesson', lesson: lessons[0]};
  }

  const next = lessons.find((l) => l.date > todayISO);
  return next ? {status: 'lesson', lesson: next} : {status: 'complete'};
}
