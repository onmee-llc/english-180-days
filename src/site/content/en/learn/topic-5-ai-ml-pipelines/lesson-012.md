---
title: "Day 64 — AI/ML System Design Mock"
description: "End-to-end AI system design — present a complete architecture under time pressure."
date: 2026-04-13
---

## Session goal

Design the AI pipeline for a content intelligence platform in 12 minutes.

## Shadowing passage

> Let me design the AI content intelligence platform. The system ingests social analytics, generates content, and continuously improves based on performance feedback. The loop has five stages. Stage one: data ingestion. Scheduled jobs pull analytics from Pinterest, Instagram, and TikTok APIs. Raw events land in BigQuery. Preprocessing jobs compute engagement metrics by content category and time segment. Stage two: brand context retrieval. When a content brief request arrives, the RAG layer retrieves the customer's brand guidelines, best-performing past content, and current trend signals from the vector store. This context reduces hallucination and keeps outputs brand-consistent. Stage three: multi-step generation. The planner LLM decomposes the quarterly content plan into individual brief generation tasks. For each task, a tool call retrieves the specific analytics segment, and the writer LLM generates the brief. Output validation gates for format compliance and brand alignment. Stage four: feedback loop. Post-publish performance data flows back from the platform APIs. We embed the actual performance outcome — engagement, saves, click rate — alongside the original brief in the vector store. Future retrievals include high-performing examples with proven outcomes, not just brand guidelines. Stage five: evaluation and monitoring. A weekly automated evaluation run scores a random sample of recent outputs using an LLM judge. Score trends are the primary quality signal. When average quality drops, prompt engineers are alerted before users notice.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| feedback loop | /ˈfiːdbæk luːp/ | performance data improves future outputs — the system gets better over time |
| multi-step generation | /ˈmʌlti stɛp ˌdʒɛnəˈreɪʃən/ | planner + writer model calls — more reliable than single-shot complex generation |
| quality signal | /ˈkwɒlɪti ˈsɪɡnəl/ | the metric that tells you AI output quality is changing — monitor it or be surprised |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How would you add an A/B testing layer to continuously compare prompt versions in production?
