---
title: Content Outline
description: Core concepts and frameworks for API Architecture & Microservices.
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

## 1. REST API Design Principles

**Resource naming** — URLs are nouns, not verbs. `/users/123` not `/getUser?id=123`. Plural nouns for collections, singular for specific resources.

**HTTP methods** — GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove). Each method has clear semantics.

**Status codes** — 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthenticated), 403 (Forbidden), 404 (Not Found), 429 (Rate Limited), 500 (Server Error). Use them correctly — they make APIs self-documenting.

**Versioning** — URL path (`/v1/users`) or header-based. Never break existing clients. Maintain at least one prior version during a defined sunset period.

## 2. GraphQL

**When it beats REST** — when the client needs flexible queries, when mobile clients need to minimize round trips, when the frontend team wants to control what data they receive.

**Schema design** — types, queries, mutations, subscriptions. The schema is the contract.

**N+1 problem** — a query that fetches a list, then fires one query per item. Solve with DataLoader (batching) or eager loading.

## 3. API Authentication

**JWT (JSON Web Token)** — self-contained token with claims. Stateless — no session lookup needed. But cannot be revoked without a blacklist.

**OAuth2** — authorization framework for third-party access. Four flows: authorization code (most common), client credentials (machine-to-machine), PKCE (mobile/SPA), implicit (deprecated).

**API keys** — simple, but no user context. Use for server-to-server communication or public rate-limited endpoints.

## 4. Microservices Patterns

**Service discovery** — how services find each other. DNS-based (simple), service registry like Consul or Eureka (dynamic), or Kubernetes built-in service discovery.

**Circuit breaker** — if a downstream service is failing, stop sending requests to it. Three states: closed (normal), open (all requests fail fast), half-open (testing recovery). Prevents cascading failures.

**Saga pattern** — distributed transactions across services. Each step has a compensating action. If step 3 fails, undo steps 2 and 1. Choreography (event-driven) vs orchestration (central coordinator).

## 5. Service Communication

**Synchronous (HTTP/gRPC)** — request-response. Simple, immediate. Use when the caller needs the result now.

**Asynchronous (message queue)** — fire and forget. Decouples producer from consumer. Use when the caller doesn't need an immediate response.

**gRPC** — binary protocol, strongly typed with Protocol Buffers. Faster than REST for internal service communication. Supports streaming.

## 6. API Documentation

**OpenAPI/Swagger** — machine-readable API specification. Generates documentation, client SDKs, and server stubs.

**Contract-first design** — write the API spec before the code. Frontend and backend teams can work in parallel.

## 7. Rate Limiting & Throttling

**Token bucket** — requests consume tokens. Tokens refill at a fixed rate. Allows bursts up to the bucket size.

**Sliding window** — count requests in a rolling time window. More precise than fixed windows.

**429 Too Many Requests** — the standard HTTP response. Include `Retry-After` header to tell clients when to try again.
