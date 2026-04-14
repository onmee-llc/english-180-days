---
title: "Day 23 — Monolith vs Microservices"
description: "When to split, when not to — a pragmatic position based on experience."
date: 2026-04-13
---

## Session goal

Make a clear, reasoned case for your default architectural starting point.

## Shadowing passage

> My default for a new product is a well-structured modular monolith. The reason isn't ideology — it's operational cost. Microservices require distributed tracing, service discovery, independent deployment pipelines, network latency budgeting between services, and handling failure modes that simply don't exist in a monolith — partial network failures, split-brain scenarios, distributed consistency problems. That complexity is only worth paying when you have specific problems the monolith cannot solve. The triggers I watch for: a component that needs to scale independently at a rate very different from the rest, a team that needs to deploy on a different cadence without coordination, or a genuinely different technology requirement — a machine learning inference service that needs Python and a GPU living next to a Go API tier. When I see those specific triggers, I extract a service. I made the mistake early in my career of starting with microservices because it felt like best practice. The operational overhead delayed the product significantly and provided no measurable benefit for about two years. That experience made me very pragmatic about architectural decisions.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| operational cost | /ˌɒpəˈreɪʃənəl kɒst/ | the real trade-off — not technology, but how much engineering time it consumes |
| partial network failures | /ˈpɑːʃəl ˈnɛtwɜːrk ˈfeɪljərz/ | distributed systems failure mode that doesn't exist in monoliths |
| very pragmatic | /ˈvɛri præɡˈmætɪk/ | experience made me practical — not dogmatic about any approach |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Argue the opposite: when microservices from day one is the right call. Build the case.
