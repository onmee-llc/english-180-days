---
title: "Day 17 — Caching Strategy"
description: "Cache-aside, TTL decisions, and the hard problem of cache invalidation."
date: 2026-04-13
---

## Session goal

Design and explain a caching strategy for a URL shortener in 90 seconds.

## Shadowing passage

> For a URL shortener, the access pattern is highly skewed — a small percentage of URLs gets the vast majority of traffic. That makes caching extremely effective. My approach is cache-aside: when a redirect request arrives, check Redis first. Cache hit: return immediately, sub-millisecond. Cache miss: fetch from the database, return to the user, store the result in Redis with a TTL. I'd set TTL to twenty-four hours for most URLs, shorter for URLs with real-time analytics requirements. The eviction policy is LRU — keep the hottest URLs in memory. The hard edge case: when a user deletes a URL, the cache entry must be actively invalidated, or users see a working redirect for up to twenty-four hours after deletion. I'd push a cache invalidation event through a pub-sub channel — the cache layer subscribes and evicts on delete events. Cache invalidation is famously the second hardest problem in computer science, and the URL shortener case is a clean illustration of why.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| cache-aside | /kæʃ əˈsaɪd/ | the most common caching pattern — lazy population on miss |
| access pattern is skewed | /ˈækses ˈpætərn ɪz skjuːd/ | Pareto distribution — justify why caching is effective here |
| active invalidation | /ˈæktɪv ɪnˌvælɪˈdeɪʃən/ | push the eviction — don't rely on TTL expiry alone |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Explain cache invalidation — the actual mechanics — in 30 seconds without notes.
