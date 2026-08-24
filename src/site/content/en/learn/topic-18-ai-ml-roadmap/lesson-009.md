---
title: "Phase 9 — Building & Deploying an AI Service"
description: "Wrap your AI in a real backend service and ship it to staging (KPI 1)."
date: 2026-07-02
---

## Goal

Turn your notebook prototype into a deployed backend service — the core of AI KPI 1.

{% vi %}
**Mục tiêu:** Biến prototype trong notebook thành một dịch vụ backend đã triển khai — cốt lõi của KPI AI số 1.
{% endvi %}

## What to learn

- **API service**: wrap the model/RAG call in a clean endpoint (FastAPI or your stack).
- **Production concerns**: input validation, retry, timeout, fallback, streaming.
- **Secrets & config**: keep API keys out of code; use environment variables.
- **Deploy** to staging (a container or a managed platform) with basic CI.
- **A README** good enough to onboard a teammate in 30 minutes (a KPI 1 requirement).

{% vi %}
**Học gì:**
- **Dịch vụ API**: bọc lệnh gọi model/RAG trong một endpoint gọn gàng (FastAPI hoặc stack của bạn).
- **Vấn đề production**: kiểm tra đầu vào, retry, timeout, fallback, streaming.
- **Secret & cấu hình**: không để API key trong code; dùng biến môi trường.
- **Triển khai** lên staging (container hoặc nền tảng managed) với CI cơ bản.
- **Một README** đủ tốt để đồng đội onboard trong 30 phút (yêu cầu của KPI 1).
{% endvi %}

## Resources

- **FREE** — FastAPI official tutorial.
- **FREE** — Docker "Get started" guide.
- **FREE / $** — A free-tier host (Render, Railway, Fly.io, Cloud Run free tier).

{% vi %}
**Tài nguyên:**
- **FREE** — Hướng dẫn chính thức của FastAPI.
- **FREE** — Hướng dẫn "Get started" của Docker.
- **FREE / $** — Một host free-tier (Render, Railway, Fly.io, Cloud Run free tier).
{% endvi %}

## Build

Deploy your RAG or LLM feature as an HTTP endpoint on staging. Include retry + timeout + token logging, and write the onboarding README.

{% vi %}
**Thực hành:** Triển khai tính năng RAG/LLM của bạn thành một endpoint HTTP trên staging. Bao gồm retry + timeout + log token, và viết README onboarding.
{% endvi %}

## Reflection

Could a new teammate run your service from the README alone, with no questions?

{% vi %}
**Tự ngẫm:** Một đồng đội mới có thể chạy dịch vụ của bạn chỉ từ README, không cần hỏi gì không?
{% endvi %}
