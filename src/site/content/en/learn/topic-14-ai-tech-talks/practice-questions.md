---
title: Practice Questions
description: 5 presentation and Q&A scenarios to drill for KPI 4 Tech Talks.
date: 2026-04-19
---

## How to use this module

For each question:
1. **First pass:** Answer out loud with notes allowed.
2. **Second pass:** Answer out loud — no notes, no preparation.
3. **Record yourself** and listen back.

---

## Question 1 — Opening Hook

**"You have 60 seconds to open your Tech Talk on LLM Architecture. Go."**

**What a strong opening looks like:**
- Starts with a question or surprising fact — not your name or a title slide
- Establishes the problem the audience recognizes
- Creates a reason to keep listening
- Does NOT start with "Today I will talk about…"

---

## Question 2 — Technical Explanation to Mixed Audience

**"How would you explain LLM streaming to someone who knows backend engineering but has never worked with LLMs?"**

**What a strong answer looks like:**
- Starts with the user-facing outcome (text appears as it's generated)
- One clear analogy (e.g., "like a download progress bar, but for text")
- The technical detail: server-sent events, chunk buffering
- One specific implementation decision you made

---

## Question 3 — Live Demo Narration

**"Narrate a live demo of your KPI 1 system as if the audience is watching your screen."**

**What strong narration looks like:**
- Explains what you're about to do before doing it
- Points out the key things to notice ("what you're seeing here is…")
- Explains what's happening under the hood as the code runs
- Doesn't go silent for more than 3 seconds

---

## Question 4 — Q&A: Difficult Question

**Audience member asks: "Your latency is 4 seconds. Why is it so slow? That's not acceptable for a real product."**

**What a strong response looks like:**
- Acknowledge the concern directly — don't be defensive
- Explain the 4-second breakdown (retrieval, LLM call, post-processing)
- State what you're doing to improve it
- Set the right context: "for async document Q&A, 4 seconds is acceptable; for a chat interface, I agree we'd need sub-2 seconds"

---

## Question 5 — Lessons Learned Story

**"What is one thing that went wrong in your KPI 1 project, and what did you learn from it?"**

**What a strong answer looks like:**
- Specific: names the component, the date, the impact
- Not vague: "we had performance issues" is not a lessons learned story
- Root cause: what actually caused the problem
- Resolution: what you changed and what the result was
- Transfer: what would you tell another team to avoid this
