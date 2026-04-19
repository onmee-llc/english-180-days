---
title: "Day 147 — Data Flow Diagrams"
description: "Narrate a data flow diagram out loud — the exact skill needed for system design interviews and tech talks."
date: 2026-04-19
---

## Session goal

Describe a complete LLM system data flow verbally — from user input to response delivery — without a diagram in front of you.

## Shadowing passage

> Let me walk you through the data flow of the system. A user submits a query through the web interface — that's an HTTPS POST to our API gateway. The gateway authenticates the request, validates the input size against our token budget, and routes it to the inference service. The inference service first checks the cache: if this exact prompt has been seen in the last hour and the task is deterministic, we return the cached response immediately — no LLM call needed. For a cache miss, the service builds the full prompt: system prompt plus conversation history plus retrieved context if this is a RAG call. Before sending to the LLM API, we count tokens and verify we're within budget. The LLM call goes out over HTTPS. For streaming responses, we pipe the SSE stream directly back through the inference service to the gateway, which forwards it to the client. For async tasks, we write the response to a queue and return a job ID immediately. The LLM response — along with the usage metadata — is logged asynchronously: token counts, latency, model used, endpoint, and a truncated version of the prompt for debugging. Post-processing runs on the response: format validation, content policy check, and business-rule validation. If any check fails, we either regenerate or return an error. Finally, the validated response is returned to the client.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| routes it to | [Nghe →](https://youglish.com/pronounce/routes%20it%20to/english) | directs traffic to a specific service |
| cache miss | [Nghe →](https://youglish.com/pronounce/cache%20miss/english) | the requested item is not in the cache |
| pipe the stream | [Nghe →](https://youglish.com/pronounce/pipe%20the%20stream/english) | pass a stream from one component to another |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Visualize the data flow as you read.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Draw your KPI 1 data flow diagram on paper. Then narrate it aloud without reading.

**Minutes 29–30** — Record your narration. Listen back. Is the flow clear to someone who can't see the diagram?

## Reflection

Can you narrate your data flow diagram to a non-technical stakeholder? Try it — simplify the technical terms.

## Anti-Translation Drill — Listening First *(5 min)*

Close the text. Recall today's shadowing passage from memory only. Focus on the sequence: what happens first, second, third.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Narrated my own KPI 1 data flow aloud
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
