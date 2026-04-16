---
title: "Day 102 — Performance Optimization"
description: "Explain how to find and fix a bottleneck: measure first, then optimize."
date: 2026-04-13
---

## Session goal

Discuss performance work with the same structure as debugging: locate, measure, improve, verify.

## Shadowing passage

> My rule for performance optimization is: measure first, optimize second. I have seen engineers spend a week optimizing something that accounted for three percent of total latency. That is a waste of time. Before writing a single line of optimization code, I profile. For a Python service that means cProfile or py-spy for CPU, and memory_profiler or tracemalloc for memory. For a database I look at EXPLAIN ANALYZE to see the actual query execution plan, not just the estimated one. Once I have the profiling data, I look for the one thing that accounts for more than 50 percent of the cost. There is almost always one thing. Fix that. Measure again. If you are still above your target, look for the next biggest contributor. Repeat. When I was optimizing a content generation pipeline last year, profiling revealed that 70 percent of total time was spent waiting for image resizing — something I had assumed was fast. Caching the resized outputs reduced end-to-end latency by 60 percent. The optimization took half an hour. The profiling it required took five minutes.

---

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| profile | [Nghe →](https://youglish.com/pronounce/profile/english) | measure where CPU or memory time is being spent |
| EXPLAIN ANALYZE | [Nghe →](https://youglish.com/pronounce/EXPLAIN%20ANALYZE/english) | PostgreSQL command to see the actual query execution plan |
| accounts for more than 50 percent | [Nghe →](https://youglish.com/pronounce/accounts%20for%20more%20than%2050%20percent/english) | look for the dominant contributor, not the minor ones |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Do you know which profiling tool you would use for YOUR language and stack?


## Anti-Translation Drill — Interview Mode *(5 min)*

Someone just asked you the Reflection question in a **real interview**. Answer now.

- You have **60 seconds**. No pauses longer than 3 seconds.
- Fill gaps with: *"Let me think about that…"* / *"The way I see it…"* / *"To give you a concrete example…"*
- **Record this answer** separately from your shadowing recording.
- Play it back. Did you sound like someone they'd hire?

> Goal: Simulate interview pressure. The ability to speak under pressure without translating is what separates "good English" from "interview-ready English".

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
