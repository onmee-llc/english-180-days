---
title: "Day 31 — API Authentication"
description: "JWT, OAuth2, and API keys — when to use which, explained with precision."
date: 2026-04-13
---

## Session goal

Design the authentication strategy for a multi-tenant API platform.

## Shadowing passage

> API authentication has three primary patterns and they serve different purposes. API keys are the simplest: a static string generated per consumer, passed in a header or query parameter. They are easy to implement and work well for server-to-server communication where the consumer is a service, not a person. The downside is that they are long-lived and don't carry identity information beyond the key itself. JWT — JSON Web Tokens — are stateless bearer tokens that carry signed claims: user ID, tenant ID, role, expiry. The server validates the signature without touching a database, which is excellent for performance. JWTs expire, which limits the blast radius of a compromised token. The downside is that you cannot revoke a specific JWT before it expires without maintaining a denylist, which partially negates the stateless benefit. OAuth2 is the right choice when you need to grant third-party applications limited access to resources on behalf of a user — the standard authorization delegation pattern. For a multi-tenant SaaS platform, I typically combine patterns: JWT for end-user sessions, API keys for service-to-service authentication, and OAuth2 scopes for the public developer API.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| bearer token | [Nghe →](https://youglish.com/pronounce/bearer%20token/english) | a token that grants access to whoever holds it — handle carefully |
| blast radius | [Nghe →](https://youglish.com/pronounce/blast%20radius/english) | how much damage a security incident can cause — minimize it by design |
| authorization delegation | [Nghe →](https://youglish.com/pronounce/authorization%20delegation/english) | letting a third party act on your behalf — the core OAuth2 use case |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Walk through what happens when a JWT expires in the middle of a user session.


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
