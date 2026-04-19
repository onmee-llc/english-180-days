---
title: "Day 166 — Prompt Versioning"
description: "Explain how to version and manage prompt templates as production code."
date: 2026-04-19
---

## Session goal

Describe your approach to prompt versioning — why it matters and how you implement it.

## Shadowing passage

> Most teams start with prompts stored as hardcoded strings in application code. This works fine for one developer on one feature. It breaks down when three engineers are editing prompts in parallel and you can't tell which prompt version is running in production, or why the quality degraded after last Tuesday's deployment. My approach is to treat prompts as code: versioned, reviewed, and tested. In practice, this means prompts live in dedicated files in the repository, not embedded in business logic. Each file has a version number in the name — `summarize_v3.txt` — or a version field in a configuration file. Changes to prompts go through the same pull request process as code changes. The PR description includes: which prompt changed, why, and what the eval results showed. No prompt change merges without an eval run. In production, I log the prompt version alongside every LLM call. When I see a quality drop on a specific date, I can immediately pull up all calls from that date and see which prompt version was running. That traceability cuts incident investigation time dramatically. For teams that want a more structured solution, LangSmith has built-in prompt versioning. But honestly, for most teams, a simple version number in the filename and rigorous PR reviews get you eighty percent of the benefit at zero infrastructure cost.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| treat prompts as code | [Nghe →](https://youglish.com/pronounce/treat%20prompts%20as%20code/english) | version, review, and test prompts with the same rigor as source code |
| pull request process | [Nghe →](https://youglish.com/pronounce/pull%20request%20process/english) | code review workflow — applies to prompts too |
| traceability | [Nghe →](https://youglish.com/pronounce/traceability/english) | ability to find which version caused a specific outcome |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

How are prompts versioned in your KPI 1 project today? What would you change?

## Anti-Translation Drill

Explain prompt versioning to a new team member in 45 seconds. Use "treat prompts as code" as your opening.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
