---
title: "Day 19 — Message Queues"
description: "Explain async processing — when queues help, which implementation to choose."
date: 2026-04-13
---

## Session goal

Design the queue layer for a content publishing system with rate-limited APIs.

## Shadowing passage

> In my Pinterest content scheduling SaaS, the publishing pipeline is a textbook case for a message queue. A scheduler runs every minute, checks for posts due within two minutes, and enqueues them. A consumer pool dequeues messages and handles publishing: API call, image upload, metadata setting. Three reasons I use a queue here. First, decoupling: the scheduler has no knowledge of the publisher implementation. Second, durability: if a consumer crashes mid-publish, the message stays in the queue and gets redelivered. Third, rate control: Pinterest's API has rate limits, and a queue lets me tune consumer concurrency precisely. My choice here is RabbitMQ rather than Kafka — the ordering guarantees Kafka offers aren't needed for independent post publishing, and RabbitMQ's per-queue delivery semantics fit this pattern better. I configure dead letter queues for failed publishes: three retries with exponential backoff, then move to DLQ and trigger an alert. This means the system handles transient failures automatically and only pages a human for persistent failures.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| textbook case | [Nghe →](https://youglish.com/pronounce/textbook%20case/english) | confidently signals you recognize a classic pattern |
| consumer concurrency | [Nghe →](https://youglish.com/pronounce/consumer%20concurrency/english) | number of parallel consumers — controls throughput and rate |
| dead letter queue | [Nghe →](https://youglish.com/pronounce/dead%20letter%20queue/english) | destination for permanently failed messages — shows operational maturity |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

When would you choose Kafka over RabbitMQ? Name one workload where ordering guarantees matter.


## Anti-Translation Drill — Listening First *(5 min)*

Close the text. Recall today's shadowing passage from memory only.

1. Say the **main idea** in one English sentence out loud.
2. Say **one specific detail** you remember.
3. If you blank out — do NOT open the text. Describe what you vaguely remember using simple English.

> Goal: Build the habit of processing English without reading — ears and memory only.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
