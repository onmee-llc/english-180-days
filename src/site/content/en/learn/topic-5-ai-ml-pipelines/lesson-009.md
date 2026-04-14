---
title: "Day 61 — ML Ops and Pipelines"
description: "MLOps disciplines — versioning, reproducibility, and monitoring."
date: 2026-04-13
---

## Session goal

Describe an MLOps pipeline for a production AI service.

## Shadowing passage

> MLOps brings software engineering disciplines to machine learning systems. The four practices I consider essential. Model versioning: every model artifact is versioned with the training data identifier, hyperparameters, evaluation scores, and the code commit that produced it. This means any deployed model can be fully reproduced — I can re-create the exact model that was in production on any given date. Reproducible training: the entire training pipeline is defined in code, uses fixed random seeds, and pins all dependency versions. Running the same code on the same data produces the same model. This isn't just hygiene — it's the foundation for root cause analysis when quality degrades. Automated evaluation in CI: when a model change is proposed, the CI pipeline automatically evaluates the candidate against the golden dataset and posts a quality comparison report. No model is deployed that regresses on the evaluation set. Feature store for consistency: if the same features are used for both offline training and online inference, they must be computed identically. A feature store provides a shared computation layer — computed once, used everywhere. Offline-online skew — where training features differ from serving features — is one of the most common and hardest-to-debug quality issues in production ML systems.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| offline-online skew | /ˈɒflaɪn ˈɒnlaɪn skjuː/ | training features differ from serving features — a major source of silent quality loss |
| feature store | /ˈfiːtʃər stɔːr/ | shared computation for features used in both training and serving |
| reproducible training | /rɪˌprɒdjʊˈsɪbl ˈtreɪnɪŋ/ | same code + same data = same model — the foundation for debugging |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How would you detect offline-online skew in a production recommendation system?
