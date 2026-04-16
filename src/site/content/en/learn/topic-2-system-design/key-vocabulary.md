---
title: Key Vocabulary
description: Essential phrases and terms for System Design Fundamentals.
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

## Architecture & Scale

| Term / Phrase | Usage Example |
|---------------|---------------|
| bottleneck | "The database became the main bottleneck as traffic grew." |
| throughput | "The system handles around ten thousand requests per second throughput." |
| latency | "We kept the p99 latency under two hundred milliseconds." |
| availability | "The service maintains four nines of availability." |
| single point of failure | "We eliminated the single point of failure by adding a replica." |
| fault tolerance | "The system is designed for fault tolerance — one node can go down without impact." |
| redundancy | "We added redundancy at every layer to prevent data loss." |

## Scaling

| Term / Phrase | Usage Example |
|---------------|---------------|
| horizontal scaling | "We scaled horizontally by adding more API server instances." |
| vertical scaling | "Initially we scaled vertically, but we hit the memory ceiling." |
| sharding | "We implemented sharding on the user ID to distribute the write load." |
| partitioning | "Data partitioning allowed each shard to handle its own subset of queries." |
| read-heavy workload | "This is a read-heavy workload, so caching makes the biggest impact." |
| write-heavy workload | "For write-heavy workloads, I'd consider a message queue in front of the database." |

## Consistency & Trade-offs

| Term / Phrase | Usage Example |
|---------------|---------------|
| eventual consistency | "We accepted eventual consistency here because real-time accuracy wasn't critical." |
| strong consistency | "Financial transactions require strong consistency — no stale reads allowed." |
| trade-off | "The trade-off between consistency and availability is the core decision here." |
| constraint | "The main constraint was that the system needed to handle bursts of traffic during peak hours." |
| assumption | "My assumption is that we need to support around fifty thousand daily active users." |

## Interview Connectors

| Phrase | When to Use |
|--------|-------------|
| "Let me clarify the requirements first..." | Opening a system design answer |
| "The bottleneck here would be..." | Identifying the critical path |
| "I'd choose X over Y because..." | Explaining a design decision |
| "The trade-off is..." | Discussing alternatives |
| "At this scale, we'd need to..." | Scaling discussion |
| "One concern with this approach is..." | Showing critical thinking |
| "To handle failure, I would..." | Reliability discussion |
