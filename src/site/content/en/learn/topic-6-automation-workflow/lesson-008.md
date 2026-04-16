---
title: "Day 72 — Monitoring and Alerting"
description: "SLIs, SLOs, and error budgets — monitoring as an engineering discipline."
date: 2026-04-13
---

## Session goal

Design the monitoring and alerting strategy for a production service.

## Shadowing passage

> Production monitoring starts with defining service level indicators — the metrics that actually matter to users. For my content scheduling SaaS, the three SLIs are: publish success rate — what percentage of scheduled posts are published within five minutes of their scheduled time — API latency — p99 response time for post creation — and availability — uptime measured as ratio of successful health check probes. Service level objectives are the targets: ninety-nine point five percent publish success rate, API p99 below five hundred milliseconds, ninety-nine point nine percent availability in any rolling thirty-day window. Error budgets follow from the SLO: if my target is ninety-nine point nine percent availability, I have an error budget of zero-point-one percent downtime monthly — about forty-three minutes. When I've consumed fifty percent of the error budget, I halt non-essential work and focus on reliability. At one hundred percent consumption, no new features ship until the budget is restored. This discipline transforms reliability from a vague goal into an engineering constraint that drives decisions. Alerting strategy: page on error budget burn rate, not individual metric thresholds. A burn rate of ten times the normal means I'll exhaust the error budget in three days — that's worth waking someone up for. A single elevated error rate that resolves in two minutes is not — that's a dashboard item for investigation, not a page.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| SLI / SLO | [Nghe →](https://youglish.com/pronounce/SLI%20%2F%20SLO/english) | service level indicator / objective — define what good looks like, then measure it |
| error budget | [Nghe →](https://youglish.com/pronounce/error%20budget/english) | allowable unreliability per window — when exhausted, reliability work takes priority |
| burn rate | [Nghe →](https://youglish.com/pronounce/burn%20rate/english) | speed at which error budget is consumed — high burn rate is the right alert trigger |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the error budget for a service with 99.9% SLO in a 30-day month?


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
