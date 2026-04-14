---
title: "Day 103 — Root Cause Analysis"
description: "Go three levels deep: from symptom to immediate cause to root cause."
date: 2026-04-13
---

## Session goal

Practice the 'five whys' technique out loud until root cause is reached.

## Shadowing passage

> Root cause analysis means asking why until you hit something you can actually fix. Here is a real example. Symptom: a batch job failed at 3am on Tuesday. Why? Because it ran out of memory. Why? Because the dataset it was processing was larger than expected. Why? Because a new data source was added to the ingestion pipeline the week before, and nobody updated the memory allocation for the batch job. Why? Because the team adding the new data source did not realize this batch job existed — it was not documented. Why? Because we had no systematic way to track which downstream jobs depended on which data sources. So the root cause is not memory — memory is a symptom. The root cause is a documentation and dependency tracking gap. The fix is not just raising the memory limit. The fix is creating a data source dependency registry so that this cannot happen again silently. Raising the memory limit is also necessary, but it only treats the symptom. Real reliability work is finding and eliminating the class of problem, not just this instance of it.

---

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| five whys | /faɪv waɪz/ | keep asking 'why' until you hit the structural root cause |
| downstream | /ˌdaʊnˈstriːm/ | things that depend on your data or service |
| class of problem | /klæs əv ˈprɒbləm/ | the general failure mode, not just this specific incident |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Think of a production issue you had. Can you get to root cause in three 'why' steps?
