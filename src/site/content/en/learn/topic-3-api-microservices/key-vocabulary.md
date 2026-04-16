---
title: Key Vocabulary
description: Essential phrases and terms for API Architecture & Microservices.
date: 2026-04-13
---

## How to use this module

For each phrase or term:
1. Say it out loud 3 times.
2. Use it in a sentence about your own work.
3. Practice using it naturally in an answer to a practice question.

**Goal:** Zero hesitation when these words come up in an interview.

## Daily drill

Pick 3–5 phrases from this list each day. Use each one out loud in a complete sentence before moving on.

---

## API Design

| Term / Phrase | Usage Example |
|---------------|---------------|
| endpoint | "This endpoint handles user authentication and returns a JWT." |
| resource | "Each resource in our API maps to a database entity." |
| payload | "The request payload contains the user profile data in JSON format." |
| response body | "The response body includes the created resource with its generated ID." |
| idempotent | "PUT is idempotent — calling it twice with the same data produces the same result." |
| stateless | "Our API is completely stateless — no session data stored on the server." |
| RESTful | "We follow RESTful conventions: resource-oriented URLs and proper HTTP methods." |

## Microservices

| Term / Phrase | Usage Example |
|---------------|---------------|
| service mesh | "We use Istio as our service mesh to handle traffic routing and observability." |
| sidecar proxy | "Each service runs with a sidecar proxy that handles mTLS and load balancing." |
| circuit breaker | "The circuit breaker opens after five consecutive failures and fails fast for thirty seconds." |
| retry logic | "We implement retry logic with exponential backoff for transient failures." |
| backoff strategy | "The backoff strategy doubles the wait time after each retry: one, two, four, eight seconds." |
| contract-first design | "We practice contract-first design — the OpenAPI spec is written before any code." |
| API versioning | "We version our APIs through URL paths: v1, v2, with a six-month sunset policy." |

## GraphQL

| Term / Phrase | Usage Example |
|---------------|---------------|
| schema | "The GraphQL schema defines every type, query, and mutation available to clients." |
| resolver | "Each field in the schema has a resolver that fetches the data from the right source." |
| mutation | "We use mutations for any write operation — creating, updating, or deleting resources." |
| subscription | "Real-time updates are handled through GraphQL subscriptions over WebSocket." |

## Interview Connectors

| Phrase | When to Use |
|--------|-------------|
| "This endpoint handles..." | Describing API behavior |
| "The response returns..." | Explaining what the client gets back |
| "We use JWT here because..." | Justifying authentication choice |
| "The trade-off is..." | Comparing REST vs GraphQL or sync vs async |
| "The circuit breaker prevents..." | Explaining resilience patterns |
| "We version the API by..." | Discussing backward compatibility |
