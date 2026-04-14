---
title: "Day 49 — Disaster Recovery"
description: "RTO, RPO, and the disciplines of DR planning."
date: 2026-04-13
---

## Session goal

Design the disaster recovery strategy for a production SaaS system.

## Shadowing passage

> Disaster recovery planning starts with two numbers: RTO and RPO. RTO is Recovery Time Objective — how long can the system be down before the business impact is unacceptable. RPO is Recovery Point Objective — how much data loss is acceptable. For a content scheduling SaaS, I might set an RTO of one hour and an RPO of one minute — I can tolerate an hour of downtime, but I cannot lose more than one minute of scheduling changes. Those two numbers drive every DR design decision. To achieve a one-minute RPO, I need database replication with sub-minute lag — synchronous replication to a standby in a second region. To achieve a one-hour RTO, I need automated failover and runbook automation — a human reading a document and executing steps manually is unlikely to hit one hour. Backup strategy: daily automated database snapshots to a geographically separate storage bucket with thirty-day retention. Snapshot restoration is tested monthly — an untested backup is not a backup. Infrastructure as Terraform code means I can recreate the full environment in a new region in minutes. The most important DR discipline: regularly test your failover. A DR plan that has never been exercised under realistic conditions will fail when you actually need it.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| Recovery Time Objective | /rɪˈkʌvəri taɪm əbˈdʒɛktɪv/ | maximum acceptable downtime — drives failover automation requirements |
| Recovery Point Objective | /rɪˈkʌvəri pɔɪnt əbˈdʒɛktɪv/ | maximum acceptable data loss — drives replication strategy |
| untested backup | /ˌʌnˈtɛstɪd ˈbækʌp/ | a backup you haven't restored is a false sense of security |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Walk through the exact steps you'd take to fail over to a secondary region in the middle of the night.
