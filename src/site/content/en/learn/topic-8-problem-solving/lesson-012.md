---
title: "Day 110 — Mock Problem-Solving Session"
description: "Full 15-minute simulated technical problem-solving interview."
date: 2026-04-13
---

## Session goal

Think out loud through an unfamiliar problem start to finish, scoring your own structure.

## Shadowing passage

> Today's problem: design a rate limiter for a public API with these requirements — one thousand requests per minute per user, deployed as a distributed system across ten nodes, with sub-millisecond overhead per request check. Think out loud, starting now. First, I will clarify: is one thousand requests per minute a hard limit — meaning we reject anything over — or a soft limit? Assuming hard. Second: this is distributed, so I cannot use a local in-memory counter per node. If each of ten nodes maintains its own counter, a user could make ten thousand requests per minute, one thousand per node. That means the state needs to be shared. The natural choice is Redis — fast enough, atomic increment operations, built-in TTL for key expiration. The algorithm I would use is the sliding window log or the token bucket. Sliding window log is most accurate but memory-expensive at scale. Token bucket is slightly less precise at window edges but constant memory per user. Given the sub-millisecond overhead constraint, I would choose token bucket with Redis. Implementation: on each request, call Redis EVAL with a Lua script to atomically check and decrement the token count. Lua scripts in Redis execute atomically, so there are no race conditions. The overhead is one Redis round-trip per request — typically under one millisecond on a local cluster. I would add a fallback: if Redis is unavailable, fail open with a flag, not fail closed, to avoid cascading outage.

---

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| hard limit vs soft limit | /hɑːrd ˈlɪmɪt/ | clarify this first — the answer changes the design |
| fail open | /feɪl ˈoʊpən/ | allow requests through when the limiter itself fails — avoids cascading denial |
| atomic | /əˈtɒmɪk/ | operation that cannot be interrupted — critical for correctness in concurrent systems |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Score your answer: did you clarify requirements, consider distributed constraints, and justify your choices?
