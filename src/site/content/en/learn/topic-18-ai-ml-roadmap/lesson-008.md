---
title: "Phase 8 — Retrieval-Augmented Generation (RAG)"
description: "Ground an LLM in your own documents to reduce hallucination."
date: 2026-06-30
---

## Goal

Build a question-answering system over your own documents using retrieval + an LLM.

{% vi %}
**Mục tiêu:** Xây một hệ thống hỏi-đáp trên tài liệu của chính bạn bằng truy hồi + LLM.
{% endvi %}

## What to learn

- **Why RAG**: gives the model fresh, private knowledge without retraining; reduces hallucination.
- **Pipeline**: chunk documents → embed → store in a vector database → retrieve top-k → put in the prompt.
- **Vector stores**: FAISS (local, free), Chroma; managed options later.
- **Chunking strategy** and why it makes or breaks quality.
- **Citing sources** so answers are verifiable.

{% vi %}
**Học gì:**
- **Vì sao dùng RAG**: cấp cho model kiến thức mới, riêng tư mà không cần huấn luyện lại; giảm bịa đặt.
- **Pipeline**: chia nhỏ tài liệu → embed → lưu vào vector database → truy hồi top-k → đưa vào prompt.
- **Vector store**: FAISS (cục bộ, miễn phí), Chroma; lựa chọn managed về sau.
- **Chiến lược chunking** và vì sao nó quyết định chất lượng.
- **Trích dẫn nguồn** để câu trả lời kiểm chứng được.
{% endvi %}

## Resources

- **FREE** — FAISS and Chroma docs & quickstarts.
- **FREE** — LangChain / LlamaIndex RAG tutorials (use the concepts even if you write it yourself).
- **FREE** — Embedding via a local `sentence-transformers` model.

{% vi %}
**Tài nguyên:**
- **FREE** — Tài liệu & quickstart của FAISS và Chroma.
- **FREE** — Hướng dẫn RAG của LangChain / LlamaIndex (dùng khái niệm dù bạn tự viết).
- **FREE** — Embedding bằng model `sentence-transformers` cục bộ.
{% endvi %}

## Build

Index 10–20 of your own notes/docs into a local vector store. Ask 5 questions and check that answers cite the right source chunks.

{% vi %}
**Thực hành:** Đưa 10–20 ghi chú/tài liệu của bạn vào một vector store cục bộ. Hỏi 5 câu và kiểm tra câu trả lời trích đúng đoạn nguồn.
{% endvi %}

## Reflection

When the system answered wrong, was it retrieval's fault or the LLM's? How would you tell?

{% vi %}
**Tự ngẫm:** Khi hệ thống trả lời sai, đó là lỗi của khâu truy hồi hay của LLM? Bạn phân biệt bằng cách nào?
{% endvi %}
