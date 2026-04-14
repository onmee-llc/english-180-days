---
title: "Day 86 — Whiteboard Communication"
description: "Draw and talk — using visuals to explain architecture in an interview."
date: 2026-04-13
---

## Session goal

Walk through a system diagram on a whiteboard — verbally and structurally.

## Shadowing passage

> When I draw a system diagram in an interview, I narrate as I draw. I don't draw silently and then explain — the interviewer wants to see my thinking process, not just the finished diagram. I start with the client on the left and the data store on the right — the directional flow of a request across the whiteboard. Then I add the components in the middle, building from the entry point in. My narration format: component name, its single responsibility, and the connection to the next component. The API gateway is the first component after the client — it handles authentication, rate limiting, and routing. Connected to the queue: the producer endpoint writes a message per incoming request. The queue is between the API tier and the processing tier — it decouples their scaling independently. The consumer pool reads from the queue: N parallel workers, each handling one task at a time. The workers write results to the database and push a completion event to the notification service. I annotate failure paths as I draw: dashed arrow from the consumer to the dead letter queue, label 'max retries exceeded'. I annotate scale numbers: queue depth in normal operation, peak consumers. The whiteboard drawing is a communication tool, not a design deliverable. Its purpose is to make my verbal explanation legible. I keep it simple enough that anyone in the room can follow without engineering background.

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| narrate as you draw | /ˈnæreɪt æz juː drɔː/ | think aloud during diagramming — interviewers assess reasoning, not just outcome |
| single responsibility | /ˈsɪŋɡl ˌrɛspɒnsɪˈbɪlɪti/ | one job per component label — keeps diagrams clear and concepts clean |
| annotate failure paths | /ˈænəteɪt ˈfeɪljər pɑːθs/ | show DLQ and error flows — signals operational maturity |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Practice drawing this diagram for 3 minutes, narrating aloud. Where did you hesitate?
