---
title: "Day 43 — IAM and Security"
description: "Least privilege, service accounts, and the security discipline of cloud IAM."
date: 2026-04-13
---

## Session goal

Design the IAM structure for a multi-service application on GCP.

## Shadowing passage

> Cloud IAM is where most security mistakes in production systems happen. The principle of least privilege means every service account and user has only the permissions required for its specific work — nothing more. In GCP, I create one dedicated service account per Cloud Run service. The content generation service gets permission to read from Secret Manager for its API keys, write to Cloud Storage for generated images, and enqueue tasks to Cloud Tasks. It does not get permission to read the database directly, delete other services' objects, or access billing. This scoping means that if the service is compromised, the blast radius is limited to what that service account can do. Audit logging is non-negotiable for any production system: every IAM permission grant, every secret access, every storage operation should be logged and retained. I configure log sinks to write IAM audit logs to BigQuery for long-term analysis and alerting on anomalous patterns — a service account accessing a resource it has never accessed before is worth an alert. One common mistake: using the default compute service account, which has project-wide editor permissions. I always disable that and create explicit scoped service accounts from the start.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| blast radius | /blɑːst ˈreɪdiəs/ | scope of damage from a security incident — minimize with scoped permissions |
| audit logging | /ˈɔːdɪt ˈlɒɡɪŋ/ | recording who did what — essential for security and compliance |
| anomalous patterns | /əˈnɒmələs ˈpætərnz/ | unusual access that could indicate compromise — alert on this |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the first thing you check in IAM when a production service starts failing unexpectedly?


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
