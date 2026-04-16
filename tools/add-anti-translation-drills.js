#!/usr/bin/env node
/**
 * Batch-adds Anti-Translation Drill + Self-Check sections to all 140 lesson files.
 * Drills are phased by topic number to match the learner's progression.
 */

const fs = require('fs');
const path = require('path');

const LEARN_DIR = path.join(__dirname, '..', 'src', 'site', 'content', 'en', 'learn');

const TOPICS = [
  'topic-1-introduce-yourself',
  'topic-2-system-design',
  'topic-3-api-microservices',
  'topic-4-cloud-infrastructure',
  'topic-5-ai-ml-pipelines',
  'topic-6-automation-workflow',
  'topic-7-project-storytelling',
  'topic-8-problem-solving',
  'topic-9-team-communication',
  'topic-10-salary-negotiation',
];

function getDrillForTopic(topicNum) {
  if (topicNum <= 2) {
    return {
      title: 'Listening First',
      body: `Close the text. Recall today's shadowing passage from memory only.

1. Say the **main idea** in one English sentence out loud.
2. Say **one specific detail** you remember.
3. If you blank out — do NOT open the text. Describe what you vaguely remember using simple English.

> Goal: Build the habit of processing English without reading — ears and memory only.`,
    };
  }
  if (topicNum <= 4) {
    return {
      title: 'Quick Response',
      body: `Re-read the Reflection question above. Now answer it — **start speaking within 3 seconds**.

- Use a filler phrase to buy time: *"That's a great question — I'd say..."* or *"Let me think... the key point is..."*
- Speak for **at least 30 seconds** without stopping.
- If you get stuck mid-sentence, do NOT pause to translate — rephrase using simpler words.

> Goal: Kill the translation pause. Native speakers don't go silent — they fill gaps and keep talking.`,
    };
  }
  if (topicNum <= 6) {
    return {
      title: 'Think in English',
      body: `Pick **one key phrase** from today's table. Explain what it means using **only English**.

- No Vietnamese. No dictionary.
- If you don't know a word, describe it: *"It's when you..."* / *"It's similar to..."* / *"The opposite would be..."*
- Then use the phrase in a new sentence about your own experience.

> Goal: Train circumlocution — the skill of explaining anything without knowing the exact word. This is what fluent speakers actually do.`,
    };
  }
  if (topicNum <= 8) {
    return {
      title: 'Interview Mode',
      body: `Someone just asked you the Reflection question in a **real interview**. Answer now.

- You have **60 seconds**. No pauses longer than 3 seconds.
- Fill gaps with: *"Let me think about that..."* / *"The way I see it..."* / *"To give you a concrete example..."*
- **Record this answer** separately from your shadowing recording.
- Play it back. Did you sound like someone they'd hire?

> Goal: Simulate interview pressure. The ability to speak under pressure without translating is what separates "good English" from "interview-ready English".`,
    };
  }
  // Topics 9-10
  return {
    title: 'Own Words',
    body: `Retell today's shadowing passage in **your own words** — do NOT repeat the original phrasing.

- Paraphrase the entire content as if explaining to a colleague who missed the meeting.
- Speak for **60–90 seconds**.
- Use different sentence structures, different transitions, different examples if possible.
- If you catch yourself quoting the passage word-for-word, stop and rephrase.

> Goal: Full integration — you own the knowledge when you can express it freely, not just repeat it.`,
  };
}

const SELF_CHECK = `## Self-Check

- [ ] Shadowed ≥3 passes without text
- [ ] Completed anti-translation drill without using Vietnamese
- [ ] Recorded at least once today
- **Translation habit:** 🟢 No translation / 🟡 Some translation / 🔴 Heavy translation`;

let updated = 0;
let skipped = 0;

for (const topic of TOPICS) {
  const topicNum = parseInt(topic.match(/topic-(\d+)/)[1], 10);
  const drill = getDrillForTopic(topicNum);
  const topicDir = path.join(LEARN_DIR, topic);

  for (let i = 1; i <= 14; i++) {
    const lessonFile = `lesson-${String(i).padStart(3, '0')}.md`;
    const filePath = path.join(topicDir, lessonFile);

    if (!fs.existsSync(filePath)) {
      console.warn(`SKIP (not found): ${topic}/${lessonFile}`);
      skipped++;
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('## Anti-Translation Drill')) {
      console.log(`SKIP (already has drill): ${topic}/${lessonFile}`);
      skipped++;
      continue;
    }

    const drillSection = `

## Anti-Translation Drill — ${drill.title} *(5 min)*

${drill.body}

${SELF_CHECK}`;

    // Append to end of file
    content = content.trimEnd() + '\n' + drillSection + '\n';

    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log(`UPDATED: ${topic}/${lessonFile}`);
  }
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
