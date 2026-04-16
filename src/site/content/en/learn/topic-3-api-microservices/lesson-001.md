---
title: "Day 29 — REST Fundamentals"
description: "Explain REST principles — resource naming, HTTP methods, status codes."
date: 2026-04-13
---

## Session goal

Explain REST to a non-engineer and defend your design decisions.

## Shadowing passage

> REST stands for Representational State Transfer. In practice, it is a set of conventions for designing HTTP APIs that make them predictable and self-describing. The first principle is resource-oriented design: URLs represent nouns, not verbs. Slash users slash ID retrieves a user. HTTP methods express the operation: GET retrieves, POST creates, PUT replaces, PATCH partially updates, DELETE removes. This separation means an API's URLs can stay stable while the operations on them evolve. The second principle is statelessness: the server holds no session state between requests. Every request contains all information needed to process it. This is what enables horizontal scaling — any server can handle any request. Status codes carry semantic meaning: 200 is success, 201 is created, 400 is a client error, 401 is unauthenticated, 403 is unauthorized, 404 is not found, 500 is server error. Using these correctly makes APIs self-documenting through their responses. The third principle I enforce rigorously is versioning: never break an existing consumer. I use URL path versioning — slash v1 slash users — and maintain at least one prior version for a defined sunset period.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| resource-oriented design | [Nghe →](https://youglish.com/pronounce/resource-oriented%20design/english) | nouns in URLs, verbs as HTTP methods — the REST principle |
| statelessness | [Nghe →](https://youglish.com/pronounce/statelessness/english) | no session memory between requests — enables horizontal scaling |
| semantic meaning | [Nghe →](https://youglish.com/pronounce/semantic%20meaning/english) | status codes aren't arbitrary — they communicate intent |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Design the URL structure for a content scheduling API. Show me the resources and methods.


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
