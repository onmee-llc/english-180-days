---
title: Content Outline
description: Core concepts and frameworks for System Design Fundamentals.
date: 2026-04-13
---

## How to use this module

1. Read the outline once silently.
2. Close the page. Try to recall the main points out loud.
3. Come back and fill in what you missed.
4. Repeat until you can present the outline verbally in 3–5 minutes.

## Practice format

For each concept below:
- State what it is (1 sentence)
- Explain when/why you'd use it (1–2 sentences)
- Give a real example from your own work (1–2 sentences)

---

## 1. Scalability

**Horizontal scaling** — adding more machines to handle load. Use when requests are stateless and can be distributed. Example: adding more API server instances behind a load balancer.

**Vertical scaling** — adding more CPU/RAM to a single machine. Simpler but has a ceiling. Use for databases before you shard.

**When to choose:** Start vertical (simpler), plan for horizontal (scalable). If your system handles 10x traffic in bursts, horizontal is non-negotiable.

## 2. Load Balancing

**Round robin** — distributes requests evenly across servers. Simple, works for stateless services.

**Least connections** — sends traffic to the server with fewest active connections. Better for long-lived requests.

**Sticky sessions** — routes the same user to the same server. Needed when server holds session state (but avoid this if possible).

## 3. Database Design

**SQL (PostgreSQL, MySQL)** — structured data, strong consistency, complex queries with JOINs. Use for transactions, financial data, relational models.

**NoSQL (MongoDB, DynamoDB)** — flexible schema, horizontal scaling, high write throughput. Use for logs, user activity, document-heavy data.

**Indexing** — speeds up reads, slows down writes. Index columns you query frequently. Composite indexes for multi-column queries.

## 4. Caching

**Redis** — in-memory key-value store. Use for session data, rate limiting, frequently accessed queries.

**CDN (CloudFront, Cloudflare)** — caches static assets close to users. Reduces latency for images, CSS, JS.

**Cache invalidation** — the hardest problem. Strategies: TTL (time-to-live), write-through (update cache on write), cache-aside (lazy loading).

## 5. Message Queues

**Async processing** — decouple producers from consumers. The sender doesn't wait for the receiver to finish.

**Kafka** — high-throughput, ordered, durable. Use for event streaming, log aggregation, real-time analytics.

**RabbitMQ** — flexible routing, acknowledgments, dead letter queues. Use for task queues, background jobs, notifications.

## 6. CAP Theorem

**Consistency** — every read returns the most recent write.

**Availability** — every request gets a response (even if stale).

**Partition tolerance** — the system works even when network splits occur.

**In practice:** You always need P (networks fail). So the real choice is CP (consistent but may reject requests) vs AP (available but may serve stale data). Banking → CP. Social media feeds → AP.

## 7. API Gateway

**Rate limiting** — protect services from abuse. Token bucket or sliding window algorithms.

**Authentication** — validate tokens before requests reach backend services.

**Routing** — direct requests to the correct microservice based on URL path or headers.

## 8. Monolith vs Microservices

**Monolith** — single deployable unit. Simpler to develop, test, deploy. Start here.

**Microservices** — independently deployable services. Better for large teams, different scaling needs per service.

**When to split:** When team size exceeds 8–10 engineers, when parts of the system need different scaling profiles, or when deployment bottlenecks slow the team down.

---

## Design Interview Framework

Use this 5-step structure for any system design question:

1. **Clarify requirements** — functional (what it does) + non-functional (scale, latency, consistency)
2. **Estimate scale** — users, requests/second, storage needed
3. **Design high-level architecture** — boxes and arrows, major components
4. **Deep dive** — pick 2–3 critical components and explain design decisions
5. **Discuss trade-offs** — what you chose, what you rejected, and why
