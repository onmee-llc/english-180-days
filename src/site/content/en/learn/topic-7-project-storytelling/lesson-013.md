---
title: "Day 89 — Handling the 'Biggest Failure' Question"
description: "Turn a failure story into a demonstration of judgment, learning, and growth."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> Tell me about a time you made a mistake that had a significant impact. I deployed a database migration to production without fully validating the rollback script. The migration added a NOT NULL column with a default value. What I didn't account for was that the ORM still tried to insert null for that column if the application code hadn't been updated. We had a rolling deployment with both old and new application versions running simultaneously for about 12 minutes. During that window, the old version was creating records with null values that the new schema rejected. The result: 3 percent of write operations failed silently for those 12 minutes. No immediate alert because the error rate was below our threshold. I discovered it the next morning when a customer reported missing data. The fix took four hours — we patched the null records from audit logs and added a backfill job. What I learned: migrations and application code need to deploy atomically, or the migration must be backward-compatible with both old and new code during the transition window. Since then, I've introduced a migration compatibility checklist and a dual-write test pattern. I also lowered our error rate alerting threshold from 5 percent to 0.5 percent. The mistake was real, but the process improvements from it have prevented at least two similar incidents.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| rolling deployment | /ˈroʊlɪŋ dɪˈplɔɪmənt/ | gradual instance replacement — old and new code run simultaneously during rollout |
| backward-compatible migration | /ˈbækwərd kəmˈpætɪbl maɪˈɡreɪʃən/ | schema change works with both old and new app code — safe for rolling deploys |
| backfill job | /ˈbækfɪl dʒɒb/ | asynchronous job to repair or populate historical data after a schema or logic change |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Think of a real mistake you made at work. How would you frame it using the structure from this passage?


## Anti-Translation Drill — Interview Mode *(5 min)*

Someone just asked you the Reflection question in a **real interview**. Answer now.

- You have **60 seconds**. No pauses longer than 3 seconds.
- Fill gaps with: *"Let me think about that…"* / *"The way I see it…"* / *"To give you a concrete example…"*
- **Record this answer** separately from your shadowing recording.
- Play it back. Did you sound like someone they'd hire?

> Goal: Simulate interview pressure. The ability to speak under pressure without translating is what separates "good English" from "interview-ready English".

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
