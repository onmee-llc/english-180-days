---
title: "Day 38 — Error Handling Design"
description: "Design error responses that are consistent, informative, and actionable."
date: 2026-04-13
---

## Session goal

Design the error handling contract for a public API.

## Shadowing passage

> Error handling is part of the API contract and deserves the same design rigor as the happy path. Most APIs return inconsistent error shapes because error handling was added ad-hoc after the main design. I define a standard error envelope at the start: an error object with a machine-readable code, a human-readable message, a timestamp, a request ID for tracing, and optionally an array of field-level validation errors. Every endpoint returns the same shape on error. This allows clients to write generic error-handling code once instead of per-endpoint. Categories matter: use 4xx for client errors — the request was wrong — and 5xx for server errors — the server failed to handle a valid request. Never return a 200 with an error body — it breaks every client that checks status codes first. For validation errors, return a 422 with the field path and a message for each failed constraint. Never return a 500 with a stack trace or internal error details to a public API consumer — that is a security vulnerability. Log the full error internally with the request ID so engineers can correlate what the consumer saw with what happened in the system. The request ID is the bridge between public error responses and private logs.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| machine-readable code | [Nghe →](https://youglish.com/pronounce/machine-readable%20code/english) | error code the client can switch on — not just a human message |
| error envelope | [Nghe →](https://youglish.com/pronounce/error%20envelope/english) | standard wrapper for all errors — consistent shape across all endpoints |
| stack trace exposure | [Nghe →](https://youglish.com/pronounce/stack%20trace%20exposure/english) | returning internal error details to public API — a security vulnerability |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the difference between a 401 and a 403? Give a real example of each.


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
