---
title: "Day 160 — Handling Hallucination"
description: "Explain what hallucination is and how you mitigate it in a production system."
date: 2026-04-19
---

## Session goal

Describe hallucination accurately and present a concrete mitigation strategy from your own work.

## Shadowing passage

> Hallucination is the most misunderstood failure mode in LLM systems. It's not a bug — it's a fundamental property of how language models work. The model generates the most statistically likely continuation of the text, and sometimes the most statistically likely text is confidently wrong. Knowing this, my approach is mitigation, not elimination. I use three layers. Layer one: grounding. Wherever possible, I give the model the facts before asking it to reason about them. In a RAG system, the model receives the retrieved document sections and is instructed to base its answer on those sections only. If the answer isn't in the provided context, it should say so. Layer two: uncertainty expression. I include an instruction in the system prompt: "If you are not confident about a specific fact, say so clearly. Do not fabricate information to appear more helpful." This doesn't eliminate hallucination, but it surfaces uncertainty that would otherwise be hidden. Layer three: automated validation. For structured outputs, I validate every field against a known-good reference when possible. For factual claims, I use a separate LLM call — LLM-as-judge — to check whether the response contradicts the source documents. The combination of these three layers reduces hallucination significantly. But I'm always honest with stakeholders: LLM systems require ongoing monitoring and periodic human review. Any system that claims to have zero hallucination is not running the right checks.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| fundamental property | [Nghe →](https://youglish.com/pronounce/fundamental%20property/english) | inherent characteristic — not something you can remove |
| surfaces uncertainty | [Nghe →](https://youglish.com/pronounce/surfaces%20uncertainty/english) | makes hidden problems visible |
| ongoing monitoring | [Nghe →](https://youglish.com/pronounce/ongoing%20monitoring/english) | continuous observation — not a one-time check |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

What is your current hallucination mitigation strategy for KPI 1? Name one gap.

## Anti-Translation Drill

Explain the three mitigation layers from memory. Use "layer one… layer two… layer three…"

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
