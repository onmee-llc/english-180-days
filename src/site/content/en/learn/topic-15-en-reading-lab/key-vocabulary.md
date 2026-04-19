---
title: "Key Vocabulary — EN Reading Lab"
description: High-frequency vocabulary from ByteByteGo and Anthropic Research articles.
date: 2026-04-19
---

## ByteByteGo vocabulary — System design

| Term | Definition | Typical context sentence |
|------|-----------|--------------------------|
| throughput | the volume of data or requests processed per unit of time | "This design achieves 100K requests/second throughput under normal load." |
| latency | the time delay between a request being made and a response received | "Database indexing reduces query latency from 2 seconds to under 20ms." |
| horizontal scaling | adding more machines to handle increased load | "Horizontal scaling is preferred over vertical scaling for stateless services." |
| vertical scaling | upgrading a single machine's CPU, memory, or disk | "Vertical scaling has a ceiling — once you hit the largest available instance, you must go horizontal." |
| sharding | splitting a database across multiple nodes by a partition key | "We shard the user table by user_id to distribute write load evenly." |
| replication | copying data to multiple nodes for fault tolerance and read performance | "Read replicas reduce load on the primary database by handling SELECT queries." |
| consistency | the guarantee that all reads reflect the most recent write | "In a distributed system, strong consistency and high availability conflict — see CAP theorem." |
| idempotency | an operation that produces the same result if applied multiple times | "POST endpoints for payment must be idempotent to handle retries safely." |
| cache invalidation | the process of removing or updating stale cached data | "Cache invalidation is notoriously difficult — the key is defining a clear TTL strategy." |
| rate limiting | restricting the number of requests a client can make per time window | "Rate limiting protects the API from abuse and ensures fair use across clients." |
| circuit breaker | a pattern that stops calling a failing service to allow it to recover | "The circuit breaker trips after 5 consecutive failures and retries after 30 seconds." |
| fanout | distributing a single event to multiple downstream consumers | "Write fanout to followers on a social graph is expensive at scale." |

## Anthropic Research vocabulary — AI alignment and safety

| Term | Definition | Typical context sentence |
|------|-----------|--------------------------|
| alignment | the property of an AI system acting in accordance with human values and intentions | "Alignment research aims to ensure that more capable AI systems remain beneficial." |
| Constitutional AI | Anthropic's method of training AI assistants using a set of written principles | "Constitutional AI reduces the need for human labeling by using AI self-critique." |
| RLHF | Reinforcement Learning from Human Feedback — training using human preference signals | "RLHF produced the first generation of helpful chat assistants." |
| hallucination | when a language model generates plausible-sounding but false information | "Hallucination rates drop significantly when the model is grounded with RAG." |
| interpretability | the study of understanding what is happening inside a model's internal representations | "Mechanistic interpretability attempts to reverse-engineer circuits in transformer models." |
| safety | the property of an AI system avoiding harmful, dangerous, or unintended behaviors | "Safety evaluation includes both capability tests and red-teaming against misuse." |
| red-teaming | the practice of adversarially testing an AI system for failure modes before deployment | "Red-teaming found several prompt injection vulnerabilities before the model went to production." |
| over-refusal | when a model declines a legitimate request due to overly conservative safety behavior | "Over-refusal frustrates users and reduces utility — it is as much a safety failure as under-refusal." |
| principal hierarchy | the set of entities (system operator, user) whose instructions the model should follow | "The principal hierarchy defines whose instructions take precedence when they conflict." |
| corrigibility | the property of an AI system that allows humans to correct or shut it down | "Corrigibility is a desired property for current AI systems while alignment research matures." |

## Phrases for reading strategies

| Phrase | Use |
|--------|-----|
| The main claim of this article is… | One-sentence summary opener |
| The key insight is… | Presenting a concept from an article in a talk |
| The article argues that… | Academic/research article summary |
| The author distinguishes between… | When the article draws a contrast |
| According to ByteByteGo / Anthropic… | When citing a source in writing or speech |
