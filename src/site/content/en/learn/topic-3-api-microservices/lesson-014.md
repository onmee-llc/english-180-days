---
title: "Day 42 — Week 2 Review — API Architecture"
description: "Consolidate everything: present your complete API architecture in one 5-minute summary."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> Let me give you the complete picture of the API architecture. The client layer communicates only with the API gateway. The gateway handles authentication, rate limiting, request routing, and response caching. Behind it, microservices own their bounded contexts and communicate asynchronously through Kafka for event-driven flows and synchronously through gRPC for request-response patterns that need immediate answers. Each service has its own database — no shared schemas — which is the core of what makes this independently deployable. The event bus provides decoupling. When a user completes an action, the user service publishes a domain event. Downstream services subscribe: the notification service sends emails, the analytics service records the event, the recommendation service updates the user model. None of them need to know about each other. Failure isolation is a first-class concern. Each service has its own deployment pipeline, its own error budget, and its own on-call rotation. A Redis cache at the API gateway absorbs read traffic for hot resources. For writes, commands go through a queue with exactly-once semantics using idempotency keys. This architecture scales horizontally at every layer.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| bounded context | /ˈbaʊndɪd ˈkɒntɛkst/ | clear boundary where one model applies — core DDD concept for microservice ownership |
| idempotency key | /aɪˈdɛmpətensi kiː/ | client-generated token ensuring duplicate requests have the same effect as one |
| exactly-once semantics | /ɪɡˈzæktli wʌns sɪˈmæntɪks/ | guarantee that a message is processed exactly one time, even under retries |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What failure scenario most concerns you in an event-driven architecture, and how would you mitigate it?


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
