---
title: "Day 30 — GraphQL vs REST"
description: "When GraphQL wins, when it's overkill — a concrete comparative analysis."
date: 2026-04-13
---

## Session goal

Make a recommendation: GraphQL or REST for a given product scenario.

## Shadowing passage

> GraphQL and REST solve different problems, and the choice depends on the client's query patterns. REST works well when your data model is simple and your clients have predictable, consistent data needs. It is easy to cache at the HTTP layer, easy to reason about, and widely understood. GraphQL solves three specific problems REST struggles with. The first is over-fetching: a REST endpoint returns all fields whether the client needs them or not. GraphQL lets clients request exactly the fields they need. The second is under-fetching: to build a page that shows a user, their recent posts, and each post's comment count, REST requires three separate requests. GraphQL resolves the full graph in one. The third is the N-plus-one problem: fetching one user then N posts then N times N comments. GraphQL's data loader pattern batches those queries. The cost of GraphQL is operational complexity: caching is harder because every query can be unique, introspection and schema management add overhead, and debugging requires different tooling. My recommendation: use REST for internal microservices communication and simple public APIs. Consider GraphQL when your frontend has highly variable, complex data requirements — particularly mobile apps that need to minimize data transfer.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| over-fetching | /ˈoʊvər ˈfɛtʃɪŋ/ | REST returns all fields — GraphQL returns only what's requested |
| N-plus-one problem | /ɛn plʌs wʌn ˈprɒbləm/ | fetching a list then querying each item individually — classic inefficiency |
| data loader pattern | /ˈdeɪtə ˈloʊdər ˈpætərn/ | batches N queries into one — solves N+1 in GraphQL |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Give a scenario where you'd recommend REST over GraphQL despite complex data needs.


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
