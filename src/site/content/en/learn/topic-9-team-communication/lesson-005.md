---
title: "Day 117 — Proposing a Technical Solution"
description: "Present your solution idea to the team clearly: problem, options, recommendation, trade-offs."
date: 2026-04-13
---

## Session goal

Structure a 3-minute verbal proposal that the team can give feedback on immediately.

## Shadowing passage

> I want to propose an approach for the monitoring gap we discussed in yesterday's retro. Here is the problem: we have no visibility into the end-to-end latency of our content generation pipeline. We know each service's internal metrics, but we cannot currently see how long a request takes from user submission to final output delivery. I considered three options. Option one: add custom timing logs at each stage and aggregate them in our existing Grafana setup. Low effort, no new infrastructure, but the data is delayed by our log aggregation latency — not real-time. Option two: implement distributed tracing using OpenTelemetry with Jaeger as the backend. Accurate, real-time, industry standard. The cost is a week of implementation time and a new infrastructure component to maintain. Option three: use our existing Datadog APM — we are already paying for it, and they have native support for distributed tracing. Fastest to implement, costs nothing extra. My recommendation is option three. We have the tool, we are paying for it, and we can have something working in two days. I would only revisit this if we find DataDog's cardinality limits are too restrictive for our scale. Does anyone have concerns about this approach?

---

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| visibility into | [Nghe →](https://youglish.com/pronounce/visibility%20into/english) | the ability to observe what is happening inside a system |
| low effort | [Nghe →](https://youglish.com/pronounce/low%20effort/english) | quick to implement — use in trade-off language |
| does anyone have concerns | [Nghe →](https://youglish.com/pronounce/does%20anyone%20have%20concerns/english) | invite pushback — signals you're not attached to your own idea |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Did your proposal include: the problem, options considered, recommendation, and a clear ask?


## Anti-Translation Drill — Own Words *(5 min)*

Retell today's shadowing passage in **your own words** — do NOT repeat the original phrasing.

- Paraphrase the entire content as if explaining to a colleague who missed the meeting.
- Speak for **60–90 seconds**.
- Use different sentence structures, different transitions, different examples if possible.
- If you catch yourself quoting the passage word-for-word, stop and rephrase.

> Goal: Full integration — you own the knowledge when you can express it freely, not just repeat it.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
