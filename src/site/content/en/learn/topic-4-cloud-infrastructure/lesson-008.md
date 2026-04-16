---
title: "Day 48 — Container Architecture"
description: "Docker, image design, and Kubernetes fundamentals for a senior engineer."
date: 2026-04-13
---

## Session goal

Explain your container strategy and how you design production-quality images.

## Shadowing passage

> A production container image is not just a working application — it is a security and operational artifact. I follow five disciplines. First, use minimal base images: Alpine or distroless where possible. A smaller attack surface means fewer vulnerabilities. A Python Alpine image is fifty megabytes versus the standard Python image at nine hundred megabytes. Second, multi-stage builds: build the application in one stage with all build tooling, copy only the compiled artifact into the production stage. The production image doesn't contain compilers, test frameworks, or dev dependencies. Third, run as non-root: the container process should run as a dedicated user with UID greater than one thousand, not root. If the container is compromised, non-root limits damage. Fourth, pin image versions precisely — not 'python:3.11', but 'python:3.11.8-alpine3.19' — to ensure builds are reproducible. Fifth, health check endpoints: every containerized service exposes a slash healthz endpoint that the orchestrator can probe. The health check must verify actual application readiness — not just that the process is running, but that dependencies are reachable and the application can serve requests. On Kubernetes, I configure both liveness probes — restart if unhealthy — and readiness probes — remove from load balancer if not ready — as separate endpoints because the recovery actions are different.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| distroless | [Nghe →](https://youglish.com/pronounce/distroless/english) | Google's minimal base image — no shell, no package manager, smallest attack surface |
| multi-stage build | [Nghe →](https://youglish.com/pronounce/multi-stage%20build/english) | build in one stage, copy artifact to production stage — smaller final image |
| readiness probe | [Nghe →](https://youglish.com/pronounce/readiness%20probe/english) | Kubernetes check: is this pod ready to receive traffic? Different from liveness |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What's the security implication of running a container as root in a Kubernetes pod?


## Anti-Translation Drill — Quick Response *(5 min)*

Re-read the Reflection question above. Now answer it — **start speaking within 3 seconds**.

- Use a filler phrase to buy time: *"That's a great question — I'd say…"* or *"Let me think… the key point is…"*
- Speak for **at least 30 seconds** without stopping.
- If you get stuck mid-sentence, do NOT pause to translate — rephrase using simpler words.

> Goal: Kill the translation pause. Native speakers don't go silent — they fill gaps and keep talking.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
