---
title: "Day 189 — Rate Limiting Patterns (ByteByteGo)"
description: "Reading Lab: API and infrastructure vocabulary from ByteByteGo."
date: 2026-04-19
---

## Session goal

Build vocabulary for API design and infrastructure protection. Reduce skim time to under 5 minutes.

## Article

**Source:** ByteByteGo Blog
**Topic:** Rate limiting strategies — token bucket, leaky bucket, fixed window, sliding window
**Find it at:** [blog.bytebytego.com](https://blog.bytebytego.com/) — search "rate limiting"

---

## Part 1 — Skim (5 minutes, strict timer)

Set a 5-minute timer. When it ends, stop reading even if you haven't finished. Answer:
> "What is the difference between token bucket and fixed window rate limiting?"

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
| token bucket | a rate limiting algorithm where tokens are added at a fixed rate; each request consumes a token |
| leaky bucket | a rate limiting algorithm that processes requests at a fixed output rate, smoothing bursts |
| fixed window counter | counts requests in a fixed time window — resets at the boundary |
| sliding window log | a more precise rate limiter that tracks timestamps of recent requests |
| burst | a temporary spike in request volume above the sustained rate |
| throttle | to deliberately slow or limit the rate of an operation |
| DDoS | Distributed Denial of Service — an attack that overwhelms a system with traffic |
| API gateway | a server that acts as entry point for API clients, often handling auth and rate limiting |

---

## Part 3 — One-sentence summary (5 minutes)

Write one sentence. Under 30 words.

---

## Connection to KPI 1

Does your LLM system call external APIs that have rate limits (e.g., OpenAI, Anthropic)? Describe your current strategy for handling those limits in one English sentence.

## Anti-Translation Drill

Explain what token bucket rate limiting is to someone who has never heard of it. English only. 60 seconds.

## Self-Check

- [ ] Skim completed within 5-minute timer
- [ ] 5–8 vocabulary terms extracted
- [ ] One-sentence summary written
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
