#!/usr/bin/env node
/**
 * Replaces IPA columns in key phrases tables with YouGlish listen links.
 *
 * Table format in lesson files:
 *   | Phrase | IPA | Note |
 *   |--------|-----|------|
 *   | some phrase | /ɪpə/ | some note |
 *
 * Becomes:
 *   | Phrase | Listen | Note |
 *   |--------|--------|------|
 *   | some phrase | [Nghe →](https://youglish.com/pronounce/some%20phrase/english) | some note |
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

function phraseToYouGlishUrl(phrase) {
  // Remove markdown formatting if any, encode for URL
  const clean = phrase.trim().replace(/\*\*/g, '').replace(/`/g, '');
  const encoded = encodeURIComponent(clean);
  return `https://youglish.com/pronounce/${encoded}/english`;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Already processed
  if (content.includes('youglish.com')) {
    return false;
  }

  // Replace header row: | IPA | → | Listen |
  content = content.replace(/\| IPA \|/g, '| Listen |');

  // Replace separator row for IPA column: |-----|  (3-10 dashes between pipes)
  // Header is: | Phrase | Listen | Note |
  // Separator: | ------- | ----- | ---- |  — we just need to ensure 2nd col separator is valid
  // The separator lines are untouched in length, already valid markdown.

  // Replace IPA cell values: | /.../ | → | [Nghe →](url) |
  // Matches a table cell containing IPA: | /content/ |
  // We need to also extract the phrase from the same row.
  // Approach: process line by line to extract phrase + IPA together.

  const lines = content.split('\n');
  const result = lines.map((line) => {
    // Match a table data row with IPA in 2nd column
    // Format: | phrase text | /ipa text/ | note text |
    const match = line.match(/^\|\s*(.+?)\s*\|\s*(\/[^/]+\/)\s*\|\s*(.+?)\s*\|$/);
    if (!match) return line;

    const phrase = match[1];
    const note = match[3];
    const url = phraseToYouGlishUrl(phrase);
    return `| ${phrase} | [Nghe →](${url}) | ${note} |`;
  });

  const updated = result.join('\n');
  if (updated === content) return false;

  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

let updated = 0;
let skipped = 0;

for (const topic of TOPICS) {
  const topicDir = path.join(LEARN_DIR, topic);
  for (let i = 1; i <= 14; i++) {
    const lessonFile = `lesson-${String(i).padStart(3, '0')}.md`;
    const filePath = path.join(topicDir, lessonFile);
    if (!fs.existsSync(filePath)) {
      skipped++;
      continue;
    }
    const changed = processFile(filePath);
    if (changed) {
      updated++;
      console.log(`UPDATED: ${topic}/${lessonFile}`);
    } else {
      skipped++;
    }
  }
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
