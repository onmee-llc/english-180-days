---
title: "Day 67 — Git Workflow"
description: "Branch strategy, PR review, and release management."
date: 2026-04-13
---

## Session goal

Describe your team's git workflow and how it supports rapid iteration.

## Shadowing passage

> My git workflow is trunk-based development with short-lived feature branches. The core discipline: every feature branch lives for at most two days before it merges to main. Longer-lived branches accumulate conflicts and make integration slower, not faster. For a feature that takes more than two days to build, I use feature flags — the branch merges with the flag off, and the feature activates progressively once tested. Pull request conventions: every PR requires at least one reviewer, has a clear description explaining why the change is being made — not what it does, the diff shows that — and has passing CI including tests, lint, and build. I require linked issue references so every code change traces back to a user story or bug report. Commit message discipline: conventional commits format with a type, scope, and short description in the subject line. The body explains the motivation. This makes automated changelog generation and release notes meaningful. Release strategy: main is always deployable. I use semantic versioning for public API releases. Internal services cut releases automatically on merges to main, using the git commit hash as the version identifier. The most important property of a healthy git workflow is psychological safety: engineers should never fear merging to main because the deployment pipeline is robust enough to catch problems before they reach users.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| trunk-based development | /trʌŋk beɪst dɪˈvɛləpmənt/ | merge to main frequently — reduces integration pain and keeps branches short |
| feature flags | /ˈfiːtʃər flæɡz/ | ship code to production with the feature off — decouple deployment from release |
| conventional commits | /kənˈvɛnʃənəl kəˈmɪts/ | structured commit message format — enables automated tooling and readable history |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the risk of keeping a feature branch alive for two weeks? What goes wrong?


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
