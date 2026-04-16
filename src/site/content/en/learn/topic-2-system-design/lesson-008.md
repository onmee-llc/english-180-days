---
title: "Day 22 — API Gateway Pattern"
description: "Explain what an API gateway does and when it earns its operational complexity."
date: 2026-04-13
---

## Session goal

Design the API gateway layer for a multi-service backend.

## Shadowing passage

> An API gateway is the single entry point for all client requests in a microservices architecture. It handles cross-cutting concerns that every service would otherwise need to implement independently: authentication, rate limiting, request routing, and sometimes response aggregation. Without a gateway, you get duplicated auth logic, inconsistent rate limiting enforcement, and a proliferation of client-facing endpoints that are hard to evolve. The gateway centralizes all of that. Routing at the gateway can be simple path-based — slash images goes to the image service — or sophisticated, supporting canary releases where five percent of traffic routes to a new service version. Rate limiting typically uses a token bucket algorithm per consumer key: each API key gets a fixed token allowance per window, each request costs one token, and you get a 429 when the bucket empties. One caution: the gateway is itself a component that must be highly available and low latency. It adds one network hop to every request. Design it to do as little computation as possible — validation, routing, and maybe token verification — and push business logic into the services behind it.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| cross-cutting concerns | [Nghe →](https://youglish.com/pronounce/cross-cutting%20concerns/english) | shared functionality across services — canonical engineering term |
| canary release | [Nghe →](https://youglish.com/pronounce/canary%20release/english) | gradual traffic shift to new version — reduces deployment risk |
| token bucket algorithm | [Nghe →](https://youglish.com/pronounce/token%20bucket%20algorithm/english) | standard rate limiting — explain the mechanics |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What is the latency cost of adding an API gateway? When is that cost not worth paying?


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
