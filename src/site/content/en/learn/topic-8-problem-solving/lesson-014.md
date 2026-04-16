---
title: "Day 112 — Week 2 Review — Problem Solving"
description: "Present your complete problem-solving framework for system design, debugging, and technical decisions."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> Let me share the mental framework I use to solve technical problems under pressure. There are three categories of problems: system design problems, debugging problems, and decision problems. Each has a different approach. For system design problems, I start with requirements. Functional requirements first — what does it need to do? Non-functional requirements second — scale, latency, consistency guarantees? I translate scale into numbers — requests per second, data volume, read-write ratio. Only after that do I start drawing boxes. I explain my reasoning as I go: 'I'm choosing Postgres here because the access pattern is relational and we don't need horizontal sharding yet.' For debugging problems, I follow a consistent sequence: scope the blast radius, correlate with recent changes, read the actual error, form a hypothesis, find the smallest test to validate it, fix and verify. I never skip steps — in production, assumptions kill you. For decision problems — technology choices, architecture trade-offs — I use a decision matrix. List options, list criteria — correctness, operational complexity, team familiarity, cost. Weight and score. The matrix does two things: it surfaces the answer and it documents the reasoning for anyone who questions the decision later. The most important skill isn't knowing the right answer — it's knowing how to find it systematically when you don't.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| decision matrix | [Nghe →](https://youglish.com/pronounce/decision%20matrix/english) | score options against weighted criteria — makes trade-offs explicit and decisions defensible |
| non-functional requirements | [Nghe →](https://youglish.com/pronounce/non-functional%20requirements/english) | performance, scalability, reliability constraints — the hard part of system design |
| validate a hypothesis | [Nghe →](https://youglish.com/pronounce/validate%20a%20hypothesis/english) | find the smallest thing you can test to prove or disprove your theory — scientific debugging |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What framework do you actually use when debugging? How does it differ from the one in this passage?


## Anti-Translation Drill — Interview Mode *(5 min)*

Someone just asked you the Reflection question in a **real interview**. Answer now.

- You have **60 seconds**. No pauses longer than 3 seconds.
- Fill gaps with: *"Let me think about that…"* / *"The way I see it…"* / *"To give you a concrete example…"*
- **Record this answer** separately from your shadowing recording.
- Play it back. Did you sound like someone they'd hire?

> Goal: Simulate interview pressure. The ability to speak under pressure without translating is what separates "good English" from "interview-ready English".

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
