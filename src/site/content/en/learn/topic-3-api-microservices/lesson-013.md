---
title: "Day 41 — Service Mesh & gRPC"
description: "Explain service-to-service communication — gRPC, service mesh, and distributed tracing."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> Let me explain how services talk to each other in this system. We use gRPC for all internal service communication. The main reasons: it generates strongly-typed client stubs from a Protobuf schema, so teams can't accidentally break the contract. Binary encoding is about five times more compact than JSON, which matters when you have hundreds of calls per request path. Bidirectional streaming handles real-time use cases — progress events, live feed updates — without polling. All inter-service traffic flows through the service mesh. Each service has a sidecar proxy — we're using Envoy via Istio — that handles TLS termination, retry logic, circuit breaking, and distributed tracing automatically. Developers write business logic, the mesh handles reliability. For tracing, every request gets a trace ID at the API gateway. The sidecar propagates it across service calls. In Jaeger we can see the full call tree, latency at each hop, and which service introduced a bottleneck. This is how you debug distributed systems — without traces you're guessing.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| gRPC | [Nghe →](https://youglish.com/pronounce/gRPC/english) | Remote Procedure Call over HTTP/2 — typed contracts, binary encoding, streaming |
| service mesh | [Nghe →](https://youglish.com/pronounce/service%20mesh/english) | infrastructure layer handling service-to-service communication, auth, and observability |
| distributed tracing | [Nghe →](https://youglish.com/pronounce/distributed%20tracing/english) | follow a single request across multiple services — essential for debugging latency |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How would you handle schema versioning when multiple teams evolve their gRPC service independently?


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
