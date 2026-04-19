---
title: Module 2 — Core Concepts & English Vocabulary
description: The key theoretical concepts from Generative AI with LLMs, with English phrases to discuss each one.
date: 2026-04-19
---

## How to use this module

For each concept:
1. Read the definition and example.
2. Say the English phrases out loud twice.
3. Explain the concept in your own words — in English.
4. Connect it to your KPI 1 or KPI 2 work.

---

## Section 1 — LLM Fundamentals

**Transformer architecture**
The neural network architecture behind all modern LLMs. Consists of encoder and decoder stacks with self-attention mechanisms. Introduced in the 2017 "Attention Is All You Need" paper.
- *In English:* "The transformer architecture uses self-attention to capture long-range dependencies in text."
- *Connection to KPI:* Understanding this helps you explain why context window limits exist.

**Pre-training**
Training a model on a massive unlabeled dataset (e.g., the entire web) to learn language patterns. The result is a foundation model. Extremely expensive — hundreds of GPU-years.
- *In English:* "Pre-training gives the model broad world knowledge. Fine-tuning specializes it for a task."
- *Connection to KPI:* Why you use an API instead of training from scratch.

**Inference**
Running the trained model to generate a response. This is what happens every time you call the LLM API. Cost per token comes from inference compute.
- *In English:* "Each API call is one inference request. Token cost is determined by the number of tokens generated during inference."

**Scaling laws**
The empirical relationship between model size (parameters), training data, and compute — and model performance. Larger models trained on more data with more compute generally perform better, but with diminishing returns.
- *In English:* "Scaling laws predict that doubling model size improves performance by a predictable amount, but not linearly."

---

## Section 2 — Fine-Tuning

**Instruction fine-tuning**
Training a pre-trained model on labeled instruction-response pairs to improve its ability to follow instructions. Results in chat models like GPT-4 and Claude 3.
- *In English:* "Instruction fine-tuning teaches the model to respond helpfully to user instructions."
- *Connection to KPI 2:* Why you don't need to fine-tune for most tasks — instruction-tuned models already follow system prompts well.

**Parameter-efficient fine-tuning (PEFT)**
Fine-tuning only a small subset of model parameters (or added adapter layers) instead of the full model. Much cheaper than full fine-tuning while achieving similar results.
- *In English:* "PEFT reduces fine-tuning compute costs by updating only adapter layers, not the full model weights."

**LoRA (Low-Rank Adaptation)**
A specific PEFT technique that adds small, trainable rank-decomposition matrices to transformer layers. State-of-the-art for cost-efficient fine-tuning.
- *In English:* "LoRA is the standard approach for fine-tuning large models with limited GPU budget."

**Catastrophic forgetting**
When fine-tuning on a specific task causes the model to lose capabilities it had after pre-training. A risk with aggressive fine-tuning.
- *In English:* "Catastrophic forgetting is one reason PEFT is preferred over full fine-tuning — it preserves general capabilities."

---

## Section 3 — RLHF

**Reinforcement Learning from Human Feedback (RLHF)**
A training technique that uses human preferences to align model behavior with human values. The pipeline: generate multiple outputs → human ranks them → train a reward model → fine-tune the LLM using the reward model.
- *In English:* "RLHF is why modern LLMs are helpful and safe — it aligns behavior with what humans actually want."
- *Connection to KPI 2:* Understanding RLHF helps explain why models refuse certain requests and how to work with that.

**Reward model**
A secondary model trained on human preference data. It scores LLM outputs and is used to guide RLHF training.
- *In English:* "The reward model learns what humans prefer — it's the supervisor in the RLHF training loop."

**Constitutional AI**
Anthropic's variant of RLHF where the model is trained against a set of principles (a "constitution") rather than direct human preference labels for every example.
- *In English:* "Constitutional AI reduces the need for human labeling by having the model critique and revise its own outputs against a fixed set of principles."

---

## Section 4 — LLM Applications

**RAG (Retrieval-Augmented Generation)**
Combining a retrieval system (vector search over documents) with an LLM to generate grounded, factual responses. Covered in full in Topic 5 and Topics 12–13.
- *In English:* "RAG grounds the model's responses in retrieved documents, reducing hallucination and enabling up-to-date knowledge."

**LLM agents**
Systems where the LLM can invoke tools, reason over results, and take multi-step actions. Covered in Topic 13 (ReAct pattern).
- *In English:* "LLM agents use a reason-act-observe loop, enabling multi-step tasks that a single LLM call cannot handle."

**Constitutional/responsible AI**
Principles for building AI systems that are safe, fair, and transparent. Includes bias detection, output monitoring, and human oversight.
- *In English:* "Responsible AI isn't just about safety filters — it includes transparency, fairness, and ongoing human oversight."
