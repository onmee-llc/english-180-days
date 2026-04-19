---
title: Module 3 — Exam Prep & Practice Questions
description: Practice questions aligned to Generative AI with LLMs course material with model answers in English.
date: 2026-04-19
---

## How to use this module

1. Cover the answer column.
2. Say your answer out loud in English before checking.
3. If you couldn't answer — go back to Module 2.
4. Review the full set of questions once per week during study.

---

## Section A — LLM Fundamentals

**Q1:** What is the difference between a base model and an instruction-tuned model?

> **A:** A base model is trained only on unsupervised data and predicts the next token. An instruction-tuned model has been further trained on instruction-response pairs and follows user directions reliably. Base models require careful prompting to produce useful outputs. Instruction-tuned models work well with simple, direct prompts.

---

**Q2:** What are the three main components of an LLM inference cost?

> **A:** (1) Input tokens — the prompt, context, and system instruction sent to the model. (2) Output tokens — the generated response, which typically costs more per token than input. (3) Compute infrastructure — the GPU time to run inference.

---

**Q3:** Why do larger models not always produce better results for a given task?

> **A:** Larger models have higher inference costs, higher latency, and higher base complexity. For narrow, well-defined tasks, a smaller instruction-tuned model often performs equally well — especially with good prompt design. The right model choice depends on the task, not just the parameter count.

---

## Section B — Fine-Tuning

**Q4:** When should you use fine-tuning instead of prompt engineering?

> **A:** Fine-tuning makes sense when: (1) the task requires consistent tone or output format that prompting alone can't reliably achieve, (2) the domain is highly specialized and not well-covered by the base model's training data, (3) latency or cost from long few-shot prompts is a production concern. Fine-tuning is NOT the right choice for most tasks — good prompting with a capable model is faster, cheaper, and easier to iterate.

---

**Q5:** What is the risk of fine-tuning on a narrow dataset?

> **A:** Catastrophic forgetting — the model loses general capabilities it had after pre-training and instruction tuning. This is especially risky with full fine-tuning. PEFT (LoRA) mitigates this by updating only a small fraction of parameters.

---

**Q6:** What does LoRA stand for and why is it preferred for fine-tuning?

> **A:** Low-Rank Adaptation. LoRA adds trainable rank-decomposition matrices to transformer attention layers rather than updating the full model weights. It reduces fine-tuning compute by 10–100× while achieving results close to full fine-tuning. The original model weights are frozen, which prevents catastrophic forgetting.

---

## Section C — RLHF and Alignment

**Q7:** What problem does RLHF solve?

> **A:** Pre-trained models that predict the next token well don't necessarily produce helpful, harmless, or honest responses. RLHF aligns model behavior with human preferences by using human ranking of outputs to train a reward model, then fine-tuning the LLM against the reward signal.

---

**Q8:** What are the three main steps in the RLHF pipeline?

> **A:** (1) Supervised fine-tuning on demonstration data (human-written ideal responses). (2) Reward model training using human preference comparisons (which of two outputs is better?). (3) RL fine-tuning — the LLM is updated using the reward model signal via a PPO or similar policy gradient method.

---

**Q9:** What is the difference between RLHF and Constitutional AI?

> **A:** RLHF requires large volumes of human preference labels for every new behavior. Constitutional AI (Anthropic) reduces this by having the model self-critique its outputs against a written "constitution" of principles. The model improves without needing human labels for each example. Both aim to make models safer and more helpful.

---

## Section D — Applications

**Q10:** What is the main advantage of RAG over fine-tuning for knowledge-intensive tasks?

> **A:** RAG retrieves up-to-date, source-verifiable documents at inference time. It doesn't require retraining when knowledge changes. Fine-tuning bakes knowledge into model weights, which becomes stale and cannot cite sources. RAG is preferred for tasks requiring factual accuracy and current information.

---

**Q11:** What is the ReAct pattern and when is it used?

> **A:** ReAct (Reason + Act) is an LLM agent pattern where the model alternates between reasoning about the next step and invoking a tool, then observing the result. It's used for multi-step tasks where a single LLM call cannot complete the work — for example, querying a database, running code, or calling an API.

---

**Q12:** What are three principles of responsible AI deployment for LLM-powered systems?

> **A:** (1) Transparency — document what the model does, what data it was trained on, and where it may fail. (2) Fairness — test for bias across demographic groups and use-case scenarios. (3) Human oversight — include a feedback mechanism, monitor for failures in production, and have a process to correct model behavior when it causes harm.

---

## Section E — English Language Practice

For each answer above, practice delivering a 30-second verbal explanation to a colleague. The goal is fluency — you don't need to recite the answer verbatim. You need to be able to explain the concept naturally in English.

| Concept | Can I explain it in English without notes? |
|---------|------------------------------------------|
| Base model vs instruction-tuned | ☐ Yes ☐ Not yet |
| RLHF three steps | ☐ Yes ☐ Not yet |
| RAG vs fine-tuning | ☐ Yes ☐ Not yet |
| LoRA purpose | ☐ Yes ☐ Not yet |
| ReAct pattern | ☐ Yes ☐ Not yet |
| Responsible AI three principles | ☐ Yes ☐ Not yet |
