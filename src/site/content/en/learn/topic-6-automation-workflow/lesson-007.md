---
title: "Day 71 — Testing Automation"
description: "Unit, integration, E2E — a disciplined testing pyramid."
date: 2026-04-13
---

## Session goal

Describe your testing strategy for a content automation backend service.

## Shadowing passage

> Testing strategy is organized as a pyramid: many fast unit tests at the base, fewer integration tests in the middle, a small number of E2E tests at the top. Unit tests: test individual functions and classes in isolation with all dependencies mocked. They run in milliseconds, produce deterministic output, and are the cheapest tests to write and maintain. I aim for high coverage on business logic — scheduling rules, content validation, API response formatting. I do not write unit tests for trivial getters and setters. Integration tests: test multiple components working together against real dependencies — a real database, a real queue, real file storage. These confirm that migrations are applied correctly, queries return expected results, and services interact correctly. They run in seconds to minutes and catch integration problems that unit tests miss. E2E tests: test complete user flows through the deployed application. I run these against the staging environment after every deployment. I have ten to twenty carefully chosen scenarios that test the critical paths: create a post, schedule it, publish it, verify it in the publishing history. E2E tests are expensive to maintain and fragile under UI or API changes — I treat them as smoke tests, not regression safety nets. Mutation testing as a quality check on unit tests: if I can change a business logic condition and all unit tests still pass, those tests aren't catching that logic change, which means they're not testing what matters.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| testing pyramid | /ˈtɛstɪŋ ˈpɪrəmɪd/ | many unit, fewer integration, few E2E — cost-effective testing strategy |
| mutation testing | /mjuːˈteɪʃən ˈtɛstɪŋ/ | inject bugs into code to verify tests actually catch them |
| deterministic output | /dɪˌtɜːrmɪˈnɪstɪk ˈaʊtpʊt/ | same input always produces same output — essential for reliable unit tests |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How many E2E tests is too many? What's the signal that you have too many?


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
