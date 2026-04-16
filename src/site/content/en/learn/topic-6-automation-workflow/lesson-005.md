---
title: "Day 69 — GitHub Actions"
description: "CI/CD with GitHub Actions — workflows, secrets, and best practices."
date: 2026-04-13
---

## Session goal

Walk through a GitHub Actions workflow for a production deployment pipeline.

## Shadowing passage

> My production deployment pipeline uses GitHub Actions with four jobs running in a defined dependency graph. The first job is test-and-lint: runs on every push to any branch. It installs dependencies from a cache, runs the unit and integration test suites, runs linting rules, and runs a Trivy security scan on the application source. This job takes about three minutes. It must pass before any downstream job can proceed. The second job is build: runs only on push to main. It builds the Docker image, tags it with the git commit SHA, and pushes to Google Artifact Registry. Using the SHA as the tag means every deployed image is fully traceable to the exact code that produced it. The third job is deploy-staging: triggered after a successful build. It runs database migrations against the staging environment and deploys the new image using Cloud Deploy. After deployment, a smoke test hits the staging health check endpoint five times with a ten-second interval. Failure at this stage rolls back automatically. The fourth job is deploy-production: triggered manually with a required approval from a team lead. This is an intentional pace control — every production deployment is a considered decision, not an automatic cascade. Production deployments use a canary strategy with automated rollback on error rate increase. Secrets in GitHub Actions are never in the workflow YAML — they are stored in GitHub Secret Store and referenced by name.

## Key phrases

| Phrase | Listen | Note |
|--------|-----|------|
| SHA tagging | [Nghe →](https://youglish.com/pronounce/SHA%20tagging/english) | commit hash as image tag — complete traceability from build to deployment |
| required approval | [Nghe →](https://youglish.com/pronounce/required%20approval/english) | human gate before production — a deliberate pace control, not bureaucracy |
| canary strategy | [Nghe →](https://youglish.com/pronounce/canary%20strategy/english) | gradual traffic shift with automatic rollback — catch production issues early |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What happens to your deployment pipeline if GitHub Actions goes down for 2 hours?


## Anti-Translation Drill — Think in English *(5 min)*

Pick **one key phrase** from today's table. Explain what it means using **only English**.

- No Vietnamese. No dictionary.
- If you don't know a word, describe it: *"It's when you…"* / *"It's similar to…"* / *"The opposite would be…"*
- Then use the phrase in a new sentence about your own experience.

> Goal: Train circumlocution — the skill of explaining anything without knowing the exact word. This is what fluent speakers actually do.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
