---
title: "Day 162 — Cost Optimization via Model Selection"
description: "Explain how to choose the right model for each task to optimize cost without degrading quality."
date: 2026-04-19
---

## Session goal

Describe a model selection framework — which tasks warrant expensive models and which don't.

## Shadowing passage

> The single most effective cost optimization in an LLM system is using the right model for each task. The mistake I see repeatedly is using a powerful reasoning model for every call — because it's simpler to configure and the results are good. But 'good enough with a fast model' is often better than 'excellent with an expensive model' when you're processing high volumes. Here's the framework I use. For routing and classification — "is this a billing question, a technical question, or a refund request?" — I use the cheapest, fastest model available. The task doesn't require reasoning; it requires pattern matching. For simple extraction — "pull the date, amount, and reference number from this email" — same answer: cheap and fast. For code review feedback, reasoning over multiple options, or generating nuanced customer-facing responses — here I use the powerful model, because quality differences are visible to the end user. The practical result: in a customer support system I built, about seventy percent of LLM calls go to GPT-4o Mini, and thirty percent go to GPT-4o. The cost difference between running everything on GPT-4o versus this tiered approach was about four to one. Same quality on the outputs that mattered; much lower cost on the outputs that didn't.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| tiered approach | [Nghe →](https://youglish.com/pronounce/tiered%20approach/english) | using different tools for different levels of task complexity |
| pattern matching | [Nghe →](https://youglish.com/pronounce/pattern%20matching/english) | finding a known category — doesn't require deep reasoning |
| four to one cost difference | [Nghe →](https://youglish.com/pronounce/four%20to%20one/english) | ratio — four times cheaper |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

Map your KPI 1 LLM calls: which ones need a powerful model? Which could use a cheaper one?

## Anti-Translation Drill

Explain the model selection framework in 60 seconds. Use the three task categories: routing, extraction, reasoning.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
