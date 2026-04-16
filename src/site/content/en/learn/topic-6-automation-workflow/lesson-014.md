---
title: "Day 78 — Week 2 Review — Automation Architecture"
description: "Present your full automation system — from trigger to output, including reliability design."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> Let me walk through the complete automation architecture for the content publishing system. The trigger layer handles four event types: scheduled jobs via cron, webhook events from platform APIs, manual triggers via an admin UI, and reactive triggers from monitoring alerts. All triggers publish to a central event bus — we use SQS FIFO queues for ordering guarantees. The orchestration layer reads from the queue and routes to workflow handlers based on event type. Each workflow is a state machine: pending, running, awaiting, completed, failed. I use Step Functions for complex multi-step workflows with branching logic, and Lambda for simple single-step operations. Each step has a timeout, retry configuration, and error handler. The integration layer manages external API calls. All third-party calls go through a retry wrapper with exponential backoff and jitter. Rate limits are tracked per API key in Redis. If we're approaching a rate limit, the workflow pauses and reschedules rather than hitting a 429. The output layer writes results to the database, queues follow-up notifications, and publishes completion events for downstream consumers. Observability: every execution is logged with its run ID, every API call is traced, and a canary workflow validates end-to-end health every 15 minutes. This system processes about 3,000 automation runs per day with 99.7 percent success rate.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| state machine | [Nghe →](https://youglish.com/pronounce/state%20machine/english) | model workflow progress as explicit states with defined transitions — makes complex flows debuggable |
| exponential backoff with jitter | [Nghe →](https://youglish.com/pronounce/exponential%20backoff%20with%20jitter/english) | retry with increasing delay plus randomness — prevents thundering herd on recovery |
| rate limit tracking | [Nghe →](https://youglish.com/pronounce/rate%20limit%20tracking/english) | monitor API quota consumption proactively — pause before hitting the wall, not after |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

If you had to choose between building more automation features vs. improving observability of existing ones, how would you decide?


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
