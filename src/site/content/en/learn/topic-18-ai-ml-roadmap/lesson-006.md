---
title: "Phase 6 — Transformers: How LLMs Work"
description: "Understand attention and the architecture behind every modern LLM."
date: 2026-06-26
---

## Goal

Explain, at a working level, how a transformer turns a prompt into the next token.

{% vi %}
**Mục tiêu:** Giải thích ở mức làm việc được: một transformer biến prompt thành token kế tiếp như thế nào.
{% endvi %}

## What to learn

- **Self-attention**: how each token "looks at" others to build context.
- **Architecture**: embeddings → attention blocks → feed-forward → output logits.
- **Pre-training vs fine-tuning vs instruction-tuning**.
- **Context window, tokens, temperature, top-p** — the knobs you'll actually use.
- Why bigger models generalize better but cost more to run.

{% vi %}
**Học gì:**
- **Self-attention**: mỗi token "nhìn" các token khác để dựng ngữ cảnh ra sao.
- **Kiến trúc**: embedding → khối attention → feed-forward → logits đầu ra.
- **Pre-training vs fine-tuning vs instruction-tuning**.
- **Context window, token, temperature, top-p** — những "núm vặn" bạn sẽ thực sự dùng.
- Vì sao model lớn hơn tổng quát tốt hơn nhưng chạy tốn kém hơn.
{% endvi %}

## Resources

- **FREE** — "The Illustrated Transformer" (Jay Alammar).
- **FREE** — Andrej Karpathy "Let's build GPT" (YouTube) — build a tiny transformer from scratch.
- **FREE** — Hugging Face course chapters on transformer architecture.

{% vi %}
**Tài nguyên:**
- **FREE** — "The Illustrated Transformer" (Jay Alammar).
- **FREE** — Andrej Karpathy "Let's build GPT" (YouTube) — dựng một transformer tí hon từ đầu.
- **FREE** — Các chương về kiến trúc transformer trong khóa Hugging Face.
{% endvi %}

## Build

Follow Karpathy's video to train a character-level mini-GPT in Colab. Generate a few lines of text and read them out loud.

{% vi %}
**Thực hành:** Theo video của Karpathy để huấn luyện một mini-GPT cấp ký tự trong Colab. Sinh vài dòng văn bản và đọc to chúng.
{% endvi %}

## Reflection

In one sentence: what is "attention" actually doing?

{% vi %}
**Tự ngẫm:** Trong một câu: "attention" thực chất đang làm gì?
{% endvi %}
