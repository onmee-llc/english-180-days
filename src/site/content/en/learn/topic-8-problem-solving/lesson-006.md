---
title: "Day 104 — Code Quality Discussion"
description: "Talk about clean code, tech debt, and refactoring as engineering leadership topics."
date: 2026-04-13
---

## Session goal

Make your code quality philosophy sound mature and pragmatic, not dogmatic.

## Shadowing passage

> My approach to code quality is pragmatic rather than purist. I care deeply about readability — code is read far more often than it is written, so clarity is not a luxury, it is an efficiency tool. What I look for specifically in a code review: does this function do one thing? Is the naming precise enough that I do not need the comment to understand it? Would a new team member understand the intent without asking the author? On technical debt — I think of it in two categories. Deliberate debt is when you make a conscious trade-off, you document it, and you schedule when to pay it back. Accidental debt is when something rots because nobody noticed or ownership was unclear. Deliberate debt I am comfortable with. Accidental debt I try to surface early, because it compounds. For refactoring, my test is: can I improve the structure of this code without changing its observable behavior, and can I verify that with tests? If the test suite does not cover the area being refactored, I write tests first before touching the code. Otherwise you are not refactoring, you are rewriting — and rewriting without tests is just adding new risk.

---

## Key phrases

| Phrase | IPA | Note |
|--------|-----|------|
| pragmatic | /præɡˈmætɪk/ | balanced, practical — not rigid or ideological |
| deliberate debt | /dɪˈlɪbərɪt dɛt/ | conscious, documented trade-off with a payback plan |
| observable behavior | /əbˈzɜːrvəbl bɪˈheɪvjər/ | what the function does externally — refactoring must not change this |

## 30-minute protocol

**Minutes 1–5** — Read the passage silently twice. Focus on meaning, not pronunciation.

**Minutes 6–15** — Shadow aloud with the text visible. 4 full passes. Match rhythm and stress.

**Minutes 16–22** — Shadow without the text. 3 passes. Accept mistakes — keep moving.

**Minutes 23–28** — Record yourself once. Play it back immediately. Note one phrase to improve.

**Minutes 29–30** — Write the phrase you struggled with. Say it 10 times slowly, then at full speed.

## Reflection

Can you explain your code quality standards without sounding like you're quoting a textbook?
