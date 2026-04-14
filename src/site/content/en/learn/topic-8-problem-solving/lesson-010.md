---
title: "Day 108 — On-Call Incident Response"
description: "Tell a production incident story: what happened, what you did, what you improved."
date: 2026-04-13
---

## Session goal

Narrate a real or realistic incident response with technical precision and calm.

## Shadowing passage

> We had a payment processing outage last year that I was on call for. I will walk you through it. At 2:17am, the alerting system fired: payment success rate dropped from 99.8 percent to 62 percent. First action: check the status page of our third-party payment provider. It was green — their systems reported healthy. Second action: open the logs for our payment service. I saw a pattern immediately: transactions were failing with a timeout error on exactly one of our three payment service instances. The other two were healthy. That is a strong signal: not a code problem, not a provider problem — something specific to one host. I drained traffic from that instance using a feature flag and success rate immediately recovered to 99.6 percent. Incident resolved in eleven minutes. Post-incident: I found that the affected instance had a file descriptor leak — a recent code change had opened database connections without properly closing them in error paths. We deployed a fix the next morning and added a file descriptor alert threshold so we would catch this before it caused customer impact in the future.

---

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| on call | /ɒn kɔːl/ | being responsible for production systems during a time window |
| drained traffic | /dreɪnd ˈtræfɪk/ | stopped routing requests to a specific instance |
| file descriptor leak | /faɪl dɪˈskrɪptər liːk/ | OS-level resource not being released — causes slow degradation |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Can you tell YOUR most interesting production incident story clearly from start to resolution?
