---
title: "Day 156 — Chain-of-Thought Prompting"
description: "Explain when and why chain-of-thought prompting works, with a concrete production example."
date: 2026-04-19
---

## Session goal

Describe chain-of-thought prompting clearly and give one real use case where it measurably improved accuracy.

## Shadowing passage

> Chain-of-thought prompting is one of the most well-studied techniques in the prompt engineering literature, and it's also one of the most misunderstood. The idea is simple: instead of asking the model for an answer directly, you ask it to reason through the problem step by step before giving the final answer. The instruction can be as simple as "Let's think through this step by step" added to the end of the prompt. The reason it works is that reasoning-heavy tasks — multi-step math, logical inference, diagnosis — require intermediate steps that the model can't skip without making errors. When you force the model to show its work, it catches its own mistakes in the intermediate steps. I use chain-of-thought in two scenarios. First, whenever the task requires comparing multiple options against a set of criteria — for example, "classify this support ticket and determine the correct routing based on these rules." Without CoT, the model guesses; with CoT, it evaluates each criterion in sequence and arrives at the right answer far more consistently. Second, whenever I'm debugging why a model is giving wrong answers. I add CoT to the failing prompt and read the reasoning trace. Most of the time, I can see exactly where the model's logic diverges from the correct path — and that tells me how to fix the prompt or the context.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| reasoning trace | [Nghe →](https://youglish.com/pronounce/reasoning%20trace/english) | the model's step-by-step intermediate thoughts |
| intermediate steps | [Nghe →](https://youglish.com/pronounce/intermediate%20steps/english) | the steps between the input and the final answer |
| catches its own mistakes | [Nghe →](https://youglish.com/pronounce/catches%20its%20own%20mistakes/english) | the model self-corrects during the reasoning process |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

Name one task in your KPI 1 or KPI 2 work where CoT could improve accuracy. How would you add it?

## Anti-Translation Drill

Close the text. Explain chain-of-thought to a new junior engineer using only English. Aim for 30 seconds.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
