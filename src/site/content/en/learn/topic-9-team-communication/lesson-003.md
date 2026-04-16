---
title: "Day 115 — Receiving Code Review Feedback"
description: "Respond to review comments professionally — acknowledge, ask, push back when needed."
date: 2026-04-13
---

## Session goal

Model three types of response: agreement, clarification request, and respectful pushback.

## Shadowing passage

> Thanks for the detailed review. Let me respond to a few points. On the generator vs list comprehension point — great catch, you are right. This collection can be large and iterating lazily is the better choice. I will update that. On the variable name: agreed, user_records is clearer. Done. On the error handling — I want to push back slightly here. I agree that separating timeout from auth failure is good practice in general, but in this specific case both errors result in the same downstream behavior: log the error, increment a counter, and retry. The difference in error type does not change the response path. That said, I do see value in having them as distinct log entries for observability. What if I keep the unified catch block but add a discriminator field to the log entry so we can filter in Datadog? Let me know if that addresses your concern. Appreciate the thorough review — the pagination feedback in particular is something I should have caught myself.

---

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| push back slightly | [Nghe →](https://youglish.com/pronounce/push%20back%20slightly/english) | disagree respectfully — use 'slightly' to lower the temperature |
| discriminator field | [Nghe →](https://youglish.com/pronounce/discriminator%20field/english) | a field in a log entry that identifies the type of event |
| addresses your concern | [Nghe →](https://youglish.com/pronounce/addresses%20your%20concern/english) | closes the loop — propose something that resolves their objection |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

When you receive a review comment you disagree with, can you push back without sounding defensive?


## Anti-Translation Drill — Own Words *(5 min)*

Retell today's shadowing passage in **your own words** — do NOT repeat the original phrasing.

- Paraphrase the entire content as if explaining to a colleague who missed the meeting.
- Speak for **60–90 seconds**.
- Use different sentence structures, different transitions, different examples if possible.
- If you catch yourself quoting the passage word-for-word, stop and rephrase.

> Goal: Full integration — you own the knowledge when you can express it freely, not just repeat it.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
