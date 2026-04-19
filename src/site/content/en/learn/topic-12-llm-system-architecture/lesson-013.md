---
title: "Day 153 — System Design Review"
description: "Full dry run: present your complete KPI 1 system design in 5 minutes."
date: 2026-04-19
---

## Session goal

Deliver a 5-minute verbal walkthrough of your KPI 1 system — covering all six areas from this topic.

## Shadowing passage — Review passage

> Let me give you the full picture of the system I built. The use case is internal document Q&A: engineers submit a question, and the system retrieves relevant sections from our internal knowledge base and generates a precise answer using Claude 3.5 Sonnet. The data flow is as follows. The user's query goes to the API gateway, which authenticates and rate-limits. The inference service retrieves the top-five relevant document chunks from a pgvector database using cosine similarity. It constructs the prompt: system instructions, retrieved chunks, and the user query — checking that the total token count is under 8,000 before sending. The LLM call uses Anthropic's API with retry on 429 and 5xx, exponential backoff, and a hard timeout of 30 seconds. Responses are streamed back to the client via SSE. Every call logs prompt_tokens, completion_tokens, latency, and the matched document IDs. I chose Anthropic over OpenAI for this use case because the instruction-following quality on long-context prompts is measurably better — I ran a 50-question eval set against both models and the Claude output was correct on 82 percent versus 74 percent for GPT-4o. The architecture decision record for that choice is in our Confluence. The system has been running for three months. P95 latency is 4.2 seconds, error rate is 0.3 percent, and monthly cost is under $200 for about 3,000 queries.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| cosine similarity | [Nghe →](https://youglish.com/pronounce/cosine%20similarity/english) | the standard distance metric for vector search |
| measurably better | [Nghe →](https://youglish.com/pronounce/measurably%20better/english) | backed by a metric — not just a feeling |
| eval set | [Nghe →](https://youglish.com/pronounce/eval%20set/english) | a fixed set of test questions to compare model outputs |

## 30-minute protocol

**Minutes 1–10** — Shadow the passage above 3 times. Focus on the confident, structured delivery.

**Minutes 11–20** — Replace every detail in the passage with your actual KPI 1 system details. Practice out loud.

**Minutes 21–28** — Record your 5-minute system walkthrough. No notes. Time yourself.

**Minutes 29–30** — Listen back. Identify one structural gap: what did you forget to cover?

## Reflection

This is your KPI 1 demo script. Polish it every week until it feels effortless.

## Anti-Translation Drill — Full Narration *(5 min)*

Narrate your entire system from memory. When you blank out — do NOT switch to Vietnamese. Use: "and then…", "which means…", "the reason for that is…"

## Self-Check

- [ ] Completed 5-minute system walkthrough recording
- [ ] Identified one structural gap to fix
- [ ] Zero Vietnamese in the narration
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
