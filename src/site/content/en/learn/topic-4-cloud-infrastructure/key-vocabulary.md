---
title: Key Vocabulary
description: Essential phrases and terms for Cloud Infrastructure (AWS / GCP).
date: 2026-04-13
---

## How to use this module

For each phrase or term:
1. Say it out loud 3 times.
2. Use it in a sentence about your own work.
3. Practice using it naturally in an answer to a practice question.

**Goal:** Zero hesitation when these words come up in an interview.

## Daily drill

Pick 3–5 phrases from this list each day. Use each one out loud in a complete sentence before moving on.

---

## Compute & Services

| Term / Phrase | Usage Example |
|---------------|---------------|
| managed service | "We use a managed database service so we don't handle patching or backups ourselves." |
| serverless | "The API runs serverless on Cloud Run — we pay only when requests come in." |
| container | "Each microservice is packaged as a Docker container for consistent deployment." |
| cold start | "Lambda cold starts add two hundred milliseconds — we use provisioned concurrency for latency-sensitive endpoints." |
| warm instance | "Warm instances serve requests immediately without initialization delay." |
| provisioned concurrency | "We set provisioned concurrency to fifty for the authentication function." |

## Availability & Reliability

| Term / Phrase | Usage Example |
|---------------|---------------|
| high availability | "The system is designed for high availability across three availability zones." |
| multi-AZ | "Our database runs multi-AZ with automatic failover." |
| region | "We deploy to us-east-1 as the primary region with us-west-2 as disaster recovery." |
| autoscaling group | "The autoscaling group maintains between two and twenty instances based on CPU." |
| target tracking policy | "We use a target tracking policy to keep average CPU at seventy percent." |

## Infrastructure & DevOps

| Term / Phrase | Usage Example |
|---------------|---------------|
| Infrastructure as Code | "All our cloud resources are defined in Terraform — nothing is created manually." |
| Terraform | "Terraform manages the infrastructure lifecycle: plan, apply, destroy." |
| CloudFormation | "We use CloudFormation stacks for AWS resources with nested templates." |
| least privilege | "Every IAM role follows least privilege — only the exact permissions needed." |
| service account | "The Cloud Run service uses a dedicated service account with BigQuery read access only." |

## Interview Connectors

| Phrase | When to Use |
|--------|-------------|
| "We deployed this on..." | Starting a cloud architecture description |
| "The architecture uses..." | Describing service choices |
| "I chose Lambda here because..." | Justifying compute decisions |
| "The cost trade-off was..." | Explaining cost optimization |
| "For disaster recovery, we..." | Discussing reliability |
| "The pipeline deploys through..." | Describing CI/CD flow |