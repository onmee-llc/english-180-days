---
title: "Day 106 — Disagreement Over Technical Approach"
description: "Work through technical disagreement professionally — assert, listen, adapt."
date: 2026-04-13
---

## Session goal

Practice the language of respectful but confident technical pushback.

## Shadowing passage

> I actually had this exact situation six months ago. My tech lead wanted to use a message queue for a data sync operation I thought should be a direct API call. Here is how I handled it. First, I made sure I understood their reasoning before pushing back. I asked: 'Can you walk me through why you prefer the queue approach here?' It turned out their concern was reliability — if the downstream service was slow, a synchronous call would block the upstream process. That was a real concern I had not fully weighted. I explained my counterargument: the operation was low-frequency, latency-sensitive, and the consumer was internal. The overhead of serializing, queuing, and deserializing for twelve events a day seemed disproportionate. I proposed a hybrid: synchronous call with a retry policy and a dead-letter queue for failures only. They agreed. The important thing is that I did not just assert my opinion — I engaged with their reasoning first. And I was willing to update my view when their concern turned out to be valid. That is how I try to handle all technical disagreements: argue the technical merit, not the seniority.

---

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| I had not fully weighted | /aɪ hæd nɒt ˈfʊli ˈweɪtɪd/ | honest acknowledgment that their point had merit |
| disproportionate | /ˌdɪsprəˈpɔːʃənɪt/ | the cost of the solution is too high for the problem size |
| argue the technical merit | /ˈɑːrɡjuː ðə tɛkˈnɪkəl ˈmɛrɪt/ | keep it about the engineering, not the hierarchy |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Can you describe a real technical disagreement you had and what the outcome was?
