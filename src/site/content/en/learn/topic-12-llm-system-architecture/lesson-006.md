---
title: "Day 146 — Context Window Management"
description: "Explain how you manage context window limits in production — without breaking conversations or losing important information."
date: 2026-04-19
---

## Session goal

Describe your approach to context window management — what strategies you use and when you choose each one.

## Shadowing passage

> Every LLM has a context window limit — the maximum number of tokens it can process in a single request, covering both input and output. For GPT-4o, that's 128,000 tokens. For Claude 3.5 Sonnet, 200,000. That sounds enormous, but in practice, multi-turn conversations, RAG document chunks, system prompts, and tool call histories consume context faster than you'd expect. My approach to context management has three tiers. First, prevention: count tokens before sending and reject inputs that would exceed the budget. This gives a clean error that the application can handle gracefully. Second, truncation: for multi-turn conversations, keep the system prompt and the most recent N messages, and drop the oldest ones. Simple, fast, and works for most chat use cases. Third, summarization: instead of dropping old messages, summarize them into a compact representation and prepend it to the conversation. This preserves long-term context at the cost of one additional LLM call. I use summarization for support tickets and document Q&A — tasks where full history matters. I use truncation for casual chat. The mistake I see most often is teams that don't test with long conversations in staging. Context window errors only appear when a conversation is long enough to hit the limit — which might be hour 3 of a customer support session, not hour 1. Test with synthetic long conversations before going to production.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| context window limit | [Nghe →](https://youglish.com/pronounce/context%20window%20limit/english) | the maximum tokens a model can process in one call |
| consume context | [Nghe →](https://youglish.com/pronounce/consume%20context/english) | token usage that reduces available space |
| compact representation | [Nghe →](https://youglish.com/pronounce/compact%20representation/english) | summarized version that preserves key information |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Which context management strategy does your KPI 1 use case need? Explain your reasoning out loud.

## Anti-Translation Drill — Think in English *(5 min)*

Pick **one key phrase** from today's table. Explain what it means using **only English**. Then use it in a sentence about a real system you've worked on.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
