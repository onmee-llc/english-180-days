---
title: "Day 58 — AI Safety and Content Filtering"
description: "Output safety, misuse prevention, and responsible AI in production."
date: 2026-04-13
---

## Session goal

Design the safety layer for an AI content generation API.

## Shadowing passage

> Responsible production AI systems require explicit safety architecture. I design safety as a layer with pre-inference and post-inference checkpoints. Pre-inference: input classification before the prompt reaches the primary model. I use a lightweight safety classifier to detect jailbreak attempts, prompt injection patterns, and out-of-scope requests. Requests flagged by the classifier are blocked and logged before any expensive inference runs. This matters economically — a prompt injection that causes the model to run expensive token sequences can cause significant cost if not caught early. Post-inference: output review before returning to the caller. For content generation, I run a structured evaluation prompt against the output: check for factual claims that can't be verified, brand voice compliance, and content policy violations. Outputs that fail are returned as errors — the caller receives a structured error response explaining why, not a bad output. Logging architecture: every inference request, the input hash, and the output are logged with a trace ID. This enables retroactive auditing if a safety incident is reported later. PII in user inputs must be handled carefully — I log only hashes of inputs containing identified PII, not the full text. Rate limiting is also a safety control: aggressive rate limiting on new API keys prevents automated abuse of the content generation endpoint.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| prompt injection | [Nghe →](https://youglish.com/pronounce/prompt%20injection/english) | user input designed to hijack the model's instructions — a real attack vector |
| pre-inference filter | [Nghe →](https://youglish.com/pronounce/pre-inference%20filter/english) | block dangerous requests before they reach the expensive model |
| retroactive auditing | [Nghe →](https://youglish.com/pronounce/retroactive%20auditing/english) | ability to investigate past incidents from logs — requires retention strategy |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How would you detect if your content API was being used to generate spam at scale?


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
