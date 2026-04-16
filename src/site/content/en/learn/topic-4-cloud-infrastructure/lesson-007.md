---
title: "Day 47 — Cost Optimization"
description: "Reserved instances, right-sizing, and budget alerts — the cost discipline."
date: 2026-04-13
---

## Session goal

Explain how you approach cloud cost management for a production system.

## Shadowing passage

> Cloud cost optimization is an ongoing engineering discipline, not a one-time exercise. I approach it in three tiers. First, eliminate waste. Profile resource utilization monthly: if Cloud Run services are consistently running at ten percent CPU, they're over-provisioned. If a database instance is at five percent capacity, it's the wrong instance type. Right-sizing alone typically reduces costs by twenty to thirty percent on systems that haven't been audited. Second, match purchasing to usage patterns. Workloads that run continuously — database instances, always-on API services — belong on reserved capacity. One-year or three-year reserved instances cost forty to sixty percent less than on-demand. Burst workloads — batch processing, scheduled jobs — belong on spot or preemptible instances at seventy to ninety percent discount. Third, architect for cost. This is the highest-leverage tier. Choosing Cloud Run over Kubernetes saves the cluster fixed cost entirely. Caching aggressively reduces database calls. Compressing payloads reduces egress costs. I set budget alerts at fifty, eighty, and one hundred percent of expected monthly spend with email and PagerDuty notification. I also set hard limits on auto-scaling maximums for every compute resource — the worst cloud cost incident I've seen came from a retry loop bug that scaled to hundreds of instances before a human noticed.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| right-sizing | /raɪt ˈsaɪzɪŋ/ | matching instance size to actual workload — eliminating over-provisioning |
| reserved capacity | /rɪˈzɜːrvd kəˈpæsɪti/ | committed one or three year use — significant discount over on-demand |
| auto-scaling maximum | /ˈɔːtoʊ skeɪlɪŋ ˈmæksɪməm/ | hard cap — prevents runaway cost from bugs or attacks |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Estimate the monthly GCP cost for a Cloud Run service handling 1 million requests per day.


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
