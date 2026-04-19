---
title: "Day 185 — Real-Time Notifications System Design (ByteByteGo)"
description: "Reading Lab: Async systems vocabulary from ByteByteGo."
date: 2026-04-19
---

## Session goal

Practice vocabulary extraction for async system design. Focus on connecting terms to your KPI 1 architecture work.

## Article

**Source:** ByteByteGo Blog
**Topic:** Designing real-time notification systems — WebSocket, long polling, server-sent events
**Find it at:** [blog.bytebytego.com](https://blog.bytebytego.com/) — search "real-time notifications" or "WebSocket"

---

## Part 1 — Skim (5 minutes)

Read headings, first sentences, diagrams. Answer:
> "What are the three approaches the article compares, and what is the trade-off between them?"

---

## Part 2 — Vocabulary extraction (10 minutes)

| Term | Context sentence from the article | Definition (in English) |
|------|----------------------------------|------------------------|
|      |                                  |                        |
|      |                                  |                        |
|      |                                  |                        |
|      |                                  |                        |
|      |                                  |                        |

**Starter vocabulary:**

| Term | Definition |
|------|-----------|
| WebSocket | a protocol that provides a persistent, bidirectional connection between client and server |
| long polling | the client holds a request open until the server has data to send, then reconnects immediately |
| server-sent events (SSE) | a unidirectional stream from server to client over HTTP |
| message queue | a buffer that decouples producers and consumers in an async system |
| fan-out | the distribution of a message from one source to many recipients |
| event-driven architecture | a system design where components communicate via events rather than direct calls |
| backpressure | the mechanism by which a slow consumer slows down a fast producer to avoid buffer overflow |

---

## Part 3 — One-sentence summary (5 minutes)

Write one sentence capturing the article's main recommendation. Under 30 words.

Example:
> "ByteByteGo compares WebSocket, long polling, and SSE for real-time notifications, recommending WebSocket for bidirectional use cases and SSE for unidirectional server-push scenarios."

---

## Connection to your work

Does your KPI 1 system use any real-time or async communication? If yes: how does this vocabulary apply? If no: would any of these patterns improve the system?

## Anti-Translation Drill

Explain the difference between WebSocket and long polling to a product manager. English only. 60 seconds.

## Self-Check

- [ ] Skim completed, identified main comparison in the article
- [ ] 5–8 vocabulary terms extracted
- [ ] One-sentence summary written
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
