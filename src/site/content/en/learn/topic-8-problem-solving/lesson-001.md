---
title: "Day 99 — Thinking Out Loud"
description: "Narrate your problem-solving process in real time — the core senior engineer skill."
date: 2026-04-13
---

## Session goal

Practice running commentary on a problem you are working through live.

## Shadowing passage

> Let me think through this out loud. So the symptom is: response times on the API jumped from about 80 milliseconds average to around 1.2 seconds — roughly fifteen times slower — starting this morning. First hypothesis: database. That is almost always the first thing to check when latency spikes without a corresponding CPU spike. I would pull the slow query log, sort by execution time, and look for anything that recently crossed, say, 500 milliseconds. Second hypothesis: a recent deployment. I would check the deployment log — what went out in the last 24 hours? If there is a correlation between the deploy time and the start of the latency spike, that is the lead. Third hypothesis: external dependency. If our service calls another service and that service slowed down, we would see it here. I would check the outbound request metrics. Fourth hypothesis: memory pressure — maybe a process is paging to disk. I would check memory utilization graphs. My instinct says start with the database. Let me go there first.

---

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| out loud | /aʊt laʊd/ | crucial in interviews — say what you're thinking |
| slow query log | /sloʊ ˈkwɪri lɒɡ/ | first tool to check for database latency |
| my instinct says | /maɪ ˈɪnstɪŋkt sɛz/ | shows experienced judgment, not random guessing |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Did you narrate the REASONING behind each step, not just the steps?
