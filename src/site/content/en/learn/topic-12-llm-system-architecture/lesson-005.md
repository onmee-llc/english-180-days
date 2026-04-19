---
title: "Day 145 — Token Cost Logging"
description: "Explain how you track and attribute LLM token costs in production."
date: 2026-04-19
---

## Session goal

Describe a complete token cost logging system — what you capture, where you store it, and how you use it to make decisions.

## Shadowing passage

> Token cost logging is one of the first things I set up in any LLM system — before the first real user hits production. The reason is simple: LLM API costs are usage-based, and without logging, you're flying blind. Every API response contains a usage object: prompt_tokens, completion_tokens, and total_tokens. I log all three, along with the model name, the endpoint that triggered the call, the user or tenant ID, and a timestamp. That gives me four dimensions to slice: by time, by model, by feature, and by user. From those dimensions, I can answer the questions that actually matter: Which endpoint is the most expensive? Which prompt template is blowing up the token count? Are there users whose usage patterns suggest abuse? Is the P95 cost per request within our pricing model's margin? I store this data in a dedicated table in our analytics database and build a lightweight dashboard — nothing fancy, just daily spend and top ten most expensive endpoints. I've caught two issues this way in production: a developer who accidentally left debug-mode logging enabled and was generating ten times the expected token count, and a prompt template that was concatenating the full conversation history without truncation, causing costs to grow quadratically with conversation length.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| usage-based | [Nghe →](https://youglish.com/pronounce/usage-based/english) | pricing model where you pay per unit consumed |
| slice by | [Nghe →](https://youglish.com/pronounce/slice%20by/english) | analytics term — break down data by a dimension |
| grow quadratically | [Nghe →](https://youglish.com/pronounce/grow%20quadratically/english) | cost doubles with each increase — a serious scaling problem |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What token logging do you have in place for KPI 1? What dimensions would you add after today?

## Anti-Translation Drill — Listening First *(5 min)*

Close the text. Recall today's shadowing passage from memory only.

1. Say the **main idea** in one English sentence out loud.
2. Say **one specific detail** you remember.
3. If you blank out — describe what you vaguely remember using simple English.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
