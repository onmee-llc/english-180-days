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

| Phrase | IPA | Note |
|--------|-----|------|
| textbook case | /ˈtɛkstbʊk keɪs/ | confidently signals you recognize a classic pattern |
| consumer concurrency | /kənˈsjuːmər kənˈkʌrənsi/ | number of parallel consumers — controls throughput and rate |
| dead letter queue | /dɛd ˈlɛtər kjuː/ | destination for permanently failed messages — shows operational maturity |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

When would you choose Kafka over RabbitMQ? Name one workload where ordering guarantees matter.
