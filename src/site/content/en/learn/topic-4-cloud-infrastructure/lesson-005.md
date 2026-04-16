---
title: "Day 45 — Storage Options"
description: "S3, RDS, DynamoDB, and when to use each — a practical decision framework."
date: 2026-04-13
---

## Session goal

Recommend a storage strategy for a multi-type data system.

## Shadowing passage

> Cloud storage decisions map to data characteristics. Object storage — S3 or Cloud Storage — for unstructured binary data: images, videos, documents, model weights, backups. Access pattern is key-based retrieval or listing by prefix. Cheap, infinitely scalable, globally distributable via CDN. The wrong choice for structured data with joins. Relational databases — RDS, Cloud SQL — for structured data with complex query requirements: user accounts, transactional records, anything that needs SQL joins, constraints, and ACID guarantees. The right choice when your access patterns are complex and your consistency requirements are strict. DynamoDB or Firestore for high-throughput key-value access at massive scale: user sessions, real-time game state, shopping carts, per-user feature flags. Single-digit millisecond reads, scales automatically, no schema migrations. The wrong choice when your access patterns are unclear at design time, because you pay a significant cost for changing access patterns after the table is live. Redis for ephemeral data: session tokens, rate limit counters, distributed locks, frequently-read computed values. In-memory, extremely fast, not the source of truth. For my content automation SaaS: Cloud Storage for generated images, Cloud SQL for post metadata and scheduling state, Firestore for real-time publish status updates surfaced in the UI.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| unstructured binary data | /ˌʌnˈstrʌktʃərd ˈbaɪnəri ˈdeɪtə/ | images, files, blobs — belong in object storage, not databases |
| ACID guarantees | /ˈeɪsɪd ˌɡærənˈtiːz/ | atomicity, consistency, isolation, durability — relational database property |
| single-digit millisecond | /ˈsɪŋɡl ˈdɪdʒɪt ˌmɪlɪˈsɛkənd/ | DynamoDB's latency promise for single-item reads |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What would you store in Redis vs DynamoDB in the same application? Give concrete examples.


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
