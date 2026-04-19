---
title: "Day 149 — Architecture Decision Records"
description: "Write and present an Architecture Decision Record (ADR) for an LLM system choice."
date: 2026-04-19
---

## Session goal

Explain what an ADR is and present a real ADR from your KPI 1 project — context, decision, and consequences.

## Shadowing passage

> An Architecture Decision Record is a one-page document that captures a significant technical decision: what the context was, what the options were, what we decided, and what the consequences are — including the downsides we accepted. I write an ADR for every decision that would take more than a paragraph to explain to a new team member. The format I use has four sections. Context: what was the situation that forced this decision? What constraints existed? What would happen if we made no decision? Options considered: list two or three real alternatives, not strawmen. For each option, one sentence on why it's viable and one on why it's not ideal. Decision: what did we choose, and what was the primary reason? One clear sentence. Consequences: what does this decision make easier? What does it make harder? What do we need to monitor or revisit? For example, here's a real ADR from my current project. Context: we need to store conversation history for multi-turn LLM interactions. We currently have PostgreSQL. Options: store in PostgreSQL as JSONB; add Redis for in-memory history; use a dedicated conversation service. Decision: PostgreSQL JSONB, because we have zero operational overhead and the team already knows it. Consequence: this works well up to about ten thousand active conversations; beyond that, we'll need to revisit. That's the entire document. One page. One decision. If you can't write it in one page, you haven't thought through the trade-off yet.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| significant technical decision | [Nghe →](https://youglish.com/pronounce/significant%20technical%20decision/english) | worth documenting — not every small choice |
| strawman option | [Nghe →](https://youglish.com/pronounce/strawman/english) | a fake alternative added just to be rejected — avoid this |
| revisit the decision | [Nghe →](https://youglish.com/pronounce/revisit%20the%20decision/english) | review and potentially change in the future |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on the ADR format.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Pick one real decision from your KPI 1 project. Verbally present the ADR: context, options, decision, consequences.

**Minutes 29–30** — Record your ADR presentation. Is it under 3 minutes?

## Reflection

Write one ADR for your KPI 1 project today. Keep it to one page. Share it with at least one team member.

## Anti-Translation Drill — Listening First *(5 min)*

Close the text. Recall today's shadowing passage. Reconstruct the four ADR sections from memory and say them out loud.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Verbally presented one real ADR from my project
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
