---
title: Content Outline
description: Core concepts and frameworks for Cloud Infrastructure (AWS / GCP).
date: 2026-04-13
---

## How to use this module

1. Read the outline once silently.
2. Close the page. Try to recall the main points out loud.
3. Come back and fill in what you missed.
4. Repeat until you can present the outline verbally in 3–5 minutes.

## Practice format

For each concept below:
- State what it is (1 sentence)
- Explain when/why you'd use it (1–2 sentences)
- Give a real example from your own work (1–2 sentences)

---

## 1. Compute

**EC2 / Compute Engine** — Virtual machines. Full control over OS, runtime, and configuration. Use when you need persistent servers with custom dependencies or long-running processes.

**Lambda / Cloud Functions** — Serverless functions. Pay per invocation, auto-scales to zero. Use for event-driven workloads: API handlers, file processing triggers, scheduled jobs.

**Cloud Run / ECS Fargate** — Serverless containers. More flexibility than Lambda (custom runtimes, longer execution), less management than EC2. Use when you need Docker but don't want to manage servers.

**When to choose:** Start serverless (Lambda/Cloud Run) for new projects. Move to EC2/VMs only when you need persistent state, GPU access, or very specific OS requirements.

## 2. Storage

**S3 / GCS** — Object storage. Unlimited scale, high durability (11 nines). Use for static assets, backups, data lake files, user uploads.

**RDS / Cloud SQL** — Managed relational databases. PostgreSQL, MySQL. Automated backups, read replicas, failover. Use when you need ACID transactions and complex queries.

**DynamoDB / Firestore** — Managed NoSQL. Single-digit millisecond reads at any scale. Use for session data, user preferences, high-throughput key-value access patterns.

## 3. Networking

**VPC (Virtual Private Cloud)** — Isolated network for your cloud resources. Subnets divide the VPC into public (internet-facing) and private (internal-only) segments.

**Security groups / Firewall rules** — Control inbound and outbound traffic at the instance level. Whitelist only what's needed.

**Load balancers (ALB / Cloud Load Balancing)** — Distribute traffic across instances. Support path-based routing, TLS termination, health checks.

**CDN (CloudFront / Cloud CDN)** — Cache content at edge locations globally. Reduces latency for static assets and API responses.

## 4. Container Orchestration

**Docker** — Package applications with all dependencies into portable containers. Consistent across dev, staging, production.

**ECS / Cloud Run** — Managed container services. No Kubernetes overhead. Define task definitions, set CPU/memory, deploy.

**Kubernetes (EKS / GKE)** — Full orchestration: auto-scaling, rolling deployments, service discovery, config management. Use when you have 10+ services and need fine-grained control.

## 5. IAM & Security

**IAM roles and policies** — Grant permissions to services, not people. Each service gets only the permissions it needs (least privilege principle).

**Service accounts** — Machine identities for service-to-service authentication. No hardcoded credentials.

**Secrets management** — AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault. Never store secrets in code, environment variables, or config files.

## 6. Cost Optimization

**Reserved instances / Committed use** — 1–3 year commitment for 30–60% discount on compute. Use for predictable baseline workloads.

**Spot instances / Preemptible VMs** — Up to 90% discount, but can be interrupted. Use for batch processing, CI/CD, non-critical background jobs.

**Auto-scaling** — Scale out during peak, scale in during off-peak. Target tracking policy: maintain CPU at 70%, for example.

**Right-sizing** — Monitor actual usage. Most teams over-provision by 30–50%. Downsize instances that consistently use less than 40% CPU.

## 7. CI/CD on Cloud

**GitHub Actions** — Most common for open-source and small teams. YAML-based workflows triggered by git events.

**Cloud Build / CodePipeline** — Cloud-native CI/CD. Tight integration with cloud services. Use when deploying directly to cloud infrastructure.

**Pipeline stages** — Build → Test → Security scan → Deploy to staging → Integration tests → Deploy to production. Each stage gates the next.
- Give a real example from your own work (1–2 sentences)
