---
title: "Day 24 — Designing for Failure"
description: "Circuit breakers, bulkheads, and graceful degradation — the resilience vocabulary."
date: 2026-04-13
---

## Session goal

Design the resilience layer for a service that calls an external LLM API.

## Shadowing passage

> When a service calls an external dependency — an LLM API, a payment processor, a third-party data feed — you have to design for that dependency's failure modes explicitly. The circuit breaker pattern is the primary tool. It wraps the external call and monitors failure rates. When errors exceed a configured threshold — say, ten failures in thirty seconds — the circuit opens, and all subsequent calls fail immediately without touching the external system. This prevents a slow or unavailable upstream from exhausting your service's thread pool and taking down unrelated functionality. After a configured timeout, the circuit enters half-open state and allows one test request through. Success closes the circuit. Failure resets the timer. The bulkhead pattern complements this: isolate external calls into separate thread pools so a stuck dependency only consumes its own allocation. For an LLM service specifically, I always implement a fallback path: if the primary model times out or errors, route to a secondary model or return a cached response. Graceful degradation means features fail partially and predictably — users see slightly reduced functionality, not a broken page.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| circuit opens | /ˈsɜːrkɪt ˈoʊpənz/ | the state transition — open means calls fail fast without touching downstream |
| cascading failures | /kæsˈkeɪdɪŋ ˈfeɪljərz/ | slow upstream causing system-wide degradation — what circuit breakers prevent |
| graceful degradation | /ˈɡreɪsfʊl ˌdɛɡrəˈdeɪʃən/ | partial functionality is better than total failure |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Describe a cascade failure that could happen in one of your current systems. Walk through it.
