---
title: "Day 32 — Microservices Patterns"
description: "Service discovery, circuit breakers, and saga — the three patterns every senior engineer needs."
date: 2026-04-13
---

## Session goal

Explain the three most important microservices patterns in under 3 minutes.

## Shadowing passage

> Three patterns are essential in any microservices architecture. Service discovery: as services scale horizontally, clients can't have hardcoded addresses. Service discovery allows services to register their location at startup and deregister on shutdown. Clients query the registry — or the load balancer does it transparently. Tools like Consul or Kubernetes DNS handle this. Without it, deployments become fragile coordination exercises. Circuit breaker: when a downstream service is slow or unavailable, callers will queue up waiting for responses, eventually exhausting their thread pools. A circuit breaker detects elevated failure rates and fails subsequent calls immediately, preventing the cascade. This is the difference between one service having an incident and all services having an incident. Saga pattern: distributed transactions don't work reliably across services. The saga decomposes a multi-service operation into local transactions with compensating actions on failure. Each step publishes an event to trigger the next, and failures trigger backward compensation. The key insight across all three patterns is that microservices shift complexity from the application into the infrastructure and communication layer. Understanding these patterns is what separates someone who's read about microservices from someone who's operated them.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| hardcoded addresses | /ˈhɑːrdkoʊdɪd əˈdrɛsɪz/ | static IP or hostname — breaks when services scale or move |
| cascade failure prevention | /kæsˈkeɪd ˈfeɪljər prɪˈvɛnʃən/ | the core value of circuit breakers |
| shift complexity | /ʃɪft kəmˈplɛksɪti/ | microservices move complexity to infrastructure — that's the trade-off |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Explain service discovery to someone who only knows monolithic architecture.
