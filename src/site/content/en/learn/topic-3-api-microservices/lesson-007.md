---
title: "Day 35 — Versioning Strategy"
description: "Never break consumers — the disciplines of API versioning."
date: 2026-04-13
---

## Session goal

Explain your full versioning strategy for an API serving multiple client types.

## Shadowing passage

> API versioning is fundamentally about honoring contracts with your consumers. Breaking a contract — changing a response field name, removing an endpoint, changing a status code semantic — is a production incident for every client that hasn't updated. The disciplines I follow are these. Additive-only changes are backward compatible: adding new fields to a response, adding new optional parameters, adding new endpoints. These can be shipped without a version bump. Breaking changes require a new version: removing or renaming fields, changing types, reordering required parameters. For public APIs I use URL path versioning — slash v1 slash users — because it's explicit, cacheable, and doesn't require special header handling. Internal microservice APIs I sometimes version through HTTP Accept headers for cleanliness. Deprecation policy: when I release v2, I don't remove v1 immediately. I set a sunset date — typically six months out — expose it in a Deprecation header on v1 responses, and contact consumers directly if I have visibility into their usage. The most important discipline: design your first version assuming you will need a second. That means clean resource modeling, avoiding framework-specific quirks in your response shape, and not exposing internal data model details that could change.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| additive-only changes | /ˈædɪtɪv ˈoʊnli ˈtʃeɪndʒɪz/ | safe to deploy without version bump — add, never remove |
| sunset date | /ˈsʌnset deɪt/ | the date you will stop supporting a deprecated version |
| contract with consumers | /ˈkɒntrækt wɪð kənˈsjuːmərz/ | frame versioning as a commitment, not a technical detail |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Walk through the rollout plan for a breaking change to an API with ten external consumers.


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
