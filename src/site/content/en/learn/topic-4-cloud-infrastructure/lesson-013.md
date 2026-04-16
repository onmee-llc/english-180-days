---
title: "Day 53 — Cost Optimization at Scale"
description: "Explain how you reduced cloud costs while maintaining reliability — a common interview topic."
date: 2026-04-13
---

## Session goal

Practice presenting this topic section fluently — aim for one complete pass without stopping.

## Shadowing passage

> One of the most impactful projects I led was a cloud cost reduction initiative that cut our monthly AWS bill by about 40 percent without degrading availability. Let me walk through what we changed. First, we identified compute waste. We ran AWS Cost Explorer and found that 60 percent of our EC2 instances were consistently below 15 percent CPU utilization. We right-sized them — moved from m5.xlarge to m5.large for stateless services — and converted baseline workloads to Graviton instances, which are 20 percent cheaper for the same performance. Second, we eliminated idle storage. RDS snapshots older than 30 days were being retained indefinitely by default. We applied lifecycle policies and moved them to S3 Glacier after 7 days, reducing storage costs by another 15 percent. Third, we optimized data transfer. Most of our internal service calls were crossing availability zones because we hadn't pinned them. Switching to AZ-aware load balancing eliminated unnecessary cross-AZ traffic charges. Fourth, we implemented Savings Plans for our predictable baseline load and used Spot instances for batch processing jobs that can tolerate interruption. The CI pipeline runs entirely on Spot — it's stateless and retryable. Together these changes saved $18,000 per month.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| right-sizing | /raɪt ˈsaɪzɪŋ/ | matching instance type to actual usage — the fastest cloud cost win |
| Savings Plans | /ˈseɪvɪŋz plænz/ | commit to consistent usage for lower rates — 30–40% savings on baseline EC2 |
| cross-AZ traffic | /krɒs eɪ ziː ˈtræfɪk/ | data transfer between availability zones is charged — pin services to avoid it |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How do you balance cost optimization with the engineering time required to implement it? What's your decision threshold?


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
