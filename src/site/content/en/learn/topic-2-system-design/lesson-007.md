---
title: "Day 21 — Load Balancing"
description: "Load balancing algorithms, health checks, and when sticky sessions are a design smell."
date: 2026-04-13
---

## Session goal

Design the load balancing layer for a high-traffic stateless API service.

## Shadowing passage

> A load balancer distributes traffic across application servers. For a stateless API, round-robin is usually sufficient — requests cycle through all servers in order. If servers have different specs, I switch to least-connections: route to whichever server has the fewest active requests. For session-aware services, you might hear about sticky sessions — routing the same user to the same server, typically for in-memory session state. I treat sticky sessions as a design smell. They mean you have state in the application tier that should be in a distributed cache or database instead. Stateless services can route any request to any server, which dramatically simplifies auto-scaling and rolling deployments. Health checks are equally important: the load balancer should probe each server on a defined interval and stop routing to any that fail — I configure both active checks and passive checks that track error rates from real traffic. One topology consideration: the load balancer itself should be redundant, active-passive with failover. A single load balancer is a single point of failure for your entire service.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| design smell | /dɪˈzaɪn smɛl/ | engineering code for 'this suggests a deeper problem in the design' |
| rolling deployments | /ˈroʊlɪŋ dɪˈplɔɪmənts/ | gradual server updates with no downtime — requires stateless services |
| single point of failure | /ˈsɪŋɡl pɔɪnt əv ˈfeɪljər/ | any component whose failure takes down the whole system |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What happens to your load balancer in a multi-AZ deployment if one availability zone fails?


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
