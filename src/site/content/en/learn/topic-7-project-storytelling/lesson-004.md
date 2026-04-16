---
title: "Day 80 — Handling Failure Stories"
description: "Tell a failure story with composure — what went wrong, what you learned."
date: 2026-04-13
---

## Session goal

Tell the story of a technical failure or mistake — own it, analyze it.

## Shadowing passage

> The incident that taught me the most about production systems happened about eighteen months into running the content automation platform. A batch publishing job ran at two in the morning — standard schedule. But that night, a rate-limiting change from Pinterest's API that I hadn't received notification of caused every publish attempt to return a 429 error. My retry logic kicked in correctly, but the exponential backoff was miscalculated — it wasn't actually exponential, it was linear. The result: the job ran for four hours, generating thousands of API calls that all failed, exhausting the PIN's API rate limit for the entire day, and causing manual publishes by the agency's team to fail throughout the following morning. What went wrong: three compounding failures. I hadn't set a maximum retry count for the batch job. The backoff wasn't actually exponential. And I had no alert on total API call volume, only on individual request failures. The impact: eight hours of manual publishing blocked for the agency's team. No data loss, but significant trust damage. What I changed: added a maximum retry count with a dead letter path, rewrote and unit-tested the backoff logic, added a rate-limit-remaining alert that fires at twenty percent remaining, and set up API rate limit monitoring per integration. The lesson I carry forward: retry logic is subtle and almost always wrong the first time. Test it explicitly, not just the happy path.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| compounding failures | [Nghe →](https://youglish.com/pronounce/compounding%20failures/english) | multiple small gaps combining into a large incident — the pattern behind most outages |
| dead letter path | [Nghe →](https://youglish.com/pronounce/dead%20letter%20path/english) | where failed tasks go after max retries — prevents silent data loss |
| own it, analyze it | [Nghe →](https://youglish.com/pronounce/own%20it%2C%20analyze%20it/english) | failure narrative tone — take responsibility, show learning, not excuses |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the most important change you'd make to prevent the same incident category in a future system?


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
