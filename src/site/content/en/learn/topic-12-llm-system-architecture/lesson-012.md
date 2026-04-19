---
title: "Day 152 — Writing a README for an AI System"
description: "Describe what makes a great README for an LLM-powered backend service."
date: 2026-04-19
---

## Session goal

Explain — and practice writing — a README that lets a new engineer onboard to your LLM system in 30 minutes.

## Shadowing passage

> A README for an AI system needs to answer five questions in order. First: what does this system do? One paragraph, no jargon. Explain the user-facing outcome, not the technical implementation. If I can't explain what the system does in plain English in three sentences, the system is probably too complex. Second: how do I run it locally? Exact commands. No "see the documentation" references. If there's a required environment variable, say exactly where to get it. Third: how do I deploy it? The minimum someone needs to know to deploy this safely. Include the runbook link if you have one. Fourth: how do I know it's working? What does healthy look like? What's the URL for the monitoring dashboard? What's the alert channel? Fifth: what are the known limitations and gotchas? This is the section most people skip and most people need. Does the system fail silently on certain inputs? Is there a known latency spike on cold starts? Is there a prompt template that's known to be brittle? Document it. A new engineer will find these problems eventually — either in staging or in production. You choose when. I measure a README by a single test: can a new engineer who has never seen the codebase get it running locally, deploy it to staging, and verify it's working — without asking me anything? If the answer is yes, the README is good. If the answer is no, it's not finished yet.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| user-facing outcome | [Nghe →](https://youglish.com/pronounce/user-facing%20outcome/english) | what the end user experiences — not the internal implementation |
| known limitations | [Nghe →](https://youglish.com/pronounce/known%20limitations/english) | documented weaknesses — shows maturity, not weakness |
| brittle prompt | [Nghe →](https://youglish.com/pronounce/brittle/english) | a prompt that breaks easily with small input variations |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Open your KPI 1 README draft. Read the first paragraph aloud. Does it pass the "what does this do?" test?

**Minutes 29–30** — Write one sentence for the "known limitations" section in English.

## Reflection

Ask a colleague to read your README today. Time how long before they ask their first question.

## Anti-Translation Drill — Think in English *(5 min)*

Describe your KPI 1 system in three sentences. No technical jargon. Pretend you're explaining it to a non-engineer.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Applied today's lesson to my KPI 1 README
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
