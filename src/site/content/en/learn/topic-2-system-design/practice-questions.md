---
title: Practice Questions
description: 5 interview questions to drill for System Design Fundamentals.
date: 2026-04-13
---

## How to use this module

For each question:
1. **First pass:** Answer out loud with notes allowed.
2. **Second pass:** Answer out loud — no notes, no preparation.
3. **Record yourself** on at least one question per session and listen back.

**Target:** Each answer should feel automatic — natural, structured, confident.

## Scoring yourself

After each answer, ask:
- Was the structure clear? (Opening → Main point → Example → Conclusion)
- Did I hesitate on technical vocabulary?
- Did the answer take 2–4 minutes?
- Would I be satisfied if this was a real interview?

---

## Question 1 — Design a URL shortener (like bit.ly)

**What the interviewer expects:** Clarify requirements (read-heavy vs write-heavy), estimate scale, design the key components (hashing, database, redirect flow), discuss trade-offs (hash collision, caching, analytics).

**Structure your answer:** Requirements → Scale estimation → High-level design → Key decisions (hash function, database choice) → Caching strategy → Trade-offs.

## Question 2 — Design a content scheduling system

**What the interviewer expects:** Relevant to your experience with Pinterest SaaS. Cover scheduling queue, content generation pipeline, publishing workflow, failure handling.

**Structure your answer:** Functional requirements → Components (scheduler, queue, workers, publisher) → Database design → Failure recovery → Scaling considerations.

## Question 3 — How would you scale a system from 1,000 to 1,000,000 users?

**What the interviewer expects:** Progressive scaling strategy. Start simple, identify bottlenecks at each stage, introduce solutions (caching, read replicas, sharding, CDN, microservices).

**Structure your answer:** Stage 1 (1K) → Stage 2 (10K) → Stage 3 (100K) → Stage 4 (1M). At each stage: what breaks, what you add, why.

## Question 4 — What is the CAP theorem and when does it matter in practice?

**What the interviewer expects:** Clear explanation of C, A, P. Real-world examples of CP vs AP. Show you understand this is about trade-offs, not theory.

**Structure your answer:** Define each letter → Explain why you always need P → Give a CP example (banking) → Give an AP example (social feed) → Connect to your own experience.

## Question 5 — When would you choose MongoDB over PostgreSQL?

**What the interviewer expects:** Not a religious answer. Show you understand the strengths of each. Document model vs relational model. Schema flexibility vs query power.

**Structure your answer:** PostgreSQL strengths (ACID, JOINs, mature) → MongoDB strengths (flexible schema, horizontal scaling, document model) → Decision criteria → A real example from your work.
