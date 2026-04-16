---
title: "Day 27 — Security Fundamentals"
description: "Authentication, authorization, and secrets management in system design."
date: 2026-04-13
---

## Session goal

Design the auth layer for a multi-tenant SaaS API — three explicit layers.

## Shadowing passage

> Security in distributed systems has three layers I design explicitly. Authentication: proving you are who you claim to be. For a public API I use JWT tokens issued at login, validated on every request at the API gateway. JWTs carry claims — user ID, tenant ID, role, expiry — so downstream services can make authorization decisions without a database round trip. Authorization: proving you are allowed to do what you're trying to do. In a multi-tenant SaaS, every data query must include a tenant ID filter. I enforce this at the ORM layer, not application code, so it's structurally impossible to accidentally query cross-tenant data. I've also used PostgreSQL's row-level security feature — policies that restrict read and write access by tenant ID, enforced at the database level regardless of application logic. Secrets management: API keys, database passwords, and signing keys must never be in environment variables in production. I use AWS Secrets Manager or HashiCorp Vault with automatic rotation and audit logging. Each service is granted access only to the secrets it actually needs — no service has access to the full secret store. Secret access is logged — who, what, when.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| asymmetric key pair | /ˌeɪsɪˈmɛtrɪk kiː pɛər/ | public/private keys — stronger than shared secret for JWT signing |
| row-level security | /roʊ ˈlɛvəl sɪˈkjʊərɪti/ | database-enforced tenant isolation — strongest form |
| least privilege | /liːst ˈprɪvɪlɪdʒ/ | each service gets only the permissions it requires — nothing extra |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What happens if your JWT signing key is compromised? Walk through the incident response.


## Anti-Translation Drill — Listening First *(5 min)*

Close the text. Recall today's shadowing passage from memory only.

1. Say the **main idea** in one English sentence out loud.
2. Say **one specific detail** you remember.
3. If you blank out — do NOT open the text. Describe what you vaguely remember using simple English.

> Goal: Build the habit of processing English without reading — ears and memory only.

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
