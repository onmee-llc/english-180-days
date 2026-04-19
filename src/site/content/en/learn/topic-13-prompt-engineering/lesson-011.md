---
title: "Day 165 — RAG vs Fine-Tuning"
description: "Explain when to use RAG versus fine-tuning — a common architecture decision question."
date: 2026-04-19
---

## Session goal

Describe RAG and fine-tuning clearly and explain which approach fits which use case.

## Shadowing passage

> RAG versus fine-tuning is one of the most common architecture decision questions in AI projects, and the answer is almost always RAG unless you have a very specific reason not to. Here's my framework. Use RAG when you need the model to work with information that changes over time — customer data, internal documentation, product catalogs. RAG retrieves the current data at inference time, so the model always has fresh context. Use RAG when you need citations or traceability — you can point to the exact document chunk that influenced the answer. Use RAG when you don't have enough labeled training data to fine-tune meaningfully — you need hundreds of high-quality input-output pairs at minimum, ideally thousands. Use fine-tuning when you need to change the model's behavior permanently — its tone, output format, or reasoning style — and that behavior is consistent across all tasks. Fine-tuning is expensive: compute, data labeling, evaluation infrastructure, and maintenance. Before fine-tuning, ask: can I achieve the same result with better prompt engineering? I've answered yes to that question every time so far. A well-designed system prompt with good few-shot examples covers ninety percent of the use cases people want to fine-tune for. Fine-tuning for the last ten percent requires genuine domain expertise in ML — it's not a prompt engineering problem anymore.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| at inference time | [Nghe →](https://youglish.com/pronounce/at%20inference%20time/english) | when the model is generating a response — not during training |
| traceability | [Nghe →](https://youglish.com/pronounce/traceability/english) | ability to trace back which source influenced the output |
| labeled training data | [Nghe →](https://youglish.com/pronounce/labeled%20training%20data/english) | input-output pairs reviewed and approved by humans |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

For your KPI 1 use case — RAG, fine-tuning, or prompt engineering only? Explain your decision in 60 seconds.

## Anti-Translation Drill

Explain "Use RAG when… Use fine-tuning when…" from memory. Two sentences each.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
