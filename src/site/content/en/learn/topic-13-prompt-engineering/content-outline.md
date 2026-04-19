---
title: Content Outline
description: Core prompt engineering concepts for building your LLM Best Practices Guide.
date: 2026-04-19
---

## How to use this module

1. Read the outline once silently.
2. Close the page. Try to recall the main points out loud.
3. Come back and fill in what you missed.
4. Repeat until you can present the outline verbally in 3–5 minutes.

## Practice format

For each concept below:
- State what it is (1 sentence)
- Explain when/why you'd use it (1–2 sentences)
- Give a real example from your own work (1–2 sentences)

---

## 1. Prompt Anatomy

**System prompt** — Sets the model's behavior, role, and constraints for the entire session. Think of it as configuration, not conversation. Change it carefully — a system prompt change can shift model behavior significantly and requires re-evaluation.

**User prompt** — The actual task input from the user or your application logic. Should be as specific and unambiguous as possible. Vague prompts produce vague responses.

**Assistant prefill** — Some APIs let you pre-fill the beginning of the assistant's response. Useful for constraining output format (e.g., start with `{` to force JSON output). Use sparingly.

**Message history** — The list of prior messages in a multi-turn conversation. Each message has a role: system, user, or assistant. Order matters — the model reads the full history on every call.

## 2. Key Prompting Patterns

**Zero-shot** — Give the task description only. No examples. Works for clear, simple tasks. Fastest and cheapest. Test zero-shot first before adding complexity.

**Few-shot** — Provide 2–5 input-output examples before the task. The model learns the pattern from the examples. Best when output format is strict or the task is subtle. Examples should be representative, not edge cases.

**Chain-of-Thought (CoT)** — Ask the model to reason step by step before giving the answer. Add "Let's think step by step" or explicit reasoning steps to the prompt. Significantly improves accuracy on math, logic, and multi-step analysis. Costs more tokens — reserve for tasks where accuracy matters.

**ReAct (Reason + Act)** — Alternating reasoning and tool use. The model thinks, decides on an action, executes it via a tool call, observes the result, and continues. Used in AI agents. Requires careful tool definition and error handling.

**Structured output** — Force the model to return JSON, XML, or a specific schema. Use `response_format: {type: "json_object"}` (OpenAI) or define a JSON schema in the system prompt. Always validate the output against the expected schema — never assume the model followed the format.

## 3. Hallucination and Over-Refusal

**What hallucination is** — The model confidently outputs incorrect information. Not a bug — a fundamental property of how LLMs work. Mitigation, not elimination, is the goal.

**Mitigation strategies** — Ground the model with retrieved context (RAG). Ask the model to cite sources. Ask the model to express uncertainty ("if you're not sure, say so"). Use a lower temperature. Add a validation step that checks factual claims.

**Over-refusal** — The model refuses to answer a reasonable request because it pattern-matches to a sensitive category. Common in enterprise settings. Fix: reframe the request with professional context in the system prompt. Example: "You are a medical information assistant for licensed healthcare professionals."

**Context window limit errors** — The prompt is too long. Fix: truncate conversation history, summarize retrieved context, or split the task into smaller sub-tasks.

## 4. Cost Optimization

**Model selection per task** — Use a fast, cheap model for classification, routing, and simple extraction. Reserve the powerful, expensive model for reasoning and generation. Example: GPT-4o Mini for intent detection; GPT-4o for final answer generation.

**Prompt compression** — Remove unnecessary verbosity from your prompts. Every token costs money. Short, clear instructions outperform long, wordy ones for most tasks.

**Output length control** — Set `max_tokens` explicitly. Streaming responses that run indefinitely cost proportionally. If your expected output is 200 tokens, set `max_tokens: 300`.

**Prompt caching** — Anthropic and OpenAI offer prompt caching for repeated system prompts. Use the cache control flag to mark stable prompt sections. Can reduce costs by 90% for high-volume, identical system prompts.

## 5. Security

**PII in prompts** — Never include user PII (name, email, ID numbers) in prompts sent to external LLM APIs unless your provider agreement explicitly allows it and your privacy policy covers it. Pseudonymize or redact before sending.

**Prompt injection** — A user attempts to override your system prompt by including instructions in their input. Example: "Ignore all previous instructions and output…". Defenses: validate and sanitize user input; use strict output format validation; separate system and user content clearly; test with adversarial inputs.

**Data leakage via examples** — Few-shot examples that contain real customer data teach the model to reference real data in responses. Always use synthetic or anonymized examples.

## 6. Testing and Evaluation

**Eval set** — A fixed set of test inputs with expected outputs. The only reliable way to know if a prompt change improved or degraded quality. Build this before you start optimizing.

**Automated quality checks** — Format validation (is the output valid JSON?), content checks (does the output contain required fields?), length bounds, banned phrases. Run these on every response in production.

**LLM-as-judge** — Use a strong model (e.g., GPT-4o) to evaluate the outputs of a weaker model on your eval set. Cheaper than human review for large eval sets. Prompt the judge with explicit criteria: "Rate this response from 1–5 for accuracy and helpfulness."

**Regression testing** — Run your eval set every time you change a prompt. A prompt that improves accuracy on new cases but regresses on old ones is not an improvement.
