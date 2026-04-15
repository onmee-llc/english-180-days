---
title: "Day 111 — Debugging Under Pressure"
description: "Walk through a high-stakes production debug session in real time."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> Production is down. Revenue-critical API is returning 500s. I have 15 minutes before the outage escalates to the CTO. Let me walk you through how I approach this. First, scope the blast radius. I pull up the error dashboard. Is this 100 percent of requests or a subset? Is it one endpoint or all? Is it one region or global? In this case: 100 percent of payment API requests, all endpoints, only us-east-1. That narrows it significantly. Second, correlate with recent changes. What deployed in the last 4 hours? I check the deployment log. A database connection pool configuration change went out 22 minutes ago — right when the errors started. High correlation. Third, look at the specific error. I read the exception. It's a connection timeout to the primary database. The error rate on the connection pool: 100 percent — the pool is exhausted. The new config reduced max connections from 50 to 10 per instance, with 8 instances running. We went from 400 total connections to 80. Under peak load, the pool drained in seconds. Fourth, immediate mitigation. Revert the configuration change. I initiate a rollback deploy — this takes 4 minutes. Connections recover within 90 seconds of rollback completing. Total downtime: 26 minutes. Root cause documented in the postmortem within 2 hours.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| blast radius | /blɑːst ˈreɪdiəs/ | scope of impact — narrow first before investigating cause |
| connection pool exhaustion | /kəˈnɛkʃən puːl ɪɡˈzɔːstʃən/ | all connections are in use and new requests queue or fail — a common latency root cause |
| rollback deploy | /ˈroʊlbæk dɪˈplɔɪ/ | revert to previous known-good version — fastest mitigation when a deploy causes an incident |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's your personal system for keeping calm and thinking clearly when you're under incident pressure?
