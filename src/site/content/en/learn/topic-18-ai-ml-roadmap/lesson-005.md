---
title: "Phase 5 — NLP & Embeddings"
description: "Turn text into vectors and understand semantic search at its core."
date: 2026-06-24
---

## Goal

Understand how text becomes numbers, and use embeddings for semantic similarity.

{% vi %}
**Mục tiêu:** Hiểu cách văn bản trở thành số, và dùng embedding cho độ tương đồng ngữ nghĩa.
{% endvi %}

## What to learn

- **Tokenization** and why it matters for cost and context limits.
- **Embeddings**: dense vectors that capture meaning; cosine similarity.
- Classic NLP tasks: classification, named-entity recognition, sentiment.
- The **Hugging Face** ecosystem: models, datasets, `transformers` and `sentence-transformers`.

{% vi %}
**Học gì:**
- **Tokenization** và vì sao nó quan trọng với chi phí và giới hạn ngữ cảnh.
- **Embedding**: vector dày đặc nắm bắt ý nghĩa; độ tương đồng cosine.
- Các tác vụ NLP kinh điển: phân loại, nhận dạng thực thể, phân tích cảm xúc.
- Hệ sinh thái **Hugging Face**: model, dataset, `transformers` và `sentence-transformers`.
{% endvi %}

## Resources

- **FREE** — Hugging Face NLP Course: <https://huggingface.co/learn/nlp-course>
- **FREE** — `sentence-transformers` docs & examples.
- **$$** — Optional: a hosted embeddings API for larger workloads (cap your spend).

{% vi %}
**Tài nguyên:**
- **FREE** — Khóa NLP của Hugging Face.
- **FREE** — Tài liệu & ví dụ `sentence-transformers`.
- **$$** — Tùy chọn: API embedding hosted cho khối lượng lớn (nhớ đặt trần chi tiêu).
{% endvi %}

## Build

Embed 100 short texts with a free model, then build a tiny semantic search: given a query, return the 3 most similar texts.

{% vi %}
**Thực hành:** Tạo embedding cho 100 đoạn văn ngắn bằng model miễn phí, rồi xây một semantic search nhỏ: với một truy vấn, trả về 3 đoạn tương đồng nhất.
{% endvi %}

## Reflection

Why can two sentences with no shared words still be "close" in embedding space?

{% vi %}
**Tự ngẫm:** Vì sao hai câu không có từ chung vẫn có thể "gần nhau" trong không gian embedding?
{% endvi %}
