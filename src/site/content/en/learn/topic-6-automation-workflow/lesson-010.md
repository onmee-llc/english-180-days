---
title: "Day 74 — Documentation Engineering"
description: "Writing technical documentation that people actually read and use."
date: 2026-04-13
---

## Session goal

Explain your approach to technical documentation for a production system.

## Shadowing passage

> Technical documentation has one job: reduce the time it takes an engineer to go from zero to productive on a system. I organize documentation into four types, based on the Divio documentation system. Tutorials: learning-oriented, walks someone through a complete flow from start to finish. For my API, the tutorial is 'publish your first post in ten minutes' — step by step, with real API calls, expected responses, and what to do if something goes wrong. How-to guides: task-oriented, assume the reader knows the basics and wants to accomplish a specific goal. Configure a webhook. Set up rate limiting. Filter posts by platform. Reference: information-oriented, complete and dry. Every endpoint, every parameter, every error code. Automatically generated from OpenAPI spec so it stays in sync with the code. Explanation: understanding-oriented, answers the why. Why did we choose eventual consistency for publishing status? Why does the API use cursor-based pagination instead of offset? This is where architecture rationale lives. The hardest documentation discipline is deletion: outdated documentation is worse than no documentation, because it actively misleads. I have a documentation coverage requirement in CI — every new endpoint must have at least a reference entry and a how-to guide before the PR merges.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| Divio documentation system | /dɪˈviːoʊ ˌdɒkjʊmɛnˈteɪʃən ˈsɪstəm/ | four-type framework: tutorial, how-to, reference, explanation |
| documentation coverage | /ˌdɒkjʊmɛnˈteɪʃən ˈkʌvərɪdʒ/ | treat doc gaps like test gaps — require it as a PR criterion |
| outdated documentation | /ˌaʊtˈdeɪtɪd ˌdɒkjʊmɛnˈteɪʃən/ | actively misleads — worse than no documentation at all |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's one documentation improvement that would most help an engineer joining your current project?


## Anti-Translation Drill — Think in English *(5 min)*

Pick **one key phrase** from today's table. Explain what it means using **only English**.

- No Vietnamese. No dictionary.
- If you don't know a word, describe it: *"It's when you…"* / *"It's similar to…"* / *"The opposite would be…"*
- Then use the phrase in a new sentence about your own experience.

> Goal: Train circumlocution — the skill of explaining anything without knowing the exact word. This is what fluent speakers actually do.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
