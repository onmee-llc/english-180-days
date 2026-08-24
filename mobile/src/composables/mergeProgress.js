// Ported verbatim from src/lib/fb.js — same commutative/idempotent union
// merge, so the mobile app and web app converge on repeated syncs.
export function mergeProgress(a = {}, b = {}) {
  const out = {};

  const firstVisits = [a.firstVisit, b.firstVisit].filter(Boolean).sort();
  if (firstVisits.length) {
    out.firstVisit = firstVisits[0];
  }

  out.streak = Object.assign({}, a.streak || {}, b.streak || {});

  const completed = new Set([
    ...(Array.isArray(a.completed) ? a.completed : []),
    ...(Array.isArray(b.completed) ? b.completed : []),
  ]);
  out.completed = [...completed];

  // Merge exam results, keeping best scores
  const allExamKeys = new Set([
    ...Object.keys(a.examResults || {}),
    ...Object.keys(b.examResults || {}),
  ]);
  if (allExamKeys.size > 0) {
    out.examResults = {};
    for (const key of allExamKeys) {
      const resA = a.examResults?.[key] || {};
      const resB = b.examResults?.[key] || {};
      out.examResults[key] = {
        quizScore: Math.max(resA.quizScore || 0, resB.quizScore || 0),
        speakingScore: Math.max(resA.speakingScore || 0, resB.speakingScore || 0),
        passed: !!(resA.passed || resB.passed),
        timestamp: resB.timestamp || resA.timestamp || Date.now(),
      };
    }
  } else {
    out.examResults = {};
  }

  if (a.dailyGoal !== undefined || b.dailyGoal !== undefined) {
    out.dailyGoal = b.dailyGoal ?? a.dailyGoal;
  }
  if (a.weeklyGoalDays !== undefined || b.weeklyGoalDays !== undefined) {
    out.weeklyGoalDays = b.weeklyGoalDays ?? a.weeklyGoalDays;
  }
  if (a.speakCount !== undefined || b.speakCount !== undefined) {
    out.speakCount = Math.max(a.speakCount || 0, b.speakCount || 0);
  }

  return out;
}
