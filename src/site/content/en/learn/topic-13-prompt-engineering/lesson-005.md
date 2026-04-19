---
title: "Day 159 — Few-Shot Examples"
description: "Design and explain few-shot examples — when to use them and how to pick good examples."
date: 2026-04-19
---

## Session goal

Explain few-shot prompting — why examples work, how to choose them, and the common mistakes.

## Shadowing passage

> Few-shot prompting is the technique of including 2 to 5 input-output examples in the prompt before the actual task. The model learns the expected pattern from the examples and applies it to the new input. It sounds simple, but the quality of the examples determines the quality of the outputs. There are three principles I follow. First, examples should be representative of the common case, not the edge case. If your production data is 90% short customer messages, don't include only long, complex examples — the model will skew toward the example distribution, not toward reality. Second, examples should be correct. I've seen prompts with subtly wrong examples — the model learned the error and reproduced it consistently. Every example should be reviewed by someone who knows the expected output format. Third, examples should be diverse enough to prevent the model from overfitting to a narrow pattern. If all your examples use the same phrasing, the model may require that phrasing in the input to produce correct output. Vary sentence structure, length, and vocabulary. And one counterintuitive point: more examples is not always better. Three well-chosen examples often outperform ten mediocre ones. Start with three, measure on your eval set, and add more only if the first three aren't enough.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| example distribution | [Nghe →](https://youglish.com/pronounce/example%20distribution/english) | the statistical profile of your few-shot examples |
| overfitting | [Nghe →](https://youglish.com/pronounce/overfitting/english) | model performs well on examples but poorly on new inputs |
| representative examples | [Nghe →](https://youglish.com/pronounce/representative%20examples/english) | examples that reflect the real distribution of inputs |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

Find one prompt in your codebase that uses few-shot examples. Are the examples representative? Diverse? Correct?

## Anti-Translation Drill

Explain the three principles of good few-shot examples from memory. English only.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
