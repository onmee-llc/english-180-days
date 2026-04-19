---
title: "Day 150 — Monitoring & Observability"
description: "Describe your observability setup for an LLM system — metrics, alerts, and tools."
date: 2026-04-19
---

## Session goal

Explain your LLM monitoring stack — what you measure, what triggers an alert, and how you investigate an incident.

## Shadowing passage

> Monitoring an LLM system has two layers that traditional backend monitoring doesn't cover. The first layer is infrastructure metrics: latency, error rate, throughput — the same metrics you'd track for any HTTP service. For latency, I track P50, P95, and P99 separately. P50 tells you what a typical user experiences. P95 tells you what a slightly unlucky user experiences. P99 is where you catch long-tail issues — usually stuck connections or retries. The second layer is LLM-specific metrics: token cost per day, token cost per endpoint, error breakdown by type — rate limit, context exceeded, content policy, provider error — and output quality metrics from your automated checks. I use LangSmith for request-level tracing: every LLM call is logged with its prompt, response, latency, and token usage. For infrastructure metrics, Datadog or Prometheus plus Grafana. Alerting policy: I set three alert levels. Page immediately for error rate above two percent over five minutes. Page within thirty minutes for daily token spend above the budget threshold. Notify the team channel for latency P95 above five seconds. For incident investigation, the flow is: check the error rate dashboard first — is it one endpoint or all? Check LangSmith traces for the failing requests — is it a prompt issue or a provider issue? Check the provider's status page — is it on our side or theirs? That three-step flow resolves about eighty percent of LLM incidents in under fifteen minutes.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| long-tail issues | [Nghe →](https://youglish.com/pronounce/long-tail/english) | rare but severe problems — visible only at P99 |
| request-level tracing | [Nghe →](https://youglish.com/pronounce/request-level%20tracing/english) | logging every individual request with full context |
| incident investigation | [Nghe →](https://youglish.com/pronounce/incident%20investigation/english) | the process of finding the root cause of a production problem |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What is your current monitoring gap in KPI 1? Name one metric you're not tracking yet.

## Anti-Translation Drill — Think in English *(5 min)*

Explain your KPI 1 monitoring setup in English. Use: "I track…", "I alert when…", "I investigate by…"

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
