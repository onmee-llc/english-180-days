---
title: "Day 142 — API Authentication & Secrets Management"
description: "Explain how you handle API keys and secrets in a production LLM service."
date: 2026-04-19
---

## Session goal

Describe your approach to secrets management for LLM API keys — confidently and with specific tooling.

## Shadowing passage

> API key management might sound like a minor operational detail, but it's actually a Principal-level concern in any LLM system. A leaked key doesn't just cost money — it can expose your users' data and your company's IP to anyone who finds it. My rule is simple: keys never touch source code, ever. In development, I use a `.env` file that's in `.gitignore` — and I check that `.gitignore` is committed before anyone adds the file. In staging and production, I use the cloud provider's secrets manager: AWS Secrets Manager on AWS stacks, Secret Manager on GCP. The service retrieves the key at startup, not at build time, and holds it in memory — never writes it to disk or logs. I also set up key rotation quarterly with a zero-downtime rotation script: provision the new key, deploy with dual-key support, then deactivate the old key. The last thing I do is add a budget alert tied to the API key. If spend jumps fifty percent in a day, something is wrong — either a bug, a leak, or an unexpected traffic spike. The alert fires before my cost spikes to something catastrophic.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| never touch source code | [Nghe →](https://youglish.com/pronounce/never%20touch%20source%20code/english) | absolute rule — strong, clear statement |
| zero-downtime rotation | [Nghe →](https://youglish.com/pronounce/zero-downtime%20rotation/english) | the correct way to rotate secrets in production |
| dual-key support | [Nghe →](https://youglish.com/pronounce/dual-key%20support/english) | accepting both old and new keys during rotation window |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How do you currently manage secrets in your project? What would you change after today?

## Anti-Translation Drill — Think in English *(5 min)*

Pick **one key phrase** from today's table. Explain what it means using **only English**.

- No Vietnamese. No dictionary.
- If you don't know a word, describe it: *"It's when you…"* / *"It's similar to…"*
- Then use the phrase in a new sentence about your own experience.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
