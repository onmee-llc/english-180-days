---
title: "Day 148 — Component Diagrams — Describing Architecture"
description: "Explain service boundaries, responsibilities, and communication patterns in an LLM system."
date: 2026-04-19
---

## Session goal

Describe the component structure of an LLM system — what each service owns and how they talk to each other.

## Shadowing passage

> The component diagram shows five services. First, the API gateway: it owns authentication, rate limiting, and routing. It doesn't know anything about LLMs — it's a pure infrastructure component. Second, the inference service: this is the core of the system. It owns prompt construction, LLM API calls, streaming management, and response post-processing. It has one well-defined interface: receive a task, return a result or an error. Third, the context service: it manages conversation history and context window budgeting. The inference service calls the context service before building each prompt. Fourth, the observability service: it receives usage events from the inference service asynchronously, writes to the analytics database, and runs alerting logic. Separating observability into its own service means a spike in logging traffic never impacts the inference latency. Fifth, the cache layer: Redis, sitting between the gateway and the inference service. The inference service checks the cache before every LLM call. Each service has a clear owner, a clear contract, and can be deployed independently. The rule I follow: if two services need to share a database to function, they're actually one service. Shared databases between services are where the architecture breaks down — you end up with hidden coupling that surfaces during incidents.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| well-defined interface | [Nghe →](https://youglish.com/pronounce/well-defined%20interface/english) | clear contract between components |
| hidden coupling | [Nghe →](https://youglish.com/pronounce/hidden%20coupling/english) | dependencies that aren't visible until something breaks |
| surfaces during incidents | [Nghe →](https://youglish.com/pronounce/surfaces%20during%20incidents/english) | problems that only appear under failure conditions |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Draw your KPI 1 component diagram. For each service, write one sentence: "This service owns X and communicates with Y via Z."

## Anti-Translation Drill — Think in English *(5 min)*

Describe your KPI 1 component diagram using only English. No Vietnamese. Use "it owns", "it communicates via", "the boundary is".

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Described my own component diagram in English
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
