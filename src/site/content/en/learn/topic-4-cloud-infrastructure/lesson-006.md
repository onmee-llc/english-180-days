---
title: "Day 46 — CI/CD Pipeline"
description: "Describe your deployment pipeline — stages, gates, and rollback strategy."
date: 2026-04-13
---

## Session goal

Walk through the CI/CD pipeline for your content automation SaaS.

## Shadowing passage

> My deployment pipeline has four stages, each gating the next. Stage one: CI. On every pull request, GitHub Actions runs the test suite, linting, and a security scan with Trivy for container image vulnerabilities. The pipeline also builds the container image and runs contract tests against the OpenAPI spec. No merge without green CI. Stage two: build and push. On merge to main, GitHub Actions builds the production container image, tags it with the git commit hash, and pushes to Google Artifact Registry. I tag with the commit hash, not 'latest', so every deployed version is fully traceable. Stage three: staging deployment. Cloud Deploy automatically deploys the new image to the staging environment. Integration tests run against staging — real database migrations, real API calls, real queue processing. I have a fifteen-minute smoke window before automatic promotion to production. Stage four: production deployment. A canary release — ten percent of traffic routes to the new version for thirty minutes. If error rate stays below the baseline, full promotion. If it rises, automatic rollback. Rollback is instantaneous because it's just a traffic switch — the previous container version is still running. Database migrations are always backward-compatible before deployment and cleaned up in a follow-up deployment after full promotion.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| commit hash tagging | /kəˈmɪt hæʃ ˈtæɡɪŋ/ | track exactly which code is running in production by hash |
| canary release | /kəˈnɛəri rɪˈliːs/ | gradual traffic shift — catch problems before full rollout |
| backward-compatible migrations | /ˈbækwərd kəmˈpætɪbl maɪˈɡreɪʃənz/ | DB changes must work with both the old and new app version simultaneously |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How do you roll back a database migration that's already been applied to production?
