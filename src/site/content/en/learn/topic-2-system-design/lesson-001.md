---
title: "Day 15 — The 5-Step Design Framework"
description: "Walk through the design framework for a URL shortener — step by step."
date: 2026-04-13
---

## Session goal

Apply all 5 steps to URL shortener design in one fluent verbal walkthrough.

## Shadowing passage

> Let me walk through this systematically. Step one: clarify requirements. Functional: create a short URL from a long one, redirect to the original, optionally track click analytics. Non-functional: high availability, redirect latency under fifty milliseconds p95, read-heavy workload — many more reads than writes. Step two: estimate scale. One hundred million redirects per day, roughly twelve hundred per second at peak. Storage: one hundred million URLs at two hundred bytes each — about twenty gigabytes, very manageable. Step three: high-level design. A write service to generate and store short codes, a read service for lookup and redirect, a key-value store for fast reads, and a CDN for global distribution. Step four: deep dive on storage. Redis for caching hot URLs, Cassandra for durable storage. Step five: trade-offs. I'd choose eventual consistency on reads to maximize availability — if a user's click count is two seconds stale, that is acceptable. The key insight with any design question is to make your reasoning visible at every step.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| clarify requirements | /ˈklærɪfaɪ ðə rɪˈkwaɪrəmənts/ | always first — signals senior thinking |
| read-heavy workload | /riːd ˈhɛvi ˈwɜːrkloʊd/ | characterize the access pattern before designing |
| make your reasoning visible | /meɪk jɔːr ˈriːzənɪŋ ˈvɪzɪbəl/ | the examiner wants to hear your thinking, not just your answer |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Can you apply this same 5-step framework to a ride-sharing app without notes?


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
