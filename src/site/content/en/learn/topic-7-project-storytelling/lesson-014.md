---
title: "Day 90 — Week 2 Review — Full STAR Story"
description: "Deliver a complete 3-minute project story covering situation, challenge, decision, outcome, and learning."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> I'll tell you about the most technically challenging project of my career. The situation: our fintech platform was processing transactions through a monolithic service that was becoming a reliability bottleneck. At peak load, a single slow database query could block thousands of transactions. The task: extract the transaction orchestration layer into an independent service that could scale horizontally and fail independently. The challenge wasn't technical — it was risk. Transactions are money. Any data inconsistency had immediate user impact and regulatory implications. My approach: I designed a three-phase migration. Phase one was read-only shadow mode. The new service ran in parallel, receiving the same events, but its outputs were discarded. We compared its decisions against the production system for two weeks. Phase two was soft launch. The new service made real decisions for 1 percent of traffic, with automatic fallback to the old system if any inconsistency was detected. Phase three was full cutover with a two-week parallel run. The outcome: we reduced transaction failure rate from 0.8 percent to 0.1 percent. P99 latency dropped from 800ms to 120ms. The service now handles 4 million transactions per day independently. What I learned: for high-risk migrations, the investment in shadow mode and gradual rollout pays for itself many times over. Moving fast on risk-critical systems is how you end up on the front page.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| shadow mode | /ˈʃædəʊ moʊd/ | run new system in parallel without effect — validate correctness before any real impact |
| soft launch | /sɒft lɔːntʃ/ | real traffic at small percentage with automatic fallback — controlled production validation |
| P99 latency | /piː naɪntiˈnaɪn ˈleɪtənsi/ | 99th percentile response time — what 1 in 100 users experiences, your worst-case tail |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What makes a technical story compelling to a non-technical interviewer vs. a technical one? How would you adjust the same story for each?


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
