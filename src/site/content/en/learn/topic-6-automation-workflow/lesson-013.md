---
title: "Day 77 — Monitoring & Alerting for Automation"
description: "Explain how you make automated workflows observable and reliable."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> Every automation system needs to be operated, not just built. Let me describe how I make workflows observable. First, structured logging at every step. Each workflow execution gets a unique run ID that propagates through every log line. When something fails, I search by run ID and see exactly which step failed, what the inputs were, and what the error was. Without a run ID, debugging async workflows is nearly impossible. Second, metrics at the workflow level. I track: total run count, success rate, median duration, and tail latency — the 99th percentile. A sudden drop in success rate is almost always the alerting signal I care about most. Duration spikes often indicate a downstream dependency degrading. Third, dead letter queues. Any message that fails after maximum retries goes to a DLQ. I set an alert: if the DLQ depth exceeds zero, someone investigates within 30 minutes. This ensures that no failed job is silently dropped. Fourth, synthetic monitoring. I run a canary workflow every 15 minutes — a real end-to-end automation with a test account. If the canary fails, the system is down, and PagerDuty fires. I've caught three production incidents with the canary before any user reported an issue. Observability isn't an afterthought — it's the reason automation systems stay running.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| dead letter queue | [Nghe →](https://youglish.com/pronounce/dead%20letter%20queue/english) | messages that failed all retries — monitor depth, investigate every item |
| canary workflow | [Nghe →](https://youglish.com/pronounce/canary%20workflow/english) | synthetic end-to-end test run on a schedule — catches outages before users do |
| tail latency | [Nghe →](https://youglish.com/pronounce/tail%20latency/english) | 99th percentile response time — what slow users experience, often hides bottlenecks |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How do you decide when a failing workflow step should retry vs. fail fast and alert a human?


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
