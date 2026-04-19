---
title: "Day 171 — Explaining LLM Architecture to Mixed Audiences"
description: "Practice explaining the same technical concept at three levels of detail."
date: 2026-04-19
---

## Session goal

Explain your LLM system architecture at three levels: executive (1 min), engineer (3 min), and senior engineer (5 min).

## Shadowing passage — the three-level explanation

> The ability to switch explanation levels mid-talk is what separates a strong technical communicator from a narrow one. For a mixed audience, I open at the executive level — what problem we solved, what outcome we achieved — to establish common ground. Then I go deeper for the engineers in the room. Then I go deepest for the senior engineers who want the trade-offs. Here's how the same system sounds at each level. Executive level: "We built an internal tool that answers engineering questions from our documentation automatically. It saves about two hours per engineer per week." Engineer level: "The system uses RAG with pgvector — it embeds documentation chunks and retrieves the top-five relevant sections for each query, then generates a grounded answer using Claude 3.5 Sonnet. Latency is under 5 seconds at P95." Senior engineer level: "The interesting architectural decisions were: why pgvector over a dedicated vector DB — zero operational overhead for our current scale; why we cap retrieved chunks at 6,000 tokens — leaves room for the system prompt and a 500-token response buffer within the 8,192-token limit; and why we chose not to fine-tune — our eval showed that Claude's instruction-following on long-context prompts matched fine-tuned output quality with less maintenance overhead."

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| establish common ground | [Nghe →](https://youglish.com/pronounce/establish%20common%20ground/english) | create shared understanding before going deep |
| mixed audience | [Nghe →](https://youglish.com/pronounce/mixed%20audience/english) | attendees with different levels of technical knowledge |
| the interesting decisions were | [Nghe →](https://youglish.com/pronounce/the%20interesting%20decisions%20were/english) | signals you're going deeper — for senior engineers |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–12** — Shadow the three-level passage.
**Minutes 13–22** — Prepare your own three-level explanation for your KPI 1 system.
**Minutes 23–28** — Record all three levels back to back. Time each one.
**Minutes 29–30** — Note which level felt most natural.

## Reflection

Which level is hardest for you — executive or senior engineer? Why?

## Anti-Translation Drill

Deliver the executive-level explanation for your system from memory. Under 60 seconds. English only.

## Self-Check

- [ ] Shadowed three-level passage
- [ ] Prepared and recorded all three explanation levels
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
