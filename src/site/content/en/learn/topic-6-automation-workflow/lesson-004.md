---
title: "Day 68 — Scripting Automation"
description: "Shell scripts, Python automation, and when to reach for each."
date: 2026-04-13
---

## Session goal

Explain your approach to scripting automation for a DevOps task.

## Shadowing passage

> I distinguish between glue scripts and automation systems. A glue script is a short-lived, single-purpose script to automate a one-time or infrequent manual task. Rules for glue scripts: keep them short, make them readable, add a usage comment at the top, handle the most obvious error case, and don't over-engineer. A shell script that backs up a database, a Python script that transforms a CSV, a jq expression that extracts fields from an API response — these are glue scripts. They live in a tools or scripts directory, are version-controlled, and have a README entry. Automation systems are different: they run repeatedly, have operational requirements, and require maintainability over time. These belong in a proper codebase with tests, logging, error handling, and monitoring. My language choice: shell for file operations, process invocation, and system interaction. Python for data transformation, API calls, text processing, and any logic with more than trivial branching. The most important discipline for automation scripts: make failure loud and visible. A script that silently fails and reports success is worse than no automation at all. I return non-zero exit codes on failure, log the error clearly, and never swallow exceptions in automation code.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| glue script | [Nghe →](https://youglish.com/pronounce/glue%20script/english) | short single-purpose automation — don't over-engineer it |
| make failure loud | [Nghe →](https://youglish.com/pronounce/make%20failure%20loud/english) | silent failures in automation are worse than no automation |
| non-zero exit code | [Nghe →](https://youglish.com/pronounce/non-zero%20exit%20code/english) | how scripts signal failure to callers — essential for reliable CI pipelines |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Rewrite a bash script you've written recently — what would you do differently now?


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
