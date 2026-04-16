---
title: "Day 20 — CAP Theorem in Practice"
description: "Explain CAP without oversimplifying — apply it to a real architectural choice."
date: 2026-04-13
---

## Session goal

Explain CAP theorem and make a concrete consistency-availability trade-off decision.

## Shadowing passage

> The CAP theorem says a distributed system can guarantee at most two of consistency, availability, and partition tolerance. In practice, partition tolerance is not optional — network partitions happen in any distributed system. The real choice is always between consistency and availability during a partition. Choose consistency: during a partition, the system refuses to serve rather than risk returning stale data. Right choice for financial systems — you never want a banking app to show you the wrong account balance. Choose availability: during a partition, the system serves requests but may return stale data. Right choice for most consumer product features — if a social media notification count is two seconds stale, nobody is harmed. I've lived both sides of this. At the fintech company, we chose consistency on the payment processing pipeline — a request either reflected the correct balance or returned an error while we resolved the partition. On the content automation platform, I chose availability — if a cached URL is slightly stale for thirty seconds, that is a completely acceptable trade-off for a system that must always respond.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| at most two of three | /æt moʊst tuː əv θriː/ | exact statement of CAP — not a vague claim |
| right choice for financial systems | /raɪt tʃɔɪs fɔːr fɪˈnænʃəl ˈsɪstəmz/ | anchor the theory to real domain constraints |
| nobody is harmed | /ˈnoʊbədi ɪz hɑːrmd/ | business framing — is stale data a real problem for THIS use case? |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Apply CAP to a social media news feed. Which side of the trade-off would you take?


## Anti-Translation Drill — Listening First *(5 min)*

Close the text. Recall today's shadowing passage from memory only.

1. Say the **main idea** in one English sentence out loud.
2. Say **one specific detail** you remember.
3. If you blank out — do NOT open the text. Describe what you vaguely remember using simple English.

> Goal: Build the habit of processing English without reading — ears and memory only.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
