---
title: "Day 70 — Data Pipelines"
description: "ETL, ELT, and real-time streaming — design a data pipeline for analytics."
date: 2026-04-13
---

## Session goal

Design the analytics data pipeline for a content automation platform.

## Shadowing passage

> My analytics pipeline follows an ELT pattern: Extract, Load, Transform. I prefer ELT over ETL for analytics because modern data warehouses like BigQuery and Snowflake are powerful enough to handle transformation at query time, and loading raw data first preserves full fidelity — if you transform before loading, you lose the ability to reprocess historical data with a new transformation logic. The pipeline has three layers. Extract: Cloud Functions triggered by Pub/Sub events capture every significant action in the system — post published, post failed, user login, plan created — and write raw events to Cloud Storage in JSON. Also scheduled batch extractions pull data from the Pinterest and Instagram APIs on a six-hour cadence. Load: a BigQuery transfer job loads the raw event files from Cloud Storage on a one-hour schedule. Schema is inferred from the JSON events with a defined schema for known event types. Transform: dbt models in a separate repository define the business logic transformations. Models run on a schedule in Cloud Composer. The marts layer — the final queryable tables — are optimized for the specific reporting queries the dashboard runs. Monitoring for data pipelines has unique requirements: I track row counts per batch to detect silent data loss, and latency per stage so I can identify slowdowns before they cascade. A pipeline that delivers data but silently drops ten percent of events is a production incident.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| ELT pattern | /iː ɛl tiː ˈpætərn/ | extract, load raw, transform in warehouse — preserves full data fidelity |
| dbt models | /diː biː tiː ˈmɒdəlz/ | SQL transformations version-controlled like application code |
| silent data loss | /ˈsaɪlənt ˈdeɪtə lɒs/ | pipeline drops events without errors — rows count monitoring catches this |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the difference between an idempotent ETL job and one that isn't? Why does it matter?
