---
title: "Day 26 — Observability"
description: "Logs, metrics, and traces — what each answers and when to reach for which."
date: 2026-04-13
---

## Session goal

Design the observability stack for a production AI pipeline service.

## Shadowing passage

> Observability is the ability to understand what is happening inside a system from the outside. The three pillars answer different questions. Logs tell you what happened — individual events, errors, and decisions. They are high-resolution but expensive to query at scale. For an AI pipeline, I log every model call with its prompt hash, token count, latency, and output validation result. Metrics tell you the shape of what is happening: request rate, error rate, latency percentiles, queue depth. They are cheap to store and fast to query, which makes them right for dashboards and alerting. I track p50, p95, and p99 latency separately — the p99 catches tail latency problems that averages hide entirely. Distributed traces tell you how a request moved across services: from the API gateway through orchestration into the LLM call and back. They are essential for diagnosing latency in distributed architectures. In OpenTelemetry, every operation gets a trace ID that propagates through all downstream calls — so when I investigate a slow request, I can see exactly which component added latency and why. The most dangerous place to be operationally is a system with good metrics but no traces: you can see something is slow, but you cannot find where.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| three pillars | /θriː ˈpɪlərz/ | logs, metrics, traces — know all three, explain how they differ |
| tail latency | /teɪl ˈleɪtənsi/ | slow outlier requests — p99 reveals what averages hide |
| trace ID propagates | /treɪs aɪˈdiː ˈprɒpəɡeɪts/ | how distributed tracing links service calls together |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Which tool would you reach for first if response time doubled overnight? Why?


## Anti-Translation Drill — Listening First *(5 min)*

Close the text. Recall today's shadowing passage from memory only.

1. Say the **main idea** in one English sentence out loud.
2. Say **one specific detail** you remember.
3. If you blank out — do NOT open the text. Describe what you vaguely remember using simple English.

> Goal: Build the habit of processing English without reading — ears and memory only.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
