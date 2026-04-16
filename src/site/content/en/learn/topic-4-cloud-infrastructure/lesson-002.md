---
title: "Day 42 — Compute Options"
description: "EC2 vs Lambda vs Containers — frame the trade-off clearly."
date: 2026-04-13
---

## Session goal

Recommend the right compute option for three different workload types.

## Shadowing passage

> The compute decision comes down to three factors: workload characteristics, operational complexity budget, and cold start sensitivity. EC2 instances are the baseline: full control, persistent, predictable performance, no cold start. Right for stateful workloads, services that need specific hardware, or applications that can't tolerate even occasional latency spikes. The complexity cost is that you manage the OS, patching, capacity planning, and scaling logic. Lambda and Cloud Functions are optimal for event-driven, short-lived, infrequently-invoked tasks: image processing on upload, webhook handlers, nightly batch jobs. The advantages are zero provisioning and automatic scaling. The constraints are execution time limits and cold start latency — particularly relevant for LLM inference wrappers where the first request after a quiet period takes an extra second. Containers on managed services — Cloud Run, ECS Fargate, App Engine — are the pragmatic middle ground for most web services. You own the application container, the platform owns the OS, runtime, and scaling. You don't manage servers, but you get more control than serverless. My default for a new API: managed containers. My default for event processing: serverless. My default for stateful compute or proprietary workloads: EC2.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| cold start latency | [Nghe →](https://youglish.com/pronounce/cold%20start%20latency/english) | delay on first request after idle — serverless penalty |
| operational complexity budget | [Nghe →](https://youglish.com/pronounce/operational%20complexity%20budget/english) | how much ops overhead your team can absorb — a real constraint |
| managed containers | [Nghe →](https://youglish.com/pronounce/managed%20containers/english) | you own the app, platform owns the infrastructure — the pragmatic middle ground |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

When would you choose EC2 over Cloud Run for a stateless API? Give a specific reason.


## Anti-Translation Drill — Quick Response *(5 min)*

Re-read the Reflection question above. Now answer it — **start speaking within 3 seconds**.

- Use a filler phrase to buy time: *"That's a great question — I'd say…"* or *"Let me think… the key point is…"*
- Speak for **at least 30 seconds** without stopping.
- If you get stuck mid-sentence, do NOT pause to translate — rephrase using simpler words.

> Goal: Kill the translation pause. Native speakers don't go silent — they fill gaps and keep talking.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
