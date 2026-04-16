---
title: "Day 16 — Scaling from 1K to 1M Users"
description: "Tell the scaling story — what breaks first, and what to add at each stage."
date: 2026-04-13
---

## Session goal

Explain the progressive scaling decisions from 1,000 to 1,000,000 users.

## Shadowing passage

> At one thousand users, a single server handles everything comfortably — one web server, one database, maybe a small Redis cache. As traffic grows, the database breaks first. That is almost always the constraint. At ten thousand users, I add a read replica: all SELECT queries go to replicas, only writes touch the primary. At one hundred thousand users, I introduce database sharding — partition data by user ID modulo the shard count. I also add a CDN for static assets at this stage. At one million users, the bottleneck shifts to application-tier compute — horizontal auto-scaling behind a load balancer, with stateless services so any instance can serve any request. The discipline throughout this progression is: measure before you scale. Don't add a read replica because traffic doubled — add it when your database's CPU or connection pool is actually the bottleneck. Every abstraction adds operational complexity, and complexity has a cost in engineering time.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| read replica | [Nghe →](https://youglish.com/pronounce/read%20replica/english) | first scaling step for read-heavy systems |
| partition by user ID modulo | [Nghe →](https://youglish.com/pronounce/partition%20by%20user%20ID%20modulo/english) | hash-based sharding — explain the mechanism |
| measure before you scale | [Nghe →](https://youglish.com/pronounce/measure%20before%20you%20scale/english) | engineering discipline — don't optimize prematurely |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the first thing you'd measure to identify whether you need a read replica?


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
