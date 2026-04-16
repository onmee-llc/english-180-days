---
title: "Day 59 — LLM Integration Patterns"
description: "Orchestration, tool calling, and agentic AI patterns."
date: 2026-04-13
---

## Session goal

Describe the LLM orchestration pattern in your content automation system.

## Shadowing passage

> LLM orchestration moves beyond single inference calls into multi-step reasoning systems. The core pattern I use is a planner-executor architecture. The planner receives the high-level task — create a quarterly content plan for brand X — and decomposes it into a sequence of sub-tasks: retrieve brand guidelines, retrieve Pinterest analytics, identify top-performing content categories, generate content briefs per category. The executor runs each sub-task using the appropriate tool or model call. Tool calling in this architecture means the LLM can invoke defined functions — retrieve document, query database, call external API — and the orchestrator handles the actual execution. The LLM reasons about which tool to call and what parameters to pass. I build these orchestrators with LangChain for Python services, but I keep custom orchestration logic minimal — LangChain abstractions can obscure failure modes, which makes debugging harder. For reliability, every orchestrator step has a timeout, a retry limit, and a fallback behavior. If the analytics retrieval step times out, the orchestrator uses cached analytics from the last successful run rather than failing the entire pipeline. Intermediate states are checkpointed so a pipeline interrupted at step four restarts from step four, not from step one. This is especially important for pipelines with expensive steps.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| planner-executor architecture | /ˈplænər ˈɛɡzɪkjuːtər ˈɑːrkɪtɛktʃər/ | LLM decomposes the task; executor runs each sub-task — separation of concerns |
| tool calling | /tuːl ˈkɔːlɪŋ/ | model invokes defined functions — grounds the model in real data |
| checkpoint | /ˈtʃɛkpɔɪnt/ | save intermediate state — resume from failure point, not from start |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What breaks first in an agentic system when the LLM starts hallucinating tool parameters?


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
