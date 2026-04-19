---
title: "Day 158 — Structured Output"
description: "Explain how to reliably get JSON or structured data from an LLM."
date: 2026-04-19
---

## Session goal

Describe your approach to structured output — how you enforce it, validate it, and handle failures.

## Shadowing passage

> Getting structured output from an LLM reliably requires three things: a clear schema in the prompt, enforced output format via the API, and validation in your application code. If you only do the first one, you'll get JSON-ish responses that work ninety percent of the time and break silently the other ten percent. In production, ninety percent reliability is not acceptable. My approach: I define the expected JSON schema in the system prompt — both the structure and the types. I use the `response_format` parameter to enforce JSON output at the API level. And I validate the response against the schema using a library like Pydantic before passing it downstream. If the validation fails — which still happens occasionally even with enforced JSON mode — I retry with a more explicit error message appended to the prompt: "Your previous response had the wrong format. Here is what was wrong: missing field X. Please try again." That retry resolves about eighty percent of format failures. The remaining twenty percent are genuine model refusals or truncated outputs — I log those and investigate separately. The lesson: treat LLM output like you'd treat untrusted external input. Always validate. Never assume.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| response_format | [Nghe →](https://youglish.com/pronounce/response%20format/english) | the API parameter to enforce structured output |
| fail silently | [Nghe →](https://youglish.com/pronounce/fail%20silently/english) | an error that goes undetected — the worst kind |
| untrusted external input | [Nghe →](https://youglish.com/pronounce/untrusted%20external%20input/english) | data you must validate — never assume it's correct |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

How do you validate LLM output in your KPI 1 system? What happens if validation fails?

## Anti-Translation Drill

Explain "treat LLM output like untrusted external input" in plain English. Why is this important?

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
