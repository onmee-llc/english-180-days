---
title: "Day 155 — System Prompts & User Prompts"
description: "Explain the anatomy of a prompt and the role of each message component."
date: 2026-04-19
---

## Session goal

Describe the structure of a prompt — system, user, and assistant roles — and explain why each one matters.

## Shadowing passage

> The way I explain prompt anatomy to new team members is with an analogy. The system prompt is your employee handbook: it sets the rules, the role, the tone, and the constraints — and it's the same for every conversation. The user prompt is the task: specific, concrete, and different for each request. The assistant prefill — where supported — is like starting the employee's sentence for them: you force the first word or structure, and the model completes it in the direction you've chosen. Getting this separation right is the foundation of reliable prompting. A common mistake is mixing business logic into the user prompt when it belongs in the system prompt. If I see instructions like "always respond in JSON" buried in a user message, I know the prompt was written without thinking about the role separation. Those instructions belong in the system prompt — they're global behavior, not per-request instructions. The second common mistake is a system prompt that changes per request. If your system prompt is dynamic — if it changes based on the user's input — you've broken the separation and you'll get unpredictable behavior. Keep the system prompt stable. Put dynamic content in the user message where it belongs.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| role separation | [Nghe →](https://youglish.com/pronounce/role%20separation/english) | each message has a distinct purpose — system, user, assistant |
| global behavior | [Nghe →](https://youglish.com/pronounce/global%20behavior/english) | applies to all requests, not just the current one |
| unpredictable behavior | [Nghe →](https://youglish.com/pronounce/unpredictable%20behavior/english) | the model responds differently for similar inputs |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without the text. 3 passes.
**Minutes 23–28** — Record yourself once. Note one phrase to improve.
**Minutes 29–30** — Write and say the difficult phrase 10 times.

## Reflection

Review a prompt you've written recently. Does the system/user role separation hold up?

## Anti-Translation Drill

Close the text. Recall the main idea and one concrete mistake to avoid. Say both in English.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
