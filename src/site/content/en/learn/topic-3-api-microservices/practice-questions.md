---
title: Practice Questions
description: 5 interview questions to drill for API Architecture & Microservices.
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

## Question 1 — What is the difference between REST and GraphQL? When would you use each?

**What the interviewer expects:** Not a religious answer. Show you understand both. REST: simple CRUD, caching, multiple consumers. GraphQL: flexible queries, mobile-first, complex data graphs.

**Structure your answer:** Define each briefly → Strengths of REST → Strengths of GraphQL → Decision criteria → A real example from your work.

## Question 2 — How do you handle authentication in a microservices architecture?

**What the interviewer expects:** API gateway handles token validation, services receive verified claims. JWT vs session-based. Service-to-service auth (mTLS, service accounts). Token refresh strategy.

**Structure your answer:** Gateway-level auth → Token propagation → Service-to-service trust → Real example → Security considerations.

## Question 3 — What is a circuit breaker and why is it important?

**What the interviewer expects:** The three states (closed, open, half-open). Why cascading failures happen. How the circuit breaker prevents them. Real-world configuration (failure threshold, timeout, recovery probing).

**Structure your answer:** The problem (cascading failure) → The pattern (three states) → Configuration → What happens from the user's perspective → Your experience.

## Question 4 — Walk me through how you designed an API in a recent project

**What the interviewer expects:** Requirements → Resource modeling → Authentication → Error handling → Documentation → Versioning. Show end-to-end thinking, not just endpoint listing.

**Structure your answer:** Project context → Requirements → Key design decisions → How you handled auth → Documentation approach → Lessons learned.

## Question 5 — How do you version an API without breaking existing clients?

**What the interviewer expects:** Versioning strategies (URL path, header, query param). Sunset policies. Backward compatibility principles. Migration support for consumers.

**Structure your answer:** Your preferred strategy (URL path) → How you communicate changes → Sunset timeline → How you help consumers migrate → Real example.
