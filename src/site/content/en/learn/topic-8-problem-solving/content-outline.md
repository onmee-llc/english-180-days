---
title: Content Outline
description: Core concepts and frameworks for Technical Problem Solving.
date: 2026-04-13
---

## How to use this module

1. Read the outline once silently.
2. Close the page. Try to recall the main points out loud.
3. Come back and fill in what you missed.
4. Repeat until you can present the outline verbally in 3–5 minutes.

## Practice format

For each concept below:
- State what it is (1 sentence)
- Explain when/why you'd use it (1–2 sentences)
- Give a real example from your own work (1–2 sentences)

---

## 1. Thinking Out Loud

The most important skill in a technical interview: narrate your reasoning as you work through a problem.

**Why it matters** — The interviewer is evaluating your thought process, not just the answer. Silence = no signal.

**How to practice** — When solving any problem (even alone), speak your reasoning: "The first thing I'd check is… My hypothesis is… Let me verify by…"

**Structure:** State the problem → List possible causes → Prioritize → Test the most likely first → Report findings → Discuss next steps.

## 2. Debugging Methodology

**Isolate** — Narrow down where the problem is. Is it the frontend, backend, database, or network? Use binary search: disable half the system and see if the problem persists.

**Reproduce** — Make the problem happen reliably. If you can't reproduce it, you can't fix it with confidence. Capture the exact inputs, environment, and timing.

**Hypothesize** — Form a theory about the root cause. "I think the issue is X because I observed Y."

**Test** — Design a test that proves or disproves your hypothesis. One variable at a time.

**Fix** — Apply the fix. Verify the original problem is resolved. Verify nothing else is broken.

**Document** — Write up what happened, why, and what was changed. Future you will thank present you.

## 3. Technical Trade-offs

**How to evaluate options:**
1. List the criteria that matter (performance, cost, complexity, team familiarity, timeline)
2. Score each option against criteria
3. Identify the deciding factor (usually 1–2 criteria dominate)
4. Make the decision and document the reasoning

**How to explain trade-offs:**
> "I chose X over Y because the primary constraint was Z. Y would have been better for W, but that wasn't the bottleneck."

## 4. Performance Optimization

**Identify** — Don't guess where the bottleneck is. Measure. Profile. Look at metrics.

**Measure** — Establish a baseline. "Response time is currently 800ms at p95." You can't improve what you don't measure.

**Improve** — Fix the biggest bottleneck first. Database query taking 600ms of the 800ms? Optimize the query, add an index, or introduce caching.

**Verify** — Measure again after the change. Did p95 drop? Did anything else get worse?

## 5. Code Quality Discussion

**Clean code principles** — Readable, tested, well-named. Functions do one thing. Names reveal intent. No magic numbers.

**Tech debt** — The cost of past shortcuts. Not all tech debt is bad — sometimes shipping fast is the right call. The key is tracking it and paying it down intentionally.

**Refactoring** — Improving code structure without changing behavior. Always have tests before refactoring. Small, incremental changes over big rewrites.

## 6. Root Cause Analysis

**Go beyond symptoms** — "The server crashed" is a symptom. "The connection pool was exhausted because a query held locks for 30 seconds" is the root cause.

**The 5 Whys** — Ask "why" repeatedly until you reach the fundamental cause.
1. Why did the server crash? → Out of memory.
2. Why out of memory? → Connection pool exhausted.
3. Why exhausted? → Long-running query holding locks.
4. Why long-running? → Missing index on a new column.
5. Why missing? → Migration was deployed without the index.

**Prevention** — The fix should prevent recurrence, not just resolve the current incident. Add the index AND add a migration checklist.
