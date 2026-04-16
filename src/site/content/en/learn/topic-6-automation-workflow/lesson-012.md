---
title: "Day 76 — Automation Architecture Mock"
description: "Design a complete automation system for a content creation workflow."
date: 2026-04-13
---

## Session goal

Present a full automation architecture for quarterly content planning.

## Shadowing passage

> Let me walk through the complete automation architecture for quarterly Pinterest content planning. The system has three phases: analysis, generation, and delivery. Phase one: analysis. Seven days before quarter end, a Cloud Scheduler job triggers the analysis pipeline. It pulls twelve weeks of Pinterest analytics through the Pinterest API, loads into BigQuery, and runs a dbt model that ranks content categories by engagement multiplied by volume, weighted by recent trend. Output: a ranked content opportunity report per account — the data foundation for the generation phase. Phase two: generation. The report triggers a Cloud Run job that builds a structured context prompt per post type, calls the Gemini Pro API with chain-of-thought on brand voice and audience fit, validates outputs with the evaluation model, and retries failures twice. Approved briefs are written to Cloud Storage in a defined JSON schema with the account ID, quarter, content category, and generated brief. Phase three: delivery. A final Cloud Run job assembles the complete quarterly plan document from the individual briefs — formats as a PDF, emails to the account's configured recipients, and posts a summary notification to their Slack channel if configured. Total automation time: twelve to eighteen minutes. Before this system existed, a strategist spent six hours per account per quarter doing this work. The automation delivers ninety percent of the value in twelve minutes.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| chain-of-thought on brand voice | [Nghe →](https://youglish.com/pronounce/chain-of-thought%20on%20brand%20voice/english) | prompt technique + domain constraint — specific combination that improves creative output quality |
| evaluation model | [Nghe →](https://youglish.com/pronounce/evaluation%20model/english) | second LLM call to score the first call's output — production quality gate |
| total automation time | [Nghe →](https://youglish.com/pronounce/total%20automation%20time/english) | end-to-end wall clock time — the metric that demonstrates automation value to stakeholders |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the graceful degradation path if the Pinterest API goes down during the analysis phase?


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
