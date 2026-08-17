import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..', '..');
const CONTENT_DIR = path.join(REPO_ROOT, 'src/site/content/en/learn');
const COURSES_DATA_DIR = path.join(REPO_ROOT, 'src/site/_data/courses');
const I18N_COURSES_PATH = path.join(
  REPO_ROOT,
  'src/site/_data/i18n/courses.yml',
);
const OUT_PATH = path.join(__dirname, '..', 'src/content/lessons.json');

const PROGRAM_START = new Date('2026-08-22');
const md = new MarkdownIt({html: true});

export function extractDayNumber(title) {
  const m = (title || '').match(/^Day\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * Mirrors src/site/_includes/components/Vi.js: replaces each
 * {% vi %}...{% endvi %} block with the same `.lesson-vi` HTML structure,
 * rendered as markdown, so the mobile app's styling can target the same
 * class the web app already uses.
 */
export function parseViBlocks(rawMarkdown) {
  return rawMarkdown.replace(
    /\{%\s*vi\s*%\}([\s\S]*?)\{%\s*endvi\s*%\}/g,
    (_, viContent) => {
      const rendered = md.render(viContent.trim());
      return (
        `<div class="lesson-vi" lang="vi">` +
        `<span class="lesson-vi__label" aria-hidden="true">🇻🇳 Tiếng Việt</span>` +
        `<div class="lesson-vi__body flow">${rendered}</div>` +
        `</div>`
      );
    },
  );
}

/**
 * meta.yml stores title/description as "i18n.courses.<key>.<field>"
 * references into src/site/_data/i18n/courses.yml. Resolves to the English
 * value; returns the input unchanged if it isn't a reference.
 */
export function resolveI18nRef(value, i18nCourses) {
  const prefix = 'i18n.courses.';
  if (typeof value !== 'string' || !value.startsWith(prefix)) {
    return value;
  }
  const [key, field] = value.slice(prefix.length).split('.');
  return i18nCourses[key]?.[field]?.en ?? value;
}

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function toISO(date) {
  return date.toISOString().slice(0, 10);
}

function loadI18nCourses() {
  return yaml.load(fs.readFileSync(I18N_COURSES_PATH, 'utf8'));
}

function loadTopicMeta(i18nCourses) {
  const meta = {};
  for (const slug of fs.readdirSync(COURSES_DATA_DIR)) {
    const metaPath = path.join(COURSES_DATA_DIR, slug, 'meta.yml');
    if (!fs.existsSync(metaPath)) continue;
    const parsed = yaml.load(fs.readFileSync(metaPath, 'utf8'));
    meta[slug] = {
      highlight: parsed.highlight || 'purple',
      type: parsed.type || 'tech',
      title: resolveI18nRef(parsed.title, i18nCourses),
    };
  }
  return meta;
}

function buildLessons(topicMeta) {
  const lessons = [];

  for (const topicSlug of fs.readdirSync(CONTENT_DIR)) {
    const topicDir = path.join(CONTENT_DIR, topicSlug);
    if (!fs.statSync(topicDir).isDirectory()) continue;

    const lessonFiles = fs
      .readdirSync(topicDir)
      .filter((f) => /^lesson-\d+\.md$/.test(f))
      .sort();

    const meta = topicMeta[topicSlug] || {
      highlight: 'purple',
      type: 'tech',
      title: topicSlug,
    };

    for (const file of lessonFiles) {
      const raw = fs.readFileSync(path.join(topicDir, file), 'utf8');
      const {data: frontMatter, content} = matter(raw);

      const dayNum = extractDayNumber(frontMatter.title || '');
      if (!dayNum) {
        // Matches src/site/_data/lessonSchedule.js: files whose title isn't
        // "Day N — ..." (supplementary content like certification-prep,
        // pronunciation-guide, or a topic not yet numbered) are
        // intentionally left out of the day-by-day schedule, not a parse
        // failure — warn so it's visible, don't fail the build over it.
        console.warn(
          `build-content: skipping ${topicSlug}/${file} — title has no "Day N" prefix`,
        );
        continue;
      }

      const lessonNum = file.replace('lesson-', '').replace('.md', '');
      const bodyHtml = md.render(parseViBlocks(content));

      lessons.push({
        day: dayNum,
        date: toISO(addDays(PROGRAM_START, dayNum - 1)),
        topicSlug,
        topicTitle: meta.title,
        topicHighlight: meta.highlight,
        topicType: meta.type,
        lessonNum,
        title: frontMatter.title || '',
        shortTitle: (frontMatter.title || '').replace(
          /^Day\s+\d+\s*[—\-–—]\s*/iu,
          '',
        ),
        description: frontMatter.description || '',
        bodyHtml,
      });
    }
  }

  lessons.sort((a, b) => a.day - b.day);
  return lessons;
}

function main() {
  const i18nCourses = loadI18nCourses();
  const topicMeta = loadTopicMeta(i18nCourses);
  const lessons = buildLessons(topicMeta);

  // buildLessons() already warns (and skips) per-file when a title has no
  // "Day N" prefix — that's expected for supplementary, non-scheduled
  // content. The only thing worth hard-failing the build over is parsing
  // nothing at all, which usually means CONTENT_DIR is wrong or empty.
  if (lessons.length === 0) {
    throw new Error(
      `build-content: parsed 0 lessons from ${CONTENT_DIR} — check the ` +
        `content directory path.`,
    );
  }

  fs.mkdirSync(path.dirname(OUT_PATH), {recursive: true});
  fs.writeFileSync(
    OUT_PATH,
    JSON.stringify({programStart: toISO(PROGRAM_START), lessons}, null, 2),
  );
  console.log(`build-content: wrote ${lessons.length} lessons to ${OUT_PATH}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
