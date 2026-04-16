---
title: "Day 123 — Writing a Technical Post-Mortem"
description: "Structure a blameless post-mortem: timeline, impact, root cause, action items."
date: 2026-04-13
---

## Session goal

Narrate a post-mortem as if presenting it to the team — clear, blameless, forward-focused.

## Shadowing passage

> Here is the structure I use for every post-mortem. Title: date, service, incident type. Summary: two sentences — what happened and what the customer impact was. Timeline: exact UTC times, no rounding. Include the time the incident started, who detected it, when the on-call was paged, when each mitigation step was taken, and when the incident was resolved. Root cause: one or two paragraphs. Not blame — mechanism. What was the technical failure? What conditions allowed it to happen? Contributing factors: what made it worse or harder to detect? Action items: each item has an owner, a deadline, and a description that is specific enough to be unambiguous. Do not write 'improve monitoring' — write 'add a Datadog alert for payment service error rate above 1 percent, P3, assigned to Anna, due by 14 May.' The purpose of a post-mortem is not to assign blame. It is to learn something the system can teach us and make a specific, bounded change so that class of incident is less likely or less severe in the future. Blameless means we focus on what failed, not who failed.

---

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| blameless | /ˈbleɪmləs/ | no individual is blamed — the system and process are analyzed |
| mechanism | /ˈmɛkənɪzəm/ | how the failure happened technically — not why someone made a mistake |
| specific enough to be unambiguous | /ʌnæmˈbɪɡjʊəs/ | a good action item has exactly one possible interpretation |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Can you write a post-mortem action item right now for your most recent production issue?


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
