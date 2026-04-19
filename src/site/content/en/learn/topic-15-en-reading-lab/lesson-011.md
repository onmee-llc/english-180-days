---
title: "Day 193 — Caching Strategies (ByteByteGo)"
description: "Reading Lab: Performance and infrastructure vocabulary from ByteByteGo."
date: 2026-04-19
---

## Session goal

Build caching vocabulary. Apply it immediately to LLM cost and latency optimization in your KPI 1 work.

## Article

**Source:** ByteByteGo Blog
**Topic:** Caching strategies — cache-aside, read-through, write-back, write-through, TTL
**Find it at:** [blog.bytebytego.com](https://blog.bytebytego.com/) — search "caching strategies"

---

## Part 1 — Skim (5 minutes)

Read headings, diagrams, and first sentences. Answer:
> "What are the main caching patterns and when does each one apply?"

---

## Part 2 — Vocabulary extraction (10 minutes)

| Term | Context sentence from the article | Definition (in English) |
|------|----------------------------------|------------------------|
|      |                                  |                        |
|      |                                  |                        |
|      |                                  |                        |
|      |                                  |                        |
|      |                                  |                        |

**Starter vocabulary:**

| Term | Definition |
|------|-----------|
| cache-aside (lazy loading) | the application loads data into the cache on miss; the cache doesn't interact with the database directly |
| read-through | the cache handles all reads and fetches from the database on miss |
| write-through | writes go to both cache and database synchronously |
| write-back (write-behind) | writes go to the cache first; the database is updated asynchronously |
| eviction policy | the rule for deciding which items to remove when the cache is full (LRU, LFU, FIFO) |
| LRU (Least Recently Used) | evicts the item that was least recently accessed |
| cache stampede | when many cache misses occur simultaneously, overwhelming the origin |
| semantic caching | caching LLM responses based on the meaning of the prompt, not the exact text |

---

## Part 3 — One-sentence summary (5 minutes)

Write one sentence summarizing the trade-off between write-through and write-back caching. Under 30 words.

---

## LLM-specific connection

Semantic caching is specifically useful for LLM applications — it caches responses for semantically similar prompts. Describe in one English sentence how semantic caching would benefit your KPI 1 system.

"Semantic caching would reduce LLM costs in our system because _____."

## Anti-Translation Drill

Explain cache-aside pattern to a backend engineer who hasn't used it before. English only. 60 seconds.

## Self-Check

- [ ] Skim completed within 5 minutes
- [ ] 5–8 vocabulary terms extracted
- [ ] One-sentence summary written
- [ ] Semantic caching connection written for KPI 1
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
