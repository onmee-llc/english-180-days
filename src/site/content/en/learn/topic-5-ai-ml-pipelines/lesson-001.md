---
title: "Day 53 — ML System Design"
description: "Describe the architecture of an ML system end-to-end."
date: 2026-04-13
---

## Session goal

Give a 5-minute walkthrough of an ML pipeline you designed.

## Shadowing passage

> Let me walk through the architecture of the AI content generation service I built. The system takes a customer's Pinterest analytics, product catalog, and target audience data, and generates optimized pin descriptions and image briefs for quarterly planning. The pipeline has five stages. First, data ingestion: a scheduled job pulls analytics from the Pinterest API and writes to BigQuery. Second, preprocessing: a Cloud Run job normalizes the data and builds the feature vectors — engagement rates by content category, seasonal patterns, audience demographics. Third, LLM inference: I call the Gemini Pro API with a structured prompt generated from the feature vectors. The prompt instructs the model on tone, format, and constraints derived from the customer's brand voice document. Fourth, post-processing: output validation — check for format compliance, brand guideline adherence, and a factual consistency check. Invalid outputs are regenerated up to two times. Fifth, delivery: approved outputs are written to Cloud Storage, and a webhook notifies the customer's CMS. The most important architecture decision: I separate the expensive LLM inference step from the fast data steps. If the LLM call fails, only that stage restarts — previous stages don't re-run. Idempotent pipeline stages are essential for cost control and reliability in AI systems.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| feature vectors | /ˈfiːtʃər ˈvɛktərz/ | numerical representations of input data — what the model actually receives |
| post-processing validation | /poʊst ˈprɒsɛsɪŋ ˌvælɪˈdeɪʃən/ | output quality gates after inference — essential for production quality |
| idempotent pipeline stages | /aɪˈdɛmpətənt ˈpaɪplaɪn steɪdʒɪz/ | rerunning a stage produces the same result — safe to retry without side effects |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What would you monitor to detect silent quality degradation in LLM outputs?


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
