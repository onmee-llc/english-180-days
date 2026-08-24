---
title: "Phase 7 — Using LLM APIs in Production"
description: "Call modern LLM APIs reliably: prompting, streaming, tool use, and cost control."
date: 2026-06-28
---

## Goal

Build a small, reliable LLM-powered feature using a hosted API.

{% vi %}
**Mục tiêu:** Xây một tính năng nhỏ chạy bằng LLM một cách tin cậy qua API hosted.
{% endvi %}

## What to learn

- **Choosing a model**: capable models (e.g. Claude Opus / Sonnet, GPT) for hard tasks; small, cheap models (e.g. Claude Haiku) for practice and high-volume work.
- **Prompt engineering**: clear instructions, examples, system prompts (pairs with Topic 13).
- **Streaming responses** for good UX.
- **Tool use / function calling** so the model can take actions.
- **Reliability**: retries, timeouts, fallback, and **token-cost logging**.
- **Cost control**: set a hard monthly cap; prefer small models while learning.

{% vi %}
**Học gì:**
- **Chọn model**: model mạnh (vd Claude Opus / Sonnet, GPT) cho tác vụ khó; model nhỏ, rẻ (vd Claude Haiku) để luyện và xử lý khối lượng lớn.
- **Prompt engineering**: chỉ dẫn rõ ràng, ví dụ, system prompt (đi kèm Topic 13).
- **Streaming response** để trải nghiệm tốt.
- **Tool use / function calling** để model thực hiện hành động.
- **Độ tin cậy**: retry, timeout, fallback, và **ghi log chi phí token**.
- **Kiểm soát chi phí**: đặt trần tháng cứng; ưu tiên model nhỏ khi học.
{% endvi %}

## Resources

- **FREE** — Official Anthropic and OpenAI API docs & quickstarts.
- **FREE / $$** — Free tier credits to start; usage is pay-as-you-go after that.
- **FREE** — Anthropic prompt-engineering guide.

{% vi %}
**Tài nguyên:**
- **FREE** — Tài liệu & quickstart API chính thức của Anthropic và OpenAI.
- **FREE / $$** — Credit free tier để bắt đầu; sau đó trả theo dùng.
- **FREE** — Hướng dẫn prompt-engineering của Anthropic.
{% endvi %}

## Build

Write a script that calls an LLM API with a system prompt, streams the response, logs token usage, and retries once on failure. Keep total spend under your cap.

{% vi %}
**Thực hành:** Viết một script gọi LLM API với system prompt, stream phản hồi, ghi log token, và retry một lần khi lỗi. Giữ tổng chi phí dưới mức trần.
{% endvi %}

## Reflection

Where would a cheaper, smaller model have given the same result for a fraction of the cost?

{% vi %}
**Tự ngẫm:** Ở đâu một model nhỏ hơn, rẻ hơn vẫn cho kết quả tương đương với chi phí thấp hơn nhiều?
{% endvi %}
