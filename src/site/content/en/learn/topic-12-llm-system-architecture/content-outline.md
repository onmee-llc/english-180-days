---
title: Content Outline
description: Core concepts for designing and presenting LLM-powered systems end-to-end.
date: 2026-04-19
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

## 1. LLM Provider Selection

**Choosing a provider** — OpenAI for general-purpose tasks and tool calling; Anthropic Claude for long-context reasoning and instruction-following; Gemini for Google ecosystem integration and multimodal tasks. The choice depends on cost, latency, capability, and compliance requirements.

**Model tiers** — Every provider offers a fast/cheap model and a powerful/expensive model. Use the fast model for classification, routing, and high-volume tasks. Reserve the powerful model for reasoning-heavy generation. Document your decision with cost estimates.

**Vendor lock-in mitigation** — Abstract your LLM calls behind an interface. This lets you swap providers when pricing changes or a new model releases without rewriting business logic.

## 2. API Integration Patterns

**Authentication and secrets** — Never hardcode API keys. Use environment variables at minimum; prefer secrets managers (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault) in production. Rotate keys quarterly.

**Request structure** — Every LLM API call has: model, messages (with roles: system, user, assistant), and parameters (temperature, max_tokens, top_p). Understand what each parameter controls and set them explicitly.

**Streaming responses** — Receive tokens incrementally via server-sent events. Required for chat UIs and any UX where the user waits. Use `stream=true` and handle partial chunks in a loop. Buffer incomplete UTF-8 characters across chunks.

**Async client usage** — In Python, use `httpx` or the provider's async client for concurrent LLM calls. Never block an async event loop with synchronous HTTP calls.

## 3. Reliability Patterns

**Retry with exponential backoff** — LLM APIs return 429 (rate limit) and 5xx errors. Retry up to 3 times with delays: 1s, 2s, 4s. Use `tenacity` in Python or implement a simple retry loop. Log every retry with the reason.

**Timeout handling** — Set explicit timeouts: connection timeout (5s), read timeout (30–60s for streaming). Never let LLM calls block indefinitely. If a call times out, fail fast and return a fallback.

**Fallback strategy** — When the primary model fails: (1) retry same model, (2) try a cheaper model in the same provider, (3) return a deterministic fallback response. Define the fallback behavior in your architecture doc before you need it.

**Circuit breaker** — After N consecutive failures, stop sending requests to the LLM API for M seconds. Prevents cascading failures. Implement with a state machine: Closed → Open → Half-Open.

## 4. Cost and Token Management

**Token counting** — Count tokens *before* sending the request using `tiktoken` (OpenAI) or provider SDKs. This prevents unexpected `context_length_exceeded` errors and lets you estimate costs ahead of time.

**Context window management** — Every model has a context window limit (e.g., 128k tokens for Claude 3.5 Sonnet). For long conversations, truncate or summarize earlier messages. For RAG, limit retrieved chunks to fit within budget.

**Token cost logging** — Log `prompt_tokens` and `completion_tokens` from every API response. Aggregate daily/weekly. Alert when daily spend crosses a threshold. This is non-negotiable for production systems.

**Cost optimization** — Cache identical prompts (same input → same output for deterministic tasks). Use cheaper models for pre-filtering before expensive models. Batch requests where the API supports it.

## 5. Observability and Monitoring

**Latency tracking** — Measure and log: time-to-first-token (TTFT) for streaming, total latency for non-streaming. Set SLOs: p50, p95, p99. Alert if p95 exceeds your budget (typically 3–5s for interactive, 30s for async).

**Error rate monitoring** — Track error types: rate limits, context exceeded, content policy, server errors. Use Datadog, Prometheus, or Cloud Monitoring. Alert at >1% error rate in a 5-minute window.

**Output quality tracking** — Define 3–5 automated quality checks: format validation, length bounds, required fields present. Log quality pass/fail rate per prompt template version.

**LLM observability tools** — LangSmith, Helicone, Weave (W&B). These tools provide request tracing, prompt version management, and evaluation frameworks. Choose one and integrate early.

## 6. Architecture Documentation

**Data flow diagram** — Show every component: client → API gateway → your service → LLM API → post-processing → response. Include async jobs, queues, databases. Use arrows with labels (e.g., "streaming HTTP", "batch job", "webhook").

**Component diagram** — Show which services exist, how they communicate, and what each owns. Your LLM service should be a clear boundary with defined inputs/outputs.

**Architecture Decision Record (ADR)** — For every major decision (which model, which vector DB, sync vs async), write a one-page ADR: context, decision, consequences. This is the artifact that proves Principal-level thinking.

**README for onboarding** — Assume the reader has never seen your codebase. Cover: what the system does, how to run it locally, how to deploy, how to monitor, and known limitations. If a new engineer can onboard in 30 minutes, your README is good.
