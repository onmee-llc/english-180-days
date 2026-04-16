---
title: "Day 52 — Cloud Architecture Mock"
description: "Present the end-to-end cloud architecture for a production system."
date: 2026-04-13
---

## Session goal

Walk through a complete cloud design for a high-availability SaaS platform.

## Shadowing passage

> Let me walk through the cloud architecture for a high-availability content automation SaaS. Region strategy: active-active in two GCP regions — us-central1 and europe-west1 — with Cloud DNS latency routing directing users to the nearest region. Compute layer: Cloud Run services in both regions — API, scheduler, and publishing workers — all stateless and auto-scaling. Load balancing: Global Load Balancer with SSL termination, serving both regions from a single IP. Data layer: Cloud SQL for PostgreSQL with a primary in us-central1, a synchronous read replica in europe-west1, and automated daily snapshots to Cloud Storage with cross-region replication. Messaging: Cloud Tasks for publishing queue with separate queues per region, max retries configured per platform SLA. Storage: Cloud Storage with dual-region configuration — objects stored in both regions automatically. CDN: Cloud CDN in front of object storage for generated images — cache hit rate above ninety percent for published content. Secrets: Secret Manager with cross-region replication for all credentials. Observability: Cloud Monitoring with a custom dashboard tracking publish success rate, p99 latency, queue depth, and cost per publish. Alerting: PagerDuty for any metric crossing defined thresholds. IaC: entire infrastructure in Terraform, applied via Cloud Build pipeline. Estimated monthly cost at ten thousand active users: approximately eighteen hundred dollars.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| active-active | /ˈæktɪv ˈæktɪv/ | both regions serve traffic simultaneously — no hot standby wait time |
| latency routing | /ˈleɪtənsi ˈruːtɪŋ/ | direct users to nearest healthy region — reduces global response time |
| cross-region replication | /krɒs ˈriːdʒən ˌrɛplɪˈkeɪʃən/ | data copied to second region automatically — enables regional failover |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's your biggest concern about this design at 100x the described scale?


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
