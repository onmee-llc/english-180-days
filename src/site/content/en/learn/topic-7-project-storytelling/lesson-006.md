---
title: "Day 82 — Leadership Narrative"
description: "Tell a story that demonstrates technical leadership — not management, engineering."
date: 2026-04-13
---

## Session goal

Describe a situation where you led a technical direction under uncertainty.

## Shadowing passage

> Technical leadership under uncertainty means making a direction decision when the comfortable answer is to defer. About a year into building the platform, I faced a decision about the AI generation architecture. The current approach — synchronous LLM calls in the API request path — was causing high p99 latency and occasional timeouts. Two options: add a dedicated LLM inference cache, or move generation to an asynchronous background job with webhook delivery. The asynchronous approach was clearly better architecturally — decoupled, non-blocking, more scalable. But it required changing the client-facing API contract, which meant migrating the existing integration that the agency had already built. I made the call to go asynchronous. The rationale I communicated: the synchronous architecture had a hard ceiling on quality — I couldn't use longer chain-of-thought prompts without risking timeouts. The async architecture had no such ceiling and aligned with how every serious AI generation API works. I owned the migration cost: I built a compatibility shim that supported both the synchronous and asynchronous models for sixty days, gave the client clear documentation and a migration guide, and personally walked through the code change with their developer in a thirty-minute call. What I learned: a technically correct decision that ignores implementation and migration cost is not actually a good decision. Leadership means owning the transition, not just the direction.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| defer the decision | /dɪˈfɜːr ðə dɪˈsɪʒən/ | avoiding a hard call — the temptation that leadership requires resisting |
| compatibility shim | /ˌkɒmpæˈtɪbɪlɪti ʃɪm/ | adapter that supports both old and new API — smooth migration path |
| owning the transition | /ˈoʊnɪŋ ðə trænˈzɪʃən/ | not just deciding the direction, but responsible for the path to get there |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Tell a story where you changed direction mid-project. How did you communicate it?
