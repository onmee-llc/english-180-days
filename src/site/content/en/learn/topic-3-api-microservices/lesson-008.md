---
title: "Day 36 — OpenAPI and Documentation"
description: "Why API documentation is an engineering discipline, not a writing task."
date: 2026-04-13
---

## Session goal

Explain how you approach API documentation as a production concern.

## Shadowing passage

> API documentation is not a writing task that happens after the code — it is a contract that should drive the design. I write API specifications in OpenAPI format before I write implementation code. The spec defines types, request and response schemas, error codes, and security requirements. Then I generate server stubs and client SDKs from the spec, which ensures the implementation cannot drift from the contract. The benefits are multiple. First, frontend teams can develop against the spec before the backend is finished. Second, generated SDKs are always in sync with the API — no manual maintenance. Third, contract testing becomes possible: test the API against the spec as part of CI. The key disciplines: every field must be documented — name, type, and business meaning. Every error code must be documented — what triggers it and what the consumer should do. Every endpoint must have at least one example request and response. Versioning in the spec must match the API version in the URL. I treat outdated documentation as a bug with the same priority as a broken test. The moment documentation diverges from reality, consumers stop trusting it, and you are back to people reading your source code to figure out how the API works.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| OpenAPI specification | /ˈoʊpənˌeɪpiˌaɪ ˌspɛsɪfɪˈkeɪʃən/ | machine-readable API contract — generates code, documentation, and tests |
| contract testing | /ˈkɒntrækt ˈtɛstɪŋ/ | verify API behavior against the spec automatically in CI |
| documentation as a bug | /ˌdɒkjʊmɛnˈteɪʃən æz ə bʌɡ/ | framing that elevates docs to the same standard as code |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What would you do if you inherited an API with no documentation and existing consumers?


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
