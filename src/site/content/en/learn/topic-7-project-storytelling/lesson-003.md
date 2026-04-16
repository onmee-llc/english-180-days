---
title: "Day 79 — Technical Decision Narrative"
description: "Tell the story behind an architecture decision — not just the what, but the why."
date: 2026-04-13
---

## Session goal

Explain why you chose GCP over AWS for your content automation SaaS.

## Shadowing passage

> Architecture decisions have a narrative, and telling that narrative well distinguishes a senior engineer from someone who just implemented what they were told. When I chose GCP over AWS for the content automation platform, the decision wasn't simple preference — it was driven by three converging factors. Context: I was building alone, with a limited budget and a need to move fast. Factor one: Cloud Run's serverless container model matches the workload pattern better than any equivalent AWS service. The workload is highly burst-heavy — quiet for hours, then a wave of publishing jobs. Cloud Run scales to zero, so I pay nothing when the system is idle. ECS Fargate has a similar story, but Cloud Run's simplicity and its billing granularity under load was meaningfully better for this pattern at the time. Factor two: BigQuery for the analytics pipeline. BigQuery's serverless SQL query model — pay per query, no cluster to provision — removes a significant operational burden. The equivalent on AWS involves managing EMR or Athena configurations, both of which require more operational knowledge. Factor three: I had more Cloud experience and a larger cache of documented patterns. Moving fast matters more than the optimal technology choice when you're a solo founder with a paying customer waiting. This narrative is honest about the constraints — not pretending I did a comprehensive cloud comparison, but explaining the real considerations that drove the choice.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| drove the choice | /droʊv ðə tʃɔɪs/ | explain the real reasons — interviewers value honesty over perfect decisions |
| billing granularity | /ˈbɪlɪŋ ɡrænjʊˈlærɪti/ | how finely the service meters cost — matters at low utilization |
| solo founder constraint | /ˈsoʊloʊ ˈfaʊndər kənˈstreɪnt/ | team size and velocity are valid architectural constraints — state them explicitly |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

What would you have chosen differently with a team of five engineers? How does team size change the decision?


## Anti-Translation Drill — Interview Mode *(5 min)*

Someone just asked you the Reflection question in a **real interview**. Answer now.

- You have **60 seconds**. No pauses longer than 3 seconds.
- Fill gaps with: *"Let me think about that…"* / *"The way I see it…"* / *"To give you a concrete example…"*
- **Record this answer** separately from your shadowing recording.
- Play it back. Did you sound like someone they'd hire?

> Goal: Simulate interview pressure. The ability to speak under pressure without translating is what separates "good English" from "interview-ready English".

## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation
