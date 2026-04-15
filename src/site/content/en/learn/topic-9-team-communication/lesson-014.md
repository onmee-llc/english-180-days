---
title: "Day 126 — Week 2 Review — Communication Scenarios"
description: "Run through all core communication scenarios: standup, tech spec, code review, and escalation."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> Let me demonstrate each communication format a senior engineer uses daily. Standup, 60 seconds: Yesterday I finished the connection pool investigation and shipped the configuration fix. Today I'm starting the postmortem write-up and then reviewing the database query optimization PR. One blocker: I need a decision from the product team on the scope change before I can finalize the estimate — I'll chase that this morning. Tech spec summary, 90 seconds: The proposal is to add a write-through cache layer in front of the user profile service. Current P99 is 800ms, driven by a slow JOIN query. The cache would reduce database load by 70 percent and bring P99 under 100ms. Trade-offs: we take on cache invalidation complexity and a brief window of stale data on profile updates — acceptable given the use case. Implementation is 5 days. I'd like approval to proceed. Code review comment: this function handles the success case cleanly, but I want to flag the error branch — if the API returns a 429, we're not implementing backoff, we're just retrying immediately. That will make the rate limit situation worse under load. Can we add exponential backoff here before merging? Escalation: I need to flag a blocker. The third-party data provider API changed their authentication scheme without notice and deprecated the old one. All data ingestion jobs are failing. I've reached out to their support — no response yet. We're 4 hours into the outage. I need either a workaround path approved or a customer communication decision.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| scope change | /skoʊp tʃeɪndʒ/ | request that expands or shifts what was agreed — needs explicit approval, not assumption |
| write-through cache | /raɪt θruː kæʃ/ | data written to cache and database simultaneously — consistent but adds write latency |
| escalation | /ˌɛskəˈleɪʃən/ | bring a blocker to someone with authority to unblock it — do it faster than feels comfortable |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Which communication format feels least natural to you? What one thing could you practice this week to get better at it?
