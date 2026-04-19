---
title: "Day 176 — Telling the 'What Went Wrong' Story"
description: "Structure and deliver a production failure story — the core of Tech Talk #2."
date: 2026-04-19
---

## Session goal

Write and deliver one specific "what went wrong" story from your KPI 1 project in 3 minutes.

## Shadowing passage

> A failure story is the most credible part of any tech talk — and the most feared. People fear it because they think failure reflects badly on them. The opposite is true: engineers who can tell a specific, structured failure story are perceived as more experienced and more trustworthy than engineers who claim everything went perfectly. The structure I use has four parts. First, the setup: what was the state of the system before the incident? What were we doing? Second, the trigger: what specific event caused the failure? Not "we had a bug" — name the exact component, the exact condition. Third, the impact: what actually happened? User-visible impact, not just technical details. Fourth, the resolution: what did we change, and what were the results? Here's an example. Setup: we had been running the document Q&A system for three weeks with no major issues. We were at 500 queries per day and cost was within budget. Trigger: we added conversation history persistence — keeping the last 20 messages in the context. We didn't recalculate the token budget with history included. Impact: context window exceeded errors jumped from 0.3% to 8% on day one. Cost increased 60%. Users got blank responses. Resolution: we added context window budget validation in the prompt construction step and capped history at 10 messages. Error rate returned to 0.3% within 24 hours.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| the trigger was | [Nghe →](https://youglish.com/pronounce/the%20trigger%20was/english) | the specific event that caused the failure |
| jumped from X to Y | [Nghe →](https://youglish.com/pronounce/jumped%20from/english) | sharp increase — impactful metric description |
| returned to baseline | [Nghe →](https://youglish.com/pronounce/returned%20to%20baseline/english) | the system recovered to its normal state |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–12** — Shadow the passage.
**Minutes 13–22** — Write your own failure story using the four-part structure. Your KPI 1 project. Real incident.
**Minutes 23–28** — Record your story. Under 3 minutes.
**Minutes 29–30** — Listen back. Is the trigger specific? Is the impact quantified?

## Reflection

This is the centerpiece of Tech Talk #2. Refine it until the trigger and impact are specific enough that a new engineer could reproduce the conditions.

## Anti-Translation Drill

Deliver your failure story from memory. English only. Four parts: setup, trigger, impact, resolution.

## Self-Check

- [ ] Shadowed the passage
- [ ] Wrote and recorded my own failure story
- [ ] Trigger and impact are specific and quantified
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
