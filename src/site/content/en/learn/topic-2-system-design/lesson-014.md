---
title: "Day 28 — Full System Design Mock"
description: "Design a content scheduling system end-to-end — live, structured, timed."
date: 2026-04-13
---

## Session goal

Walk through a full system design of your content automation SaaS in 15 minutes.

## Shadowing passage

> Alright, let me design a content scheduling and publishing system. Step one: requirements. Functional: users schedule posts, system publishes them on time to platforms like Pinterest, users see publishing history. Non-functional: publishing within two minutes of scheduled time, support ten thousand active users each scheduling an average of twenty posts per day — two hundred thousand publishes per day, roughly two per second average, ten at peak. Step two: write path. User submits post via API, stored in PostgreSQL with status 'scheduled' and a scheduled-at timestamp. Step three: scheduler. A polling job runs every thirty seconds, queries for posts where scheduled-at is within the next sixty seconds and status is 'scheduled', batch-enqueues them to RabbitMQ. Step four: consumer. One consumer pool per target platform, publishing rate-limited to stay within platform API limits. Success: update status to 'published', emit analytics event to ClickHouse. Failure: retry three times with exponential backoff, then dead letter queue and alert. Step five: observability. Prometheus scrapes queue depth and consumer lag. PagerDuty alerts if queue depth exceeds five minutes of historical throughput. The most important scale decision here was Postgres polling over a time-series-based event trigger — simpler, easier to reason about at this scale.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| two hundred thousand publishes per day | /tuː ˈhʌndrəd ˈθaʊzənd ˈpʌblɪʃɪz pər deɪ/ | always state the calculated QPS — not just raw numbers |
| consumer lag | /kənˈsjuːmər læɡ/ | how far behind the queue consumer is — key health signal |
| easier to reason about | /ˈiːziər tuː ˈriːzən əˈbaʊt/ | simplicity is a valid engineering argument |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Time yourself: did you get through all five steps inside 15 minutes?


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
