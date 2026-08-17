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

  return out;
}
