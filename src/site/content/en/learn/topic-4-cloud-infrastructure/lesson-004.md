---
title: "Day 44 — Networking Fundamentals"
description: "VPC, subnets, and security groups — the cloud networking vocabulary."
date: 2026-04-13
---

## Session goal

Explain the network design for a three-tier web application on AWS.

## Shadowing passage

> A three-tier web application on AWS has a clear network topology. The VPC is the private network boundary — all resources live inside it, with a defined CIDR range. I divide the VPC into three subnet tiers. Public subnets hold resources with internet access: the load balancer and NAT gateway. Application subnets are private: the API servers, Lambda functions, and container clusters. These have no direct internet access — outbound traffic routes through the NAT gateway, inbound comes only from the load balancer. Database subnets are the most restricted: no internet access at all, inbound connections only from the application subnet's IP range. Security groups are the firewall at the resource level: the load balancer security group allows inbound 443 from anywhere. The API security group allows inbound only from the load balancer security group on port 443. The database security group allows inbound only from the application security group on the database port. Referencing security groups instead of IP ranges makes the rules stable — when API servers scale out, the database security group doesn't need updating because it allows the security group, not the specific IPs. For cross-region failover I use Route 53 latency-based routing to direct traffic to the nearest healthy region.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| CIDR range | /ˈsɪdər reɪndʒ/ | IP address block notation — defines the address space for your VPC |
| NAT gateway | /næt ˈɡeɪtweɪ/ | allows private subnet resources to reach the internet without being reachable from it |
| referencing security groups | /ˈrɛfərənsɪŋ sɪˈkjʊərɪti ɡruːps/ | attach firewall rules to groups, not IPs — more stable and scalable |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What happens to your database if you accidentally delete the application security group?
