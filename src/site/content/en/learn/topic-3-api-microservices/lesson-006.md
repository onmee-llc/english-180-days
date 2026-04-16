---
title: "Day 34 — gRPC vs REST"
description: "When gRPC is worth its complexity — internal microservices communication."
date: 2026-04-13
---

## Session goal

Explain when you'd choose gRPC for internal service communication and why.

## Shadowing passage

> gRPC is a high-performance remote procedure call framework built on HTTP/2 and Protocol Buffers. It offers three advantages over REST for internal service communication. First, performance: Protocol Buffers serialize data more compactly than JSON, reducing payload size by thirty to fifty percent. HTTP/2 enables multiplexing — multiple requests over a single connection — and bidirectional streaming. Second, strong typing: gRPC services define their contract in a proto file, which is the source of truth. Clients and servers generate code from the same schema, so contract violations become compile-time errors, not runtime surprises. Third, bidirectional streaming: gRPC natively supports server-side streaming, client-side streaming, and full bidirectional streaming — for use cases like real-time updates or large file transfers where REST's request-response model is awkward. The costs: gRPC requires tooling to test and debug — you lose curl and browser inspection. Browser clients need grpc-web and a proxy layer. The proto schema management adds a build step. My rule of thumb: use gRPC for high-frequency internal microservice calls where performance matters — processing pipeline steps, ML inference calls. Use REST for client-facing APIs and lower-frequency service calls where observability and simplicity matter more than raw throughput.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| Protocol Buffers | [Nghe →](https://youglish.com/pronounce/Protocol%20Buffers/english) | binary serialization format — more compact than JSON |
| bidirectional streaming | [Nghe →](https://youglish.com/pronounce/bidirectional%20streaming/english) | both client and server send messages independently over one connection |
| compile-time errors | [Nghe →](https://youglish.com/pronounce/compile-time%20errors/english) | schema violations caught before deployment — not in production |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

When is REST actually faster than gRPC? Name a real scenario.


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
