---
title: Key Vocabulary
description: Essential phrases and terms for AI/ML Pipelines & LLM Integration.
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

## Models & Architecture

| Term / Phrase | Usage Example |
|---------------|---------------|
| Large Language Model | "We use a Large Language Model as the reasoning engine behind the content pipeline." |
| foundation model | "The foundation model handles general language tasks; we customize behavior through prompting." |
| fine-tuning | "We considered fine-tuning but chose RAG because our knowledge base changes weekly." |
| token | "Each API call costs based on the number of input and output tokens processed." |
| context window | "The model's context window is 128K tokens, enough for our longest documents." |
| temperature | "We set temperature to 0.2 for factual extraction and 0.8 for creative generation." |
| top-p | "Top-p sampling at 0.9 gives us diversity without completely random outputs." |

## Prompting & Agents

| Term / Phrase | Usage Example |
|---------------|---------------|
| prompt / system prompt / user prompt | "The system prompt defines the model's role; the user prompt carries the actual request." |
| completion | "The model returns a completion that we parse into structured JSON." |
| embedding | "We generate embeddings for each document chunk and store them in pgvector." |
| vector store / semantic search | "The vector store enables semantic search across fifty thousand documents." |
| agentic workflow | "The agentic workflow lets the model decide which tools to call at each step." |
| tool calling / function calling | "Tool calling allows the model to query our database or trigger a webhook." |
| hallucination | "We reduce hallucination by grounding responses in retrieved documents." |
| grounding | "RAG provides grounding — the model cites real sources instead of generating facts." |
| retrieval augmentation | "Retrieval augmentation improved answer accuracy from sixty-two to eighty-nine percent." |

## Pipeline & Production

| Term / Phrase | Usage Example |
|---------------|---------------|
| inference | "Inference latency is our main bottleneck — each call takes two to four seconds." |
| streaming | "We stream responses to the UI so users see output immediately, not after a five-second wait." |
| fallback model | "If the primary model hits rate limits, we fall back to a smaller, faster model." |
| prompt injection | "We sanitize user input to prevent prompt injection attacks." |
| evaluation framework | "Our evaluation framework scores each output on format, accuracy, and relevance." |

## Interview Connectors

| Phrase | When to Use |
|--------|-------------|
| "The model takes in..." | Describing the AI pipeline input |
| "The pipeline works by..." | Walking through the system architecture |
| "I use Claude API here because..." | Justifying model selection |
| "The prompt is structured as..." | Explaining prompt engineering decisions |
| "We measure quality by..." | Discussing evaluation and testing |
| "The cost per call is roughly..." | Showing production awareness |
