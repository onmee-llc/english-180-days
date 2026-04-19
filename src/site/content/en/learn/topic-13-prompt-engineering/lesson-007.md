---
title: "Day 161 — Over-Refusal and Context Window Limits"
description: "Explain over-refusal behavior and context window limit errors — and how to fix both."
date: 2026-04-19
---

## Session goal

Describe over-refusal clearly and give a concrete fix. Then explain context window limit errors and your mitigation.

## Shadowing passage

> Two failure modes that aren't about wrong answers but about the model not answering at all. The first is over-refusal. The model refuses a legitimate request because the input superficially resembles content that is restricted. For example, a medical information assistant asking the model to "describe the symptoms and treatment of opioid overdose" might get refused because the topic pattern-matches to "drug misuse" in the model's safety training. The fix is professional context in the system prompt: "You are a medical information assistant serving licensed healthcare professionals in a clinical setting. Your responses should be accurate, evidence-based, and appropriate for medical professionals." That context shifts the model's interpretation of the same request from ambiguous to clearly professional. The second failure mode is context window limit exceeded — the prompt is too long. This is more predictable: count tokens before sending, and implement a truncation or summarization strategy before the limit is hit. For multi-turn conversations, I keep a rolling window of the last N messages and summarize anything older. The summary is prepended to the conversation as a "Prior context" block. For RAG, I limit retrieved chunks to a token budget and reject any request whose total token count would exceed the model's limit. Both of these are hard failures in production — the user gets no response. I treat them as P2 bugs: investigate within twenty-four hours, fix within forty-eight.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| over-refusal | [Nghe →](https://youglish.com/pronounce/over-refusal/english) | model refuses a legitimate request incorrectly |
| professional context | [Nghe →](https://youglish.com/pronounce/professional%20context/english) | framing in the system prompt that clarifies legitimate use |
| rolling window | [Nghe →](https://youglish.com/pronounce/rolling%20window/english) | keeping only the most recent N items in memory |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

Have you encountered over-refusal in your project? What was the context, and how did you fix it?

## Anti-Translation Drill

Explain the over-refusal fix in 30 seconds. Then explain the context window limit mitigation in 30 seconds.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
