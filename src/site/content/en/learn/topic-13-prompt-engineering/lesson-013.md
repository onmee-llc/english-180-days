---
title: "Day 167 — Eval Framework Overview"
description: "Describe a complete LLM evaluation framework — metrics, tools, and workflow."
date: 2026-04-19
---

## Session goal

Present a complete eval framework — what you measure, what tools you use, and how you integrate it into your development workflow.

## Shadowing passage

> An eval framework for LLMs is the equivalent of a test suite for conventional code. Without it, you're deploying blind. My framework has four components. First, the eval set: 50 to 100 representative inputs with reference outputs reviewed by domain experts. This is the most important investment — a poor eval set produces misleading scores. Second, the scoring function: for each output, I score on three dimensions. Correctness: is the answer factually accurate and complete? Format: does it match the expected schema? Style: is the tone and length appropriate? Each dimension is scored 1 to 3 by an LLM judge, with explicit criteria in the judge prompt. Third, the baseline: I run the full eval set on the current prompt and save the scores. Every future change is compared against this baseline. A change is only approved if it improves correctness without regressing on format or style. Fourth, automation: the eval runs on every pull request via CI/CD. If a change causes the average correctness score to drop by more than 0.1 points, the PR is blocked. For the tooling, I use LangSmith for prompt management and evaluation storage, and RAGAS for RAG-specific metrics: context relevancy, answer faithfulness, and answer relevancy. These three RAGAS metrics are particularly useful for catching cases where the retrieval is good but the generation is wrong, or vice versa.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| deploy blind | [Nghe →](https://youglish.com/pronounce/deploy%20blind/english) | releasing changes without measurement — dangerous |
| reference outputs | [Nghe →](https://youglish.com/pronounce/reference%20outputs/english) | the expected, correct answers for each eval input |
| context relevancy | [Nghe →](https://youglish.com/pronounce/context%20relevancy/english) | RAGAS metric: are the retrieved chunks relevant to the question? |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

What eval framework do you have for KPI 1 today? What is the first component you would add?

## Anti-Translation Drill

Describe the four components of an eval framework from memory: eval set, scoring function, baseline, automation.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
