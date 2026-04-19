---
title: "Day 143 — Streaming LLM Responses"
description: "Explain how streaming works technically and why it matters for user experience."
date: 2026-04-19
---

## Session goal

Describe the streaming architecture clearly — from the LLM API down to the client — including the tricky parts.

## Shadowing passage

> Streaming is one of those features that looks simple from the outside — you see text appearing word by word — but requires careful engineering underneath. The LLM API sends tokens back as they're generated using server-sent events, which is a one-directional HTTP stream. Your backend reads the stream in a loop, processing each chunk as it arrives. The challenge is that chunks don't always align with complete characters or words — you can receive an incomplete multi-byte UTF-8 sequence across two chunks, and if you don't buffer correctly, you'll corrupt the output. On the client side, I use a streaming response body with `ReadableStream` in the browser or `httpx` in an async Python service. The key architectural decision is whether to stream directly from your service to the browser — which is simple but couples your service to the client's connection lifecycle — or to buffer the full response and then return it in one shot, which trades UX latency for simplicity. For chat interfaces, always stream. For async document processing, buffer and return. I've seen teams implement streaming incorrectly and end up with garbled output, dropped chunks, and reconnection bugs. The fix is almost always the same: test with a slow network and a large response body — those two conditions together reveal every buffering and error handling gap.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| server-sent events | [Nghe →](https://youglish.com/pronounce/server-sent%20events/english) | the protocol for streaming tokens from LLM APIs |
| multi-byte UTF-8 sequence | [Nghe →](https://youglish.com/pronounce/multi-byte%20UTF-8/english) | a real streaming edge case — shows you've been in production |
| couples your service | [Nghe →](https://youglish.com/pronounce/couples%20your%20service/english) | creates tight dependency — usually undesirable |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Does your KPI 1 system require streaming? If yes — what edge cases have you already hit or anticipate hitting?

## Anti-Translation Drill — Listening First *(5 min)*

Close the text. Recall today's shadowing passage from memory only.

1. Say the **main idea** in one English sentence out loud.
2. Say **one specific detail** you remember.
3. If you blank out — do NOT open the text. Describe what you vaguely remember using simple English.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
