---
title: "Key Vocabulary — EN Technical Writing"
description: Vocabulary and phrases for writing and publishing English technical articles.
date: 2026-04-19
---

## Article structure phrases

| Phrase | Usage | Example |
|--------|-------|---------|
| In this article, I'll cover… | Article introduction | "In this article, I'll cover three prompt engineering mistakes that cost us real money in production." |
| The problem we were trying to solve was… | Setting up the narrative | "The problem we were trying to solve was high hallucination rates in a customer-facing chatbot." |
| Our approach was to… | Describing the solution | "Our approach was to build a domain-specific eval set and run it on every model change." |
| What surprised us was… | The insight moment | "What surprised us was that the smaller model outperformed the larger one on our specific task." |
| The key takeaway is… | Closing the section | "The key takeaway is: always run evals before choosing a model, not after." |
| Looking back, I would have… | Retrospective framing | "Looking back, I would have started with a smaller context window and expanded only when needed." |
| This approach works well when… | Scoping the recommendation | "This approach works well when you have a well-defined, repeatable task and a good eval set." |
| One caveat is… | Honest limitation | "One caveat is that this adds engineering overhead — it only makes sense at meaningful request volume." |

## Technical writing style principles

| Principle | What it means | How to apply |
|-----------|--------------|-------------|
| One idea per sentence | Don't combine two separate ideas in one sentence | If you use "and", check if the sentence should be split |
| Concrete over abstract | Use specific numbers, names, and examples | "50ms latency improvement" not "significant improvement" |
| Active voice | Subject does the action | "We deployed the model" not "The model was deployed" |
| Front-load the point | Put the main claim first, details second | "RAG reduced hallucination by 40% in our eval set. We achieved this by…" |
| Avoid filler phrases | Cut "it is worth noting that", "as we can see", "in order to" | "worth noting that X" → just "X" |

## Editing with AI tools

**Claude / ChatGPT for grammar:**
Prompt to use: "Review this paragraph for grammar, clarity, and naturalness. Do not rewrite it — only flag issues and suggest minimal corrections. Preserve my voice."

**Hemingway Editor:** [hemingwayapp.com](https://hemingwayapp.com/)
- Aim for Grade 9 or below
- Eliminate red (very hard to read) and pink (hard to read) sentences
- Remove adverbs highlighted in blue — replace with stronger verbs

**What AI should NOT do:**
- Do not let AI rewrite entire sections — it will remove your voice
- Do not accept AI's suggested words without understanding them
- Grammar and clarity checks only — the ideas must come from you

## Speaking session preparation vocabulary

| Phrase | Speaking session context |
|--------|-------------------------|
| I'm going to share something I've been working on | Opening for knowledge-sharing |
| The problem I set out to solve was… | Setting context |
| Let me give you a quick summary | Transitioning to a summary |
| I'd love to hear your thoughts on… | Inviting feedback |
| One thing I'm still unsure about is… | Honest vulnerability — builds trust |
| Does this match your experience? | Engaging the audience |
| The main lesson I took away was… | Closing a session |
