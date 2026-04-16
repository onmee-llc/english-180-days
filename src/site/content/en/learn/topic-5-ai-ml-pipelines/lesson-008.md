---
title: "Day 60 — Embedding and Search"
description: "Semantic search architecture — when to use dense retrieval vs keyword search."
date: 2026-04-13
---

## Session goal

Design the search layer for an AI-powered content recommendation system.

## Shadowing passage

> Combining semantic search with keyword search gives the best practical results for most use cases. Pure keyword search — BM25, Elasticsearch — is fast, interpretable, and works well when users know the exact terminology. It fails on paraphrase, synonym, and conceptual similarity. Semantic search with vector embeddings overcomes that: the query is embedded and compared against document embeddings by cosine similarity, surfacing results that are conceptually related even with no word overlap. The limitations of pure semantic search: it can over-match on superficially similar documents that don't actually answer the query, and it's slower than keyword lookup. Hybrid search combines both: a keyword retrieval pass and a semantic retrieval pass produce candidate sets, which are then merged and re-ranked using a cross-encoder. This is the approach I use for the content recommendation system in my SaaS — the hybrid retriever gives better recall than either method alone, and the re-ranker significantly improves precision on the top results. Infrastructure: I use pgvector in PostgreSQL for the vector index — this avoids a separate vector database service for moderate-scale workloads under ten million embeddings. Above that scale, I'd move to a dedicated solution like Pinecone or Weaviate for better performance on ANN search.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| cosine similarity | [Nghe →](https://youglish.com/pronounce/cosine%20similarity/english) | measures the angle between vectors — the standard similarity metric for embeddings |
| BM25 | [Nghe →](https://youglish.com/pronounce/BM25/english) | classic probabilistic keyword ranking — still competitive with neural methods |
| hybrid retriever | [Nghe →](https://youglish.com/pronounce/hybrid%20retriever/english) | combines keyword and semantic search — better recall than either alone |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

At what scale would you move from pgvector to a dedicated vector database? What metric tells you?


## Anti-Translation Drill — Think in English *(5 min)*

Pick **one key phrase** from today's table. Explain what it means using **only English**.

- No Vietnamese. No dictionary.
- If you don't know a word, describe it: *"It's when you…"* / *"It's similar to…"* / *"The opposite would be…"*
- Then use the phrase in a new sentence about your own experience.

> Goal: Train circumlocution — the skill of explaining anything without knowing the exact word. This is what fluent speakers actually do.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
