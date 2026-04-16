---
title: "Day 57 — Fine-tuning vs Prompt Engineering"
description: "When to invest in fine-tuning; when to iterate on prompts instead."
date: 2026-04-13
---

## Session goal

Make a clear recommendation: fine-tune or prompt engineer for a given use case.

## Shadowing passage

> The decision between fine-tuning and prompt engineering is a cost-benefit trade-off, and for most use cases the answer is to start with prompt engineering. A well-designed prompt with few-shot examples can get you eighty to ninety percent of the way to the quality of a fine-tuned model for the same task, at a fraction of the cost and time investment. Fine-tuning makes sense in three scenarios. First, when consistent output format or style is critical and prompt engineering still produces variation — fine-tuning bakes format preferences into the model weights. Second, when latency or cost matters — a fine-tuned smaller model can match the quality of a larger base model at a fraction of the inference cost. Third, when the base model lacks domain-specific vocabulary or reasoning patterns — fine-tuning on proprietary domain data improves accuracy in specialized technical domains. My practical workflow: start with GPT-4 or Gemini Pro and prompt engineering. Establish a quality baseline and evaluation set. If quality is insufficient, first try more sophisticated prompting — chain of thought, structured formatting, better few-shot examples. If quality is still insufficient after several iterations, evaluate fine-tuning on a smaller model against the quality benchmark. Fine-tuning requires clean, labeled training data at minimum a few hundred examples. Data quality dominates over quantity.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| inference cost | [Nghe →](https://youglish.com/pronounce/inference%20cost/english) | cost per model call — scales with model size, critical at volume |
| bake into model weights | [Nghe →](https://youglish.com/pronounce/bake%20into%20model%20weights/english) | fine-tuning stores behavior in parameters — not in the prompt at inference time |
| quality baseline | [Nghe →](https://youglish.com/pronounce/quality%20baseline/english) | your current system's score on the eval set — the floor to beat |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

At what monthly inference volume would fine-tuning a smaller model break even on cost?


## Anti-Translation Drill — Think in English *(5 min)*

Pick **one key phrase** from today's table. Explain what it means using **only English**.

- No Vietnamese. No dictionary.
- If you don't know a word, describe it: *"It's when you…"* / *"It's similar to…"* / *"The opposite would be…"*
- Then use the phrase in a new sentence about your own experience.

> Goal: Train circumlocution — the skill of explaining anything without knowing the exact word. This is what fluent speakers actually do.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
