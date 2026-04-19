---
title: "Day 191 — Load Balancing Strategies (ByteByteGo)"
description: "Reading Lab: Distributed systems vocabulary from ByteByteGo."
date: 2026-04-19
---

## Session goal

Build distributed systems vocabulary. Practice applying reading vocabulary immediately in writing.

## Article

**Source:** ByteByteGo Blog
**Topic:** Load balancing — round robin, least connections, consistent hashing, health checks
**Find it at:** [blog.bytebytego.com](https://blog.bytebytego.com/) — search "load balancing"

---

## Part 1 — Skim (5 minutes)

Read headings, first sentences, diagrams. Answer:
> "What load balancing algorithms does the article cover and what is the key difference between them?"

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
| load balancer | a server that distributes incoming traffic across multiple backend servers |
| round robin | distributes requests sequentially to each server in order |
| least connections | routes each new request to the server with the fewest active connections |
| consistent hashing | a hashing scheme that minimizes remapping when servers are added or removed |
| health check | a periodic test to determine whether a backend server is available |
| sticky session | routing a client's requests to the same server throughout a session |
| upstream | the backend servers that the load balancer distributes to |
| Layer 4 vs Layer 7 | L4 load balancing works at TCP level; L7 can inspect HTTP headers and route by path or content |

---

## Part 3 — One-sentence summary (5 minutes)

Write one sentence summarizing when you would use consistent hashing vs round robin. Under 30 words.

---

## Vocabulary application

Use two of today's terms in a sentence about your KPI 1 system or a hypothetical LLM API deployment.

1. _____ → "In our system, _____."
2. _____ → "If we scaled to multiple LLM service instances, _____."

## Anti-Translation Drill

Explain consistent hashing to a colleague in 60 seconds. English only.

## Self-Check

- [ ] Skim completed within 5 minutes
- [ ] 5–8 vocabulary terms extracted
- [ ] One-sentence summary written
- [ ] Two vocabulary terms applied to own work
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
