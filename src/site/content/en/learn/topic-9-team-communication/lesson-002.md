---
title: "Day 114 — Giving Code Review Feedback"
description: "Write and say code review comments that are precise, kind, and actionable."
date: 2026-04-13
---

## Session goal

Practice reviewing a code change as if it were a colleague's PR — out loud.

## Shadowing passage

> This PR looks well-structured overall and the test coverage is solid. I have a few comments. On line 47: I want to understand the reasoning for using a list comprehension here rather than a generator expression. If this dataset is large, we are materializing the entire list in memory when we only need to iterate over it once. Have you considered a generator? On line 83: the variable name data is doing a lot of work. Could we be more specific — maybe user_records or raw_payload? It will make this easier to follow in three months. One bigger thought: the error handling on the external API call on line 120 catches all exceptions broadly. I would prefer we explicitly handle the timeout case and the authentication failure case separately, so they can be logged and alerted on differently in production. Happy to pair on that if it's helpful. Overall this is solid work — the approach to pagination is clean, and I think the performance improvement is real. I can approve once we discuss the error handling.

---

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| have you considered | /hæv juː kənˈsɪdərd/ | suggests, doesn't demand — collaborative tone |
| doing a lot of work | /ˈduːɪŋ ə lɒt əv wɜːrk/ | overloaded variable/function — English idiom for it tries to do too much |
| pair on that | /pɛr ɒn ðæt/ | pair programming — offer to work through it together |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Does your code review voice sound collaborative, or like a list of demands?
