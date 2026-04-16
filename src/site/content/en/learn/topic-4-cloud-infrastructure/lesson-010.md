---
title: "Day 50 — Terraform and IaC"
description: "Infrastructure as code — why it matters and what good Terraform looks like."
date: 2026-04-13
---

## Session goal

Explain your Infrastructure as Code discipline and how you structure Terraform.

## Shadowing passage

> Infrastructure as Code means defining cloud resources in version-controlled configuration files, applying changes through a managed pipeline exactly as you would with application code. The benefits for a production system are significant. Reproducibility: I can recreate the full environment in a new region by applying the same Terraform configuration. Auditability: every infrastructure change is a pull request with a diff, a review, and a merge commit. Drift prevention: regular 'terraform plan' in CI shows any manual changes that have diverged from the declared state. I organize Terraform by environment and by resource type. Each environment — staging, production — is a separate Terraform workspace with separate state files in Cloud Storage with versioning enabled. Within an environment, I separate resources into modules: networking, compute, database, secrets. This keeps changes scoped and reduces the blast radius of a misconfiguration. Secrets are never in Terraform state — I reference existing Secret Manager secrets by name, not value. Before every 'terraform apply' in production, I always run 'terraform plan' and review the diff carefully. A plan that shows more than five resources changing unexpectedly is a signal to pause, understand why, and potentially roll back. The most dangerous Terraform operation is destroy — I require a manual confirmation step and protect production state files with object lock.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| version-controlled configuration | /ˈvɜːrʒən kənˈtroʊld ˌkɒnfɪɡjʊˈreɪʃən/ | IaC stored in git — changes are auditable and reversible |
| drift prevention | /drɪft prɪˈvɛnʃən/ | detecting manual changes that diverge from declared state — a key IaC discipline |
| object lock | /ˈɒbdʒɪkt lɒk/ | prevents deleting state files — protects against accidental terraform destroy |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What do you do if 'terraform plan' shows 50 unexpected resource changes in production?


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
