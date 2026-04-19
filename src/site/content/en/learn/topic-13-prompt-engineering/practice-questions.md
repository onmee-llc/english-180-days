---
title: Practice Questions
description: 5 prompt engineering and LLM best practices questions to drill until automatic.
date: 2026-04-19
---

## How to use this module

For each question:
1. **First pass:** Answer out loud with notes allowed.
2. **Second pass:** Answer out loud — no notes, no preparation.
3. **Record yourself** on at least one question per session and listen back.

---

## Question 1 — Prompting Patterns

**"When would you use chain-of-thought prompting versus standard zero-shot? Give a concrete example."**

**What the interviewer wants to hear:**
- Zero-shot for simple classification and extraction — fast and cheap
- CoT for reasoning-heavy tasks: debugging, math, multi-step analysis
- A concrete before/after example showing accuracy improvement
- The cost implication: CoT uses more tokens

---

## Question 2 — Reliability

**"How do you prevent hallucination in a production LLM application? Walk me through your approach."**

**What the interviewer wants to hear:**
- Grounding with retrieved context (RAG) as the primary defense
- Asking the model to cite sources or express uncertainty
- Automated validation: checking factual claims, required fields
- Eval set to detect hallucination rate changes over time
- Honest: "elimination is not possible, mitigation is the goal"

---

## Question 3 — Security

**"What is prompt injection and how do you defend against it in a backend service?"**

**What the interviewer wants to hear:**
- Clear definition: user input attempts to override system instructions
- Sanitize and validate user input before including in prompt
- Strict output schema validation — malicious injections often break the expected format
- Test with adversarial inputs in your eval set
- Keep user content and system content in separate message roles

---

## Question 4 — Cost

**"Your LLM prompts are too expensive. How do you systematically reduce costs without degrading quality?"**

**What the interviewer wants to hear:**
- Diagnose first: which prompt template, which task, what token count
- Model selection: use cheaper models for appropriate tasks
- Prompt compression: remove verbosity, tighten instructions
- Prompt caching for repeated system prompts
- Output length control: set max_tokens
- Measure quality before and after each change — costs mean nothing without quality context

---

## Question 5 — Best Practices Guide

**"You've been asked to create an LLM Best Practices Guide for your team. What does it cover?"**

**What the interviewer wants to hear:**
- Prompt templates with system/user/assistant structure
- Key patterns: CoT, few-shot, structured output — with examples
- Error handling: retry, fallback, over-refusal fixes
- Security: PII handling, prompt injection defense
- Cost control: model selection matrix, caching
- Testing: eval sets, automated quality gates, regression testing
- This is a "living document" — who owns it, how it's updated
