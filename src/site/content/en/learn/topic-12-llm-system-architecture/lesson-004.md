---
title: "Day 144 — Retry & Fallback Strategies"
description: "Explain your reliability pattern for handling LLM API failures in production."
date: 2026-04-19
---

## Session goal

Describe a concrete retry and fallback strategy — with specific numbers and reasoning, not just "we retry on error."

## Shadowing passage

> LLM API failures fall into two categories: transient and permanent. Transient failures are rate limits, network timeouts, and occasional 5xx errors from the provider — these are safe to retry. Permanent failures are invalid inputs, context length exceeded, and content policy violations — retrying these wastes money and time. My retry logic distinguishes between these two cases. For transient failures, I use exponential backoff: first retry after one second, second after two, third after four. After three retries with no success, I move to the fallback. For permanent failures, I fail immediately — no retry. The fallback has three tiers. Tier one: try the same provider's cheaper model. For example, if Claude 3.5 Sonnet fails three times, try Claude 3 Haiku with the same prompt. Tier two: try an alternate provider — OpenAI GPT-4o Mini if Anthropic is degraded. Tier three: return a deterministic fallback response — a pre-written message that tells the user the AI feature is temporarily unavailable. I document all three tiers in the architecture doc before I start coding. That way, when an incident happens at 2am, the on-call engineer doesn't have to figure out the fallback logic — it's documented, tested, and automatic.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| transient vs permanent failure | [Nghe →](https://youglish.com/pronounce/transient%20failure/english) | critical distinction for any retry strategy |
| exponential backoff | [Nghe →](https://youglish.com/pronounce/exponential%20backoff/english) | the standard pattern — know the specific delays |
| deterministic fallback | [Nghe →](https://youglish.com/pronounce/deterministic%20fallback/english) | predictable, pre-written response — not AI-generated |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What is your fallback strategy for your KPI 1 system? Write it down in English today.

## Anti-Translation Drill — Think in English *(5 min)*

Pick **one key phrase** from today's table. Explain what it means using **only English**. Then use it in a sentence about your own KPI 1 system.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
