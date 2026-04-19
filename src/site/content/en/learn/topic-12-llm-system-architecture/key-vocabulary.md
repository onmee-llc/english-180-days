---
title: Key Vocabulary
description: Essential phrases and terms for LLM System Architecture — Design & Production.
date: 2026-04-19
---

## How to use this module

For each phrase or term:
1. Say it out loud 3 times.
2. Use it in a sentence about your own work.
3. Practice using it naturally in an answer to a practice question.

**Goal:** Zero hesitation when these words come up in a system design discussion or technical interview.

## Daily drill

Pick 3–5 phrases from this list each day. Use each one out loud in a complete sentence before moving on.

---

## Provider & Model Selection

| Phrase | Listen | Usage |
|--------|--------|-------|
| vendor lock-in | [Nghe →](https://youglish.com/pronounce/vendor%20lock-in/english) | "We abstract LLM calls to avoid vendor lock-in." |
| model tier | [Nghe →](https://youglish.com/pronounce/model%20tier/english) | "We use a fast model tier for routing and a reasoning tier for generation." |
| compliance requirements | [Nghe →](https://youglish.com/pronounce/compliance%20requirements/english) | "The provider selection was driven by data residency compliance requirements." |
| cost per token | [Nghe →](https://youglish.com/pronounce/cost%20per%20token/english) | "I calculated the cost per token for each provider before deciding." |

## API & Integration

| Phrase | Listen | Usage |
|--------|--------|-------|
| server-sent events | [Nghe →](https://youglish.com/pronounce/server-sent%20events/english) | "We stream tokens back to the client using server-sent events." |
| time-to-first-token | [Nghe →](https://youglish.com/pronounce/time-to-first-token/english) | "Our p95 time-to-first-token is under two seconds for the chat interface." |
| async event loop | [Nghe →](https://youglish.com/pronounce/async%20event%20loop/english) | "Never block the async event loop with synchronous HTTP calls." |
| context window | [Nghe →](https://youglish.com/pronounce/context%20window/english) | "We truncate older messages when the conversation exceeds the context window." |

## Reliability

| Phrase | Listen | Usage |
|--------|--------|-------|
| exponential backoff | [Nghe →](https://youglish.com/pronounce/exponential%20backoff/english) | "All LLM calls use retry with exponential backoff — one, two, then four seconds." |
| circuit breaker | [Nghe →](https://youglish.com/pronounce/circuit%20breaker/english) | "The circuit breaker opens after five consecutive failures and pauses traffic for thirty seconds." |
| fail fast | [Nghe →](https://youglish.com/pronounce/fail%20fast/english) | "If the LLM call times out, we fail fast and serve a cached fallback." |
| fallback strategy | [Nghe →](https://youglish.com/pronounce/fallback%20strategy/english) | "Our fallback strategy: retry same model, then switch to a cheaper model, then return a static response." |
| cascading failure | [Nghe →](https://youglish.com/pronounce/cascading%20failure/english) | "The circuit breaker prevents a single slow provider from causing a cascading failure." |

## Cost & Tokens

| Phrase | Listen | Usage |
|--------|--------|-------|
| token budget | [Nghe →](https://youglish.com/pronounce/token%20budget/english) | "Each request has a token budget — we reject inputs that exceed it before calling the API." |
| prompt tokens / completion tokens | [Nghe →](https://youglish.com/pronounce/prompt%20tokens/english) | "We log prompt tokens and completion tokens separately for cost attribution." |
| prompt caching | [Nghe →](https://youglish.com/pronounce/prompt%20caching/english) | "Prompt caching reduces costs significantly for identical system prompts across sessions." |
| cost per request | [Nghe →](https://youglish.com/pronounce/cost%20per%20request/english) | "The P95 cost per request dropped forty percent after we switched to the haiku model for pre-filtering." |

## Observability

| Phrase | Listen | Usage |
|--------|--------|-------|
| latency SLO | [Nghe →](https://youglish.com/pronounce/latency%20SLO/english) | "Our latency SLO is three seconds at the ninety-fifth percentile." |
| error rate | [Nghe →](https://youglish.com/pronounce/error%20rate/english) | "We alert if the error rate exceeds one percent over a five-minute window." |
| output quality gate | [Nghe →](https://youglish.com/pronounce/output%20quality%20gate/english) | "Every generated response passes through an output quality gate before delivery." |
| request tracing | [Nghe →](https://youglish.com/pronounce/request%20tracing/english) | "LangSmith gives us end-to-end request tracing for every LLM call." |

## Architecture Documentation

| Phrase | Listen | Usage |
|--------|--------|-------|
| data flow diagram | [Nghe →](https://youglish.com/pronounce/data%20flow%20diagram/english) | "The data flow diagram shows every component from client request to LLM response." |
| architecture decision record | [Nghe →](https://youglish.com/pronounce/architecture%20decision%20record/english) | "I wrote an ADR explaining why we chose Anthropic over OpenAI for this use case." |
| onboarding in thirty minutes | [Nghe →](https://youglish.com/pronounce/onboarding/english) | "The README is complete — a new engineer can onboard in thirty minutes without asking anyone." |
| defined boundary | [Nghe →](https://youglish.com/pronounce/defined%20boundary/english) | "The LLM service has a defined boundary: it owns inference, not business logic." |
