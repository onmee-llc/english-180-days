---
title: "Day 18 — SQL vs NoSQL"
description: "Choose the right database for a system design scenario and defend it clearly."
date: 2026-04-13
---

## Session goal

Make and defend a database choice for the URL shortener in under 2 minutes.

## Shadowing passage

> The SQL versus NoSQL question is a trade-off analysis, not a preference. For a URL shortener's redirect lookup table, I'd choose a key-value NoSQL store. The access pattern is simple: given a short code, return a long URL. That is what NoSQL is optimized for. PostgreSQL would work, but it carries relational overhead I don't need for the hot path. I'd use Cassandra for durable storage — it's designed for high write throughput and multi-region replication, with tunable consistency. For the user accounts and billing data, I'd use PostgreSQL, because that data requires complex relational queries and ACID guarantees that NoSQL doesn't provide without significant application complexity. The principle I apply: match the database to the access pattern of the data, not to the technology your team is already comfortable with. One important thing I've learned from building production systems: the most dangerous database migration is the one you have to do urgently because your original choice can't scale. Choose carefully, and test your assumptions early.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| hot path | [Nghe →](https://youglish.com/pronounce/hot%20path/english) | the performance-critical execution path — design it separately |
| tunable consistency | [Nghe →](https://youglish.com/pronounce/tunable%20consistency/english) | Cassandra's model — per-query consistency level |
| match the access pattern | [Nghe →](https://youglish.com/pronounce/match%20the%20access%20pattern/english) | the right criterion for database selection |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Give a scenario where you'd choose MongoDB. Be specific about the access pattern.


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
