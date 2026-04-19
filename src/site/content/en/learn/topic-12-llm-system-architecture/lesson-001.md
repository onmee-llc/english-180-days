---
title: "Day 141 — LLM Provider Landscape"
description: "Compare OpenAI, Anthropic, and Gemini — explain provider selection to a technical audience."
date: 2026-04-19
---

## Session goal

Explain how you would choose an LLM provider for a specific use case, using concrete criteria — not vague preferences.

## Shadowing passage

> When selecting an LLM provider for a production system, I evaluate four criteria: capability, cost, latency, and compliance. For general-purpose tasks — classification, summarization, structured extraction — OpenAI's GPT-4o Mini hits the right balance of speed and cost. For tasks that require deep reasoning over long documents, Anthropic's Claude 3.5 Sonnet is the better choice: the extended context window and instruction-following quality are noticeably better for complex workflows. For teams already on Google Cloud who need multimodal capabilities — processing images alongside text — Gemini Pro integrates cleanly with the GCP stack. The most important architectural decision, regardless of provider, is to abstract your LLM calls behind an interface. That way, when pricing changes or a better model releases, you swap the implementation without touching business logic. I've done this twice already — once when Anthropic released Haiku and the cost dropped significantly, and once when we had a brief outage and needed to fail over to a secondary provider. The abstraction layer made both transitions a matter of hours, not days.

---

## Key phrases

| Phrase | Listen | Note |
|--------|--------|------|
| hits the right balance | [Nghe →](https://youglish.com/pronounce/hits%20the%20right%20balance/english) | use when explaining a trade-off decision |
| noticeably better | [Nghe →](https://youglish.com/pronounce/noticeably%20better/english) | confident, specific — not "a bit better" |
| swap the implementation | [Nghe →](https://youglish.com/pronounce/swap%20the%20implementation/english) | engineering language for replacing a component |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on the decision framework, not individual words.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Which provider would you choose for your KPI 1 use case, and why? Prepare a 60-second answer.

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
