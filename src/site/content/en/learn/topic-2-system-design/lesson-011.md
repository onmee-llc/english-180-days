---
title: "Day 25 — Data Consistency Patterns"
description: "Eventual consistency, sagas, and when two-phase commit is wrong."
date: 2026-04-13
---

## Session goal

Explain how to maintain consistency across services in a distributed transaction.

## Shadowing passage

> Consistency in distributed systems exists on a spectrum. Strong consistency means every read sees the most recent write, regardless of which node you hit — that's what you get from a single-node relational database. Eventual consistency means writes propagate with some delay, and reads may return stale data temporarily. The question to drive this trade-off is always: what is the business cost of returning stale data? For a financial ledger: zero tolerance. For product recommendations: minutes of staleness are fine. The saga pattern addresses a harder problem: maintaining business-level consistency across multiple services without a distributed transaction. A saga decomposes a complex operation into local transactions, each of which publishes an event triggering the next step. On failure, compensating transactions undo previous steps. Example: book a flight, charge the card, issue the ticket. If issuing the ticket fails, cancel the charge and release the seat. You don't need ACID across services. You need a reliable compensation mechanism and a way to handle partial failure without human intervention. Two-phase commit is the theoretical alternative, but in practice the coordinator is a single point of failure and the performance overhead is significant. I've never seen 2PC used successfully in a modern microservices system.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| business cost of stale data | /ˈbɪznɪs kɒst əv steɪl ˈdeɪtə/ | frame consistency as a business decision, not a technical preference |
| compensating transactions | /ˈkɒmpɛnseɪtɪŋ trænsˈækʃənz/ | the undo mechanism in saga pattern |
| reliable compensation mechanism | /rɪˈlaɪəbl ˌkɒmpɛnˈseɪʃən ˈmɛkənɪzəm/ | what you actually need instead of ACID across services |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Design a saga for: user registers, sends welcome email, credits free trial balance.


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
