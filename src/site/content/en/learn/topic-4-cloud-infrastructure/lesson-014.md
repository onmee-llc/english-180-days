---
title: "Day 54 — Week 2 Review — Cloud Architecture"
description: "Present your cloud infrastructure story end-to-end — architecture, decisions, and trade-offs."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> Let me present the cloud infrastructure for the content automation platform. We're on AWS, multi-region active-passive, with the primary region in us-east-1 and a warm standby in eu-west-1 for disaster recovery. The application tier runs on ECS Fargate — no EC2 instances to manage. Each service is containerized, has its own task definition, and auto-scales based on CPU and SQS queue depth. The database layer uses RDS Aurora PostgreSQL with read replicas. Aurora handles failover in under 30 seconds — much faster than standard RDS. For cache, we use ElastiCache Redis cluster mode for horizontal scaling of read-heavy operations. All services write structured logs to CloudWatch and ship to OpenSearch for querying. Metrics go to CloudWatch, with Grafana dashboards on top. Alerts hit PagerDuty with a 15-minute P1 response SLA. Infrastructure is 100 percent Terraform. We use Terragrunt for environment promotion — dev to staging to production with isolated state files. Deployments run through GitHub Actions and update ECS services using blue-green deployment via CodeDeploy. Zero-downtime deploys at 20 services per release cycle.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| active-passive multi-region | /ˈæktɪv ˈpæsɪv ˈmʌlti ˈriːdʒən/ | primary serves traffic, standby waits — simplest DR model, RPO/RTO measured in minutes |
| queue depth | /kjuː dɛpθ/ | number of unprocessed messages — use it as a scaling signal for consumer services |
| zero-downtime deploy | /ˈzɪərəʊ ˈdaʊntaɪm dɪˈplɔɪ/ | blue-green or rolling update — traffic shifts only after health checks pass |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

If latency suddenly spiked in production and you had 10 minutes to diagnose it, what would be your first three steps?


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
