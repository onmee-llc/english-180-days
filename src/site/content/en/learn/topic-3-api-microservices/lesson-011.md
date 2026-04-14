---
title: "Day 39 — Webhooks"
description: "Event-driven integration patterns — webhooks, polling, and when to use each."
date: 2026-04-13
---

## Session goal

Design a webhook system for a content automation API.

## Shadowing passage

> Webhooks are a push-based event delivery mechanism. Instead of the client polling your API repeatedly to check for new data, your system calls the client's endpoint when something happens. This is more efficient for both sides when events are infrequent compared to the polling interval. For a content automation API, I expose webhooks for post published, post failed, and quota warning events. The design considerations are these. Delivery guarantees: I deliver webhooks with at least-once semantics — if the delivery attempt fails, I retry with exponential backoff for up to twenty-four hours. Clients must handle duplicate delivery idempotently. Security: every webhook payload includes an HMAC signature in a header. The client verifies the signature using the shared secret before processing. This prevents webhook spoofing. Payload design: include enough context in the webhook payload that the consumer doesn't need to immediately call back to your API to get the full resource. For post published, include the post ID, status, platform, and timestamp. Ops considerations: store all delivered webhooks with their response codes. Give consumers a dashboard to inspect delivery history and manually retry failed deliveries. Failed webhooks with no consumer response within twenty-four hours should be logged as a potential data quality issue.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| at-least-once delivery | /æt liːst wʌns dɪˈlɪvəri/ | guarantees delivery but may send duplicates — clients must be idempotent |
| HMAC signature | /ˌeɪtʃmæk ˈsɪɡnɪtʃər/ | hash-based message authentication — proves the webhook came from you |
| idempotent consumer | /aɪˈdɛmpətənt kənˈsjuːmər/ | processing the same event twice has the same result as processing it once |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

How would you implement webhook delivery retry with exponential backoff? Walk through the design.
