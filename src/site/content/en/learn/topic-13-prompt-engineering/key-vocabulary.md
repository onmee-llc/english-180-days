---
title: Key Vocabulary
description: Essential phrases and terms for Prompt Engineering — LLM Best Practices Guide.
date: 2026-04-19
---

## How to use this module

For each phrase or term:
1. Say it out loud 3 times.
2. Use it in a sentence about your own work.
3. Practice using it naturally in an answer to a practice question.

**Goal:** Zero hesitation when these words come up in a prompt engineering discussion or code review.

---

## Prompt Anatomy

| Phrase | Listen | Usage |
|--------|--------|-------|
| system prompt | [Nghe →](https://youglish.com/pronounce/system%20prompt/english) | "The system prompt sets the model's behavior for the entire session." |
| assistant prefill | [Nghe →](https://youglish.com/pronounce/assistant%20prefill/english) | "We use assistant prefill to force JSON output format." |
| message history | [Nghe →](https://youglish.com/pronounce/message%20history/english) | "The model reads the full message history on every call." |

## Prompting Patterns

| Phrase | Listen | Usage |
|--------|--------|-------|
| zero-shot | [Nghe →](https://youglish.com/pronounce/zero-shot/english) | "Test zero-shot first before adding few-shot examples." |
| few-shot examples | [Nghe →](https://youglish.com/pronounce/few-shot%20examples/english) | "I added three few-shot examples to constrain the output format." |
| chain-of-thought | [Nghe →](https://youglish.com/pronounce/chain-of-thought/english) | "Chain-of-thought prompting improved accuracy by fifteen percent on our eval set." |
| structured output | [Nghe →](https://youglish.com/pronounce/structured%20output/english) | "We enforce structured output and validate the schema before using the response." |
| ReAct pattern | [Nghe →](https://youglish.com/pronounce/ReAct%20pattern/english) | "The agent uses the ReAct pattern: reason, then act, then observe." |

## Reliability & Safety

| Phrase | Listen | Usage |
|--------|--------|-------|
| hallucination | [Nghe →](https://youglish.com/pronounce/hallucination/english) | "We mitigate hallucination by grounding the model with retrieved context." |
| grounding | [Nghe →](https://youglish.com/pronounce/grounding/english) | "Grounding means giving the model factual context before asking it to generate." |
| over-refusal | [Nghe →](https://youglish.com/pronounce/over-refusal/english) | "The model was over-refusing legitimate requests — we fixed it by adding professional context in the system prompt." |
| prompt injection | [Nghe →](https://youglish.com/pronounce/prompt%20injection/english) | "We test for prompt injection by running adversarial inputs against the system." |
| PII redaction | [Nghe →](https://youglish.com/pronounce/PII%20redaction/english) | "All user data is PII-redacted before it enters the prompt." |

## Cost & Optimization

| Phrase | Listen | Usage |
|--------|--------|-------|
| prompt compression | [Nghe →](https://youglish.com/pronounce/prompt%20compression/english) | "Prompt compression reduced our average token count by twenty percent." |
| prompt caching | [Nghe →](https://youglish.com/pronounce/prompt%20caching/english) | "With prompt caching on the system prompt, our costs dropped by eighty percent." |
| max_tokens | [Nghe →](https://youglish.com/pronounce/max%20tokens/english) | "Always set max_tokens explicitly — never let the model run unconstrained." |

## Testing & Evaluation

| Phrase | Listen | Usage |
|--------|--------|-------|
| eval set | [Nghe →](https://youglish.com/pronounce/eval%20set/english) | "Our eval set has fifty questions — we run it on every prompt change." |
| LLM-as-judge | [Nghe →](https://youglish.com/pronounce/LLM%20as%20judge/english) | "We use LLM-as-judge to score outputs at scale without manual review." |
| regression testing | [Nghe →](https://youglish.com/pronounce/regression%20testing/english) | "Regression testing revealed that the new prompt regressed on three of our benchmark questions." |
| output quality gate | [Nghe →](https://youglish.com/pronounce/output%20quality%20gate/english) | "The quality gate rejects responses that fail format validation or contain banned phrases." |
