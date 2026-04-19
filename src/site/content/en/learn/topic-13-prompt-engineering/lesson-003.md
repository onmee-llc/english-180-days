---
title: "Day 157 — ReAct Pattern for AI Agents"
description: "Explain the ReAct pattern — reason, act, observe — and when to use it."
date: 2026-04-19
---

## Session goal

Describe the ReAct pattern clearly and explain how it differs from a single LLM call.

## Shadowing passage

> ReAct stands for Reason and Act, and it describes how AI agents work in practice. The pattern is a loop with three phases. In the Reason phase, the model reads the task and the results of any previous actions, and thinks through what to do next. In the Act phase, the model outputs a tool call — a structured request to run a specific function with specific parameters. Your code executes the function and captures the result. In the Observe phase, the result is fed back to the model as context for the next iteration. The loop continues until the model determines the task is complete and outputs a final answer. I use the ReAct pattern for tasks that require dynamic decision-making — where you can't know in advance which steps are needed. For example: given a customer complaint, look up their account, check their recent transactions, determine if a refund is applicable based on policy, and draft a response. A single LLM call can't do this reliably because it would have to hallucinate the account details. ReAct grounds each step in real data. The main failure modes are infinite loops — the model gets stuck calling the same tool repeatedly — and cascading errors — a wrong tool call in step two corrupts everything after it. I address both with a maximum iteration count and explicit error handling in the observe step.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| tool call | [Nghe →](https://youglish.com/pronounce/tool%20call/english) | the model's structured request to run a specific function |
| grounded in real data | [Nghe →](https://youglish.com/pronounce/grounded%20in%20real%20data/english) | decisions based on actual retrieved information, not model memory |
| maximum iteration count | [Nghe →](https://youglish.com/pronounce/maximum%20iteration%20count/english) | a hard limit on how many times the agent loop can run |

## 30-minute protocol

**Minutes 1–5** — Read silently twice.
**Minutes 6–15** — Shadow aloud 4 times.
**Minutes 16–22** — Shadow without text. 3 passes.
**Minutes 23–28** — Record once. Note one phrase to improve.
**Minutes 29–30** — Difficult phrase: 10 times slowly, then at full speed.

## Reflection

Does your KPI 1 use case need a ReAct agent or a single LLM call? Explain your reasoning out loud.

## Anti-Translation Drill

Describe the three ReAct phases (Reason, Act, Observe) in English from memory. No notes.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
