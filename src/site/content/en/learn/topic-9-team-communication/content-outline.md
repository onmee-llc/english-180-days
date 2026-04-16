---
title: Content Outline
description: Core concepts and frameworks for Team Communication & Code Review.
date: 2026-04-13
---

## How to use this module

1. Read the outline once silently.
2. Close the page. Try to recall the main points out loud.
3. Come back and fill in what you missed.
4. Repeat until you can present the outline verbally in 3–5 minutes.

## Practice format

For each scenario below:
- Say the example phrases out loud
- Adapt them to your own work context
- Practice until they feel natural, not rehearsed

---

## 1. Daily Standup

The most frequent English you'll use in a remote job. Every day. Keep it structured and under 90 seconds.

**Structure:** What I did yesterday → What I'm doing today → Any blockers.

**Example:**
> "Yesterday I finished the API endpoint for content scheduling and opened a PR. Today I'm starting on the retry logic for the publishing queue. No blockers right now, but I might need a review on the PR by end of day."

**Common mistakes:** Too detailed (giving a code walkthrough), too vague ("worked on stuff"), or forgetting to mention blockers.

## 2. Code Review — Giving Feedback

Be specific, kind, and constructive. Frame suggestions as questions when possible.

**Good feedback patterns:**
- "Have you considered using X here? It might simplify the error handling."
- "This looks good — one suggestion: could we extract this into a helper to improve readability?"
- "I'm not sure I understand the reasoning here — could you explain why we need the extra null check?"
- "This might cause issues when the queue is empty. What do you think about adding a guard?"

**Avoid:** "This is wrong." "Why did you do it this way?" "Just use X instead."

## 3. Code Review — Receiving Feedback

Be open. Don't be defensive. Engage with the feedback.

**Good response patterns:**
- "Good point, I'll update that."
- "My reasoning was X, but I see your concern — let me reconsider."
- "Could you elaborate on what you mean by…?"
- "That's a valid concern. I'll add a test for that edge case."

**Avoid:** "It works fine." "That's not important." Ignoring comments.

## 4. Technical Proposals

Presenting a solution to the team for discussion.

**Structure:**
1. Problem statement (what we're solving)
2. Proposed approach (your solution)
3. Alternatives considered (what you rejected and why)
4. Trade-offs (what you gain, what you give up)
5. Open questions (what you need input on)

**Example opener:**
> "I'd like to propose an approach for the content scheduling migration. The problem we're solving is that the current cron-based system doesn't scale beyond ten thousand jobs per day. I've considered two options — here are the trade-offs. I'm open to other ideas."

## 5. Async Written Communication

Slack messages, GitHub comments, documentation. In remote teams, writing IS your voice.

**Principles:**
- Lead with context. Don't assume the reader knows what you're working on.
- Be specific. "The API is slow" → "The /users endpoint returns in 2.3 seconds at p95."
- Propose a solution, don't just state the problem.
- Use formatting: bullet points, code blocks, headers.

## 6. Asking for Help

Frame questions efficiently. Show what you've already tried.

**Bad:** "This doesn't work. Any ideas?"

**Good:** "I've been debugging the queue consumer for about two hours. I've tried X and Y. The behavior I'm seeing is Z. The logs show [specific log line]. Any ideas on what I might be missing?"

**The pattern:** What I'm working on → What I've tried → What I'm seeing → What I expected → Specific question.

## 7. Status Updates

Communicating progress and blockers to stakeholders (PMs, leads).

**Structure:** Progress summary → What's on track → What's at risk → What you need from them.

**Example:**
> "Quick update on the publishing pipeline: the core queue logic is done and tested. The platform integration is on track for Friday. One risk: the Pinterest API rate limit is lower than expected, which might affect our publishing throughput target. I'll have a more detailed assessment by tomorrow."
