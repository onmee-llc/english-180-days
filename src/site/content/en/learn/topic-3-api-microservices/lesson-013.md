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

| Phrase | IPA | Note |
|--------|-----|------|
| gRPC | /ˌdʒiː ɑːr piː ˈsiː/ | Remote Procedure Call over HTTP/2 — typed contracts, binary encoding, streaming |
| service mesh | /ˈsɜːrvɪs mɛʃ/ | infrastructure layer handling service-to-service communication, auth, and observability |
| distributed tracing | /dɪˈstrɪbjʊtɪd ˈtreɪsɪŋ/ | follow a single request across multiple services — essential for debugging latency |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How would you handle schema versioning when multiple teams evolve their gRPC service independently?
