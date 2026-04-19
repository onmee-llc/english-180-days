---
title: "Day 174 — Presenting Metrics and Data Visualizations"
description: "Narrate charts, graphs, and production metrics in English — turn numbers into insights."
date: 2026-04-19
---

## Session goal

Narrate three types of data visualizations: a latency chart, a cost-over-time graph, and an error rate breakdown.

## Shadowing passage

> Numbers without narrative are just noise. My rule for presenting data in a tech talk: for every metric or chart, say three things — what it shows, what the key insight is, and what action we took or recommend. Here's how that sounds for three common LLM metrics. First, the latency chart: "This chart shows our P50 and P95 latency over 30 days. The key insight is the spike on August 12th — that's when we upgraded the model. P95 went from 3 seconds to 6 seconds. We identified that the new model had a slower time-to-first-token for long prompts. Our fix: we added prompt length classification and route prompts over 2,000 tokens to a separate, streaming-optimized endpoint. P95 is now back to 3.2 seconds." Second, the cost graph: "Daily token spend over three months. The slope increases in September — that's expected; we added three new features that use LLM calls. The anomaly is the spike in October: a developer left debug logging on, which tripled the token count per request for 48 hours. Cost logging caught it within a day." Third, error rate breakdown: "Pie chart of error types over the last month. Rate limits are 60% of errors — this is normal; we're handling them with retry. Context exceeded is 15% — this needs attention; we're investigating which prompt templates are generating oversized inputs."

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| the key insight is | [Nghe →](https://youglish.com/pronounce/the%20key%20insight%20is/english) | moves from data to meaning |
| the anomaly is | [Nghe →](https://youglish.com/pronounce/the%20anomaly%20is/english) | flags an unexpected data point |
| this needs attention | [Nghe →](https://youglish.com/pronounce/this%20needs%20attention/english) | action-oriented — identifies a gap to address |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–12** — Shadow the three metric narrations.
**Minutes 13–22** — Pull one real chart from your KPI 1 system or project. Narrate it using the three-part format: what it shows, key insight, action taken.
**Minutes 23–28** — Record your narration. Does each data point lead to an insight and an action?
**Minutes 29–30** — Note the weakest narration. Rewrite and re-deliver.

## Reflection

For Tech Talk #1: what is the one chart that best illustrates the value of your system? Prepare its narration.

## Anti-Translation Drill

Describe a trend or anomaly in your project data using only English. No numbers are too specific — specifics make it credible.

## Self-Check

- [ ] Shadowed three metric narrations
- [ ] Narrated one real chart from my project
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
