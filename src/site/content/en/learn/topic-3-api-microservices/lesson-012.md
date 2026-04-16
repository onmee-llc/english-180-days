---
title: "Day 40 — API Design Mock"
description: "Design a complete API for a content scheduling service — full specification."
date: 2026-04-13
---

## Session goal

Specify the core endpoints of your content scheduling API in under 10 minutes.

## Shadowing passage

> Let me spec the core API for a content scheduling service. Base URL: slash v1. Authentication: Bearer JWT token in Authorization header. Resources: posts, schedules, platforms. Create a post: POST slash v1 slash posts. Request body: title, content, images array, target platform, scheduled at timestamp. Response 201: the created post object with an ID and status of 'scheduled'. Validation errors return 422 with a field-errors array. Get a post: GET slash v1 slash posts slash ID. Returns the full post including status and publishing history. List posts: GET slash v1 slash posts with query parameters for status filter, platform filter, and pagination using cursor-based navigation — no offset pagination at scale. Update scheduled time: PATCH slash v1 slash posts slash ID. Accepts only scheduled at in the body — this is a partial update. Only valid while status is 'scheduled'. Returns 409 Conflict if status is 'published'. Cancel a post: DELETE slash v1 slash posts slash ID. Soft delete — sets status to 'cancelled'. Not physically deleted. Publishing history: GET slash v1 slash posts slash ID slash attempts. Returns all delivery attempts with timestamps and platform response codes. Webhooks: POST slash v1 slash webhooks to register an endpoint URL and event types.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| cursor-based pagination | [Nghe →](https://youglish.com/pronounce/cursor-based%20pagination/english) | use cursor instead of offset — stable under concurrent writes |
| soft delete | [Nghe →](https://youglish.com/pronounce/soft%20delete/english) | mark as deleted, don't remove — preserves history and references |
| 409 Conflict | [Nghe →](https://youglish.com/pronounce/409%20Conflict/english) | state machine violation — resource exists but request is invalid for its current state |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What would you add to this spec if you were building for enterprise customers with audit requirements?


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
