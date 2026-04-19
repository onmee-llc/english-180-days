---
title: "Day 164 — Testing and Evaluating Prompts"
description: "Explain how to build an eval set and measure prompt quality systematically."
date: 2026-04-19
---

## Session goal

Describe a complete prompt evaluation workflow — from building the eval set to running regression tests.

## Shadowing passage

> Testing prompts is not optional in a production system. Without an eval set, you can't know whether a prompt change improved things or made them worse — you're just guessing. Here's the workflow I use. Step one: build the eval set before you start optimizing. Pick 30 to 50 representative inputs and write the expected output for each one. The expected outputs should be reviewed by someone who knows the domain — not just the engineer who wrote the prompt. Step two: measure the baseline. Run all your eval inputs against the current prompt and score each output. I use three dimensions: format (does the output match the expected schema?), accuracy (is the content correct?), and tone (does it match the expected style?). Step three: change one thing at a time. If you change the system prompt and the few-shot examples in the same iteration, you won't know which change caused the result. Step four: run the full eval set after every change. Look for regressions — cases where the new prompt scores lower than the baseline on specific inputs. A prompt that improves the average score but regresses on ten edge cases may be worse overall. Step five: automate. Once you have the eval set, use LangSmith or RAGAS to run it automatically on every pull request. This is the difference between a maintainable prompt system and one that degrades silently in production.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| representative inputs | [Nghe →](https://youglish.com/pronounce/representative%20inputs/english) | inputs that reflect the real distribution of production data |
| baseline measurement | [Nghe →](https://youglish.com/pronounce/baseline%20measurement/english) | the initial score before any changes are made |
| regresses on edge cases | [Nghe →](https://youglish.com/pronounce/regresses/english) | performs worse on specific inputs compared to the previous version |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

Does your KPI 2 Best Practices Guide include a section on prompt evaluation? Draft the section outline now.

## Anti-Translation Drill

Describe the five-step eval workflow from memory. Use "step one… step two…" structure.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
