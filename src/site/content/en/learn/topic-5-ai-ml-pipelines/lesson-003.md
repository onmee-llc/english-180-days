---
title: "Day 55 — RAG Architecture"
description: "Retrieval-augmented generation — when to use it and how to design it."
date: 2026-04-13
---

## Session goal

Design a RAG system for a customer support knowledge base.

## Shadowing passage

> Retrieval-augmented generation solves the most practical problem with LLMs in enterprise settings: the model doesn't know your private data. RAG separates factual knowledge storage from reasoning capability. The architecture has three layers. Storage layer: a vector database — I use Pinecone or pgvector in PostgreSQL — stores embeddings of all knowledge base documents. Each document is chunked into segments of five hundred tokens with overlap, and each chunk is embedded using a text embedding model. Retrieval layer: at inference time, the user's query is embedded with the same embedding model, and a nearest-neighbor search retrieves the five to ten most semantically relevant document chunks. Generation layer: the original query plus the retrieved chunks are assembled into a structured prompt, and the LLM generates a response grounded in the retrieved context. Three operational challenges. Chunk quality: over-chunked documents lose context. I experiment with chunk sizes per document type. Retrieval quality: semantic similarity doesn't always match relevance. I implement a re-ranking step using a cross-encoder model after the initial retrieval. Freshness: when the knowledge base updates, I run incremental re-embedding — only newly changed documents are re-embedded and the index is updated. Full re-embedding of a large corpus is expensive and slow.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| vector database | /ˈvɛktər ˈdeɪtəbeɪs/ | stores embeddings and supports similarity search — the core of RAG |
| re-ranking | /riː ˈræŋkɪŋ/ | second-pass relevance scoring after retrieval — improves answer quality |
| nearest-neighbor search | /ˈnɪərɪst ˈneɪbər sɜːrtʃ/ | find vectors most similar to the query vector — the retrieval mechanism |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What metric would you use to measure whether your RAG system is actually improving answer quality?
