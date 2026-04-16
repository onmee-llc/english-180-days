---
title: "Day 33 — API Rate Limiting"
description: "Token bucket, sliding window, and how to implement rate limiting correctly."
date: 2026-04-13
---

## Session goal

Design a rate limiting system for a public API with tiered plans.

## Shadowing passage

> Rate limiting protects your API from abuse and ensures fair resource allocation across consumers. The two main algorithms are token bucket and sliding window. Token bucket: each consumer has a fixed bucket capacity. The bucket refills at a defined rate — say, one hundred tokens per minute. Each request costs one token. If the bucket is empty, the request is rejected with a 429. This allows short bursts up to the bucket size, then throttles back to the sustained rate. Sliding window: instead of refilling, count requests in the most recent rolling window — say, the last sixty seconds. If the count exceeds the limit, reject. This gives more consistent enforcement than token bucket but doesn't permit bursts. For a tiered public API with free, pro, and enterprise plans, I combine both: per-consumer rate limits tied to their plan, enforced at the API gateway with Redis as the shared counter store. Each consumer key gets a Redis key with an expiry. On every request, increment the counter atomically with INCR and set an expiry if this is the first request in the window. Return the remaining limit in response headers so clients can back off gracefully. I always return the retry-after header when throttling.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| token bucket | /ˈtoʊkən ˈbʌkɪt/ | allows bursts up to capacity, then throttles to refill rate |
| atomic increment | /əˈtɒmɪk ˈɪŋkrɪmənt/ | Redis INCR — single operation, no race conditions |
| retry-after header | /rɪˈtraɪ ˈɑːftər ˈhɛdər/ | tell clients exactly when they can retry — good API citizenship |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What happens to your rate limiting Redis store if it goes down? Design the fallback.


## Anti-Translation Drill — Quick Response *(5 min)*

Re-read the Reflection question above. Now answer it — **start speaking within 3 seconds**.

- Use a filler phrase to buy time: *"That's a great question — I'd say…"* or *"Let me think… the key point is…"*
- Speak for **at least 30 seconds** without stopping.
- If you get stuck mid-sentence, do NOT pause to translate — rephrase using simpler words.

> Goal: Kill the translation pause. Native speakers don't go silent — they fill gaps and keep talking.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
