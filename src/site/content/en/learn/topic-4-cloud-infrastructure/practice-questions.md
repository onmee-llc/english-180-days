---
title: Practice Questions
description: 5 interview questions to drill for Cloud Infrastructure (AWS / GCP).
date: 2026-04-13
---

## How to use this module

For each question:
1. **First pass:** Answer out loud with notes allowed.
2. **Second pass:** Answer out loud — no notes, no preparation.
3. **Record yourself** on at least one question per session and listen back.

**Target:** Each answer should feel automatic — natural, structured, confident.

## Scoring yourself

After each answer, ask:
- Was the structure clear? (Opening → Main point → Example → Conclusion)
- Did I hesitate on technical vocabulary?
- Did the answer take 2–4 minutes?
- Would I be satisfied if this was a real interview?

---

## Question 1 — Walk me through the cloud architecture of a recent project you built

**What the interviewer expects:** Real experience, not theoretical knowledge. Name specific services, explain why you chose them, describe the data flow. Show you understand the trade-offs.

**Structure your answer:** Project context → Compute choice (and why) → Data storage → Networking / security → CI/CD pipeline → Key trade-off you made.

## Question 2 — How would you design a highly available system on AWS?

**What the interviewer expects:** Multi-AZ deployment, load balancer, auto-scaling, database failover, health checks. Show you think about failure modes proactively.

**Structure your answer:** Define availability target (e.g. 99.9%) → Compute redundancy (multi-AZ) → Database (read replicas, automated failover) → Load balancing → Monitoring and alerting → Disaster recovery strategy.

## Question 3 — What is the difference between EC2, ECS, and Lambda? When do you use each?

**What the interviewer expects:** Clear understanding of the compute spectrum from full control (EC2) to fully managed (Lambda). Decision criteria: runtime, duration, scaling pattern, cost.

**Structure your answer:** EC2 (full control, persistent) → ECS (container-based, Docker) → Lambda (event-driven, short-lived) → Decision framework → A real example from your work.

## Question 4 — How do you handle secrets and sensitive configuration in a cloud environment?

**What the interviewer expects:** Never in code, never in environment variables at build time. Secrets Manager or Vault. Rotation policies. IAM-based access. Audit logging.

**Structure your answer:** The problem (hardcoded secrets) → Your approach (Secrets Manager) → Access control (IAM) → Rotation strategy → Audit trail → Real example.

## Question 5 — How have you approached cost optimization in your cloud projects?

**What the interviewer expects:** Right-sizing, reserved instances, spot/preemptible, auto-scaling, monitoring actual usage. Show it's an ongoing practice, not a one-time audit.

**Structure your answer:** Monitoring (cost dashboards, alerts) → Right-sizing (actual vs provisioned) → Reserved/spot strategy → Auto-scaling → Architecture-level savings (serverless, caching) → Specific savings you achieved.
- Did the answer take 2–4 minutes?
- Would I be satisfied if this was a real interview?
