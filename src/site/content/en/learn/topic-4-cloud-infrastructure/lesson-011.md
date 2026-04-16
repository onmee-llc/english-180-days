---
title: "Day 51 — Incident Response"
description: "How to handle a production incident — from detection to post-mortem."
date: 2026-04-13
---

## Session goal

Walk through your incident response process for a major production outage.

## Shadowing passage

> When a production incident fires, the first thirty seconds are the most important. The goal is not to fix the problem — it is to understand the scope and communicate. I follow a four-phase process. Phase one: detect and declare. The alert fires — PagerDuty or Slack notification. I acknowledge it, open an incident channel, and make an immediate assessment: is this a full outage or degraded service? Are users affected? What is the impact scope? I communicate this within five minutes of acknowledgment. Phase two: contain. Before diagnosing root cause, I ask: can I stop the bleeding? Roll back the most recent deployment if it correlates with the incident start time. Enable a circuit breaker. Scale up a resource. Containment is faster than diagnosis. Phase three: diagnose and fix. Now I investigate. Logs first — what errors are appearing. Metrics next — what changed around the incident start time. Traces for latency — where in the request path is the failure occurring. Phase four: communicate and close. User-facing status page update. Stakeholder communication. Service restoration announcement. Post-mortem within forty-eight hours: timeline, root cause, contributing factors, action items with owners and deadlines. The post-mortem is blameless — we are analyzing system failures and process gaps, not assigning fault to individuals.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| acknowledge and scope | /ækˈnɒlɪdʒ ænd skoʊp/ | first action in an incident — understand impact before diagnosing |
| stop the bleeding | /stɒp ðə ˈbliːdɪŋ/ | containment before diagnosis — reduce impact fast |
| blameless post-mortem | /ˈbleɪmləs ˈpoʊstˌmɔːrtɛm/ | analyze systems and processes, not blame people — psychological safety for honest reporting |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the first metric you'd check when a service's response time suddenly increases 10x?


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
