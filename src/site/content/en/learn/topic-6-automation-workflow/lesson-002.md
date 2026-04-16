---
title: "Day 66 — Workflow Design"
description: "Event-driven workflows, task queues, and orchestration patterns."
date: 2026-04-13
---

## Session goal

Design an automated content publishing workflow from trigger to completion.

## Shadowing passage

> A production workflow has three components: trigger, execution, and observation. The content publishing workflow I operate starts with a trigger: a cron job fires every thirty seconds and queries for due posts. This is polling-based, which is simpler to reason about and debug than event-driven triggers for this pattern — I have full control over when the check happens. Execution: each due post is enqueued as a task in Cloud Tasks with a configured deadline. A consumer pool dequeues tasks and executes the publish operation: fetch the post content and assets, call the platform API, handle the response. The execution is idempotent by design — if the same task is processed twice due to retries, the second execution detects the post is already published and exits cleanly without side effects. Observation: every step emits structured logs with the post ID, step name, and duration. A Cloud Monitoring dashboard shows tasks-per-minute, failure rate, and the oldest unprocessed task in the queue. The oldest unprocessed task is the most important signal — if it's growing, the queue is not draining, and I need to understand why. Alert: if the oldest unprocessed task is more than ten minutes old outside of configured maintenance windows, PagerDuty fires.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| idempotent by design | /aɪˈdɛmpətənt baɪ dɪˈzaɪn/ | double processing has no bad side effects — essential for any retry-capable system |
| oldest unprocessed task | /ˈoʊldɪst ˌʌnˈprɒsɛst tɑːsk/ | the age of the queue's oldest item — tells you if processing is keeping up |
| structured logs | /ˈstrʌktʃərd lɒɡz/ | JSON-format logs with machine-queryable fields — enables fast investigation |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Design the alerting rule: when should this workflow alert vs. self-heal?


## Anti-Translation Drill — Think in English *(5 min)*

Pick **one key phrase** from today's table. Explain what it means using **only English**.

- No Vietnamese. No dictionary.
- If you don't know a word, describe it: *"It's when you…"* / *"It's similar to…"* / *"The opposite would be…"*
- Then use the phrase in a new sentence about your own experience.

> Goal: Train circumlocution — the skill of explaining anything without knowing the exact word. This is what fluent speakers actually do.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
