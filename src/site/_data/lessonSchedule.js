'use strict';

const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const yaml = require('js-yaml');

// Day 1 of the 180-day program
const PROGRAM_START = new Date('2026-04-13');

const CONTENT_DIR = path.join(__dirname, '../content/en/learn');
const COURSES_DATA_DIR = path.join(__dirname, 'courses');

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Calendar range: April 2026 → November 2026 (covers all 210 scheduled days + buffer)
const CALENDAR_RANGE = [
  {year: 2026, month: 3}, // April (0-indexed)
  {year: 2026, month: 4},
  {year: 2026, month: 5},
  {year: 2026, month: 6},
  {year: 2026, month: 7},
  {year: 2026, month: 8},
  {year: 2026, month: 9},
  {year: 2026, month: 10}, // November
];

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function toISO(date) {
  return date.toISOString().slice(0, 10);
}

function extractDayNumber(title) {
  const m = (title || '').match(/^Day\s+(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function loadTopicMeta() {
  const meta = {};
  if (!fs.existsSync(COURSES_DATA_DIR)) return meta;
  for (const slug of fs.readdirSync(COURSES_DATA_DIR)) {
    const metaPath = path.join(COURSES_DATA_DIR, slug, 'meta.yml');
    if (!fs.existsSync(metaPath)) continue;
    try {
      const parsed = yaml.load(fs.readFileSync(metaPath, 'utf8'));
      meta[slug] = {
        highlight: parsed.highlight || 'purple',
        type: parsed.type || 'tech',
        title: parsed.title || slug,
        url: parsed.url || '',
      };
    } catch (_) {
      // skip malformed meta
    }
  }
  return meta;
}

function buildScheduleMap(topicMeta) {
  const scheduleMap = {}; // ISO date → lesson info
  if (!fs.existsSync(CONTENT_DIR)) return scheduleMap;

  for (const topicSlug of fs.readdirSync(CONTENT_DIR)) {
    const topicDir = path.join(CONTENT_DIR, topicSlug);
    if (!fs.statSync(topicDir).isDirectory()) continue;

    const lessonFiles = fs
      .readdirSync(topicDir)
      .filter((f) => /^lesson-\d+\.md$/.test(f))
      .sort();

    const meta = topicMeta[topicSlug] || {highlight: 'purple', type: 'tech'};

    for (const file of lessonFiles) {
      const filePath = path.join(topicDir, file);
      let frontMatter;
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        frontMatter = matter(raw).data;
      } catch (_) {
        continue;
      }

      const dayNum = extractDayNumber(frontMatter.title || '');
      if (!dayNum) continue;

      const lessonDate = addDays(PROGRAM_START, dayNum - 1);
      const isoDate = toISO(lessonDate);
      const lessonNum = file.replace('lesson-', '').replace('.md', '');

      scheduleMap[isoDate] = {
        day: dayNum,
        date: isoDate,
        url: `/learn/${topicSlug}/lesson-${lessonNum}`,
        title: frontMatter.title || '',
        // strip "Day N — " prefix for a compact display label
        shortTitle: (frontMatter.title || '').replace(
          /^Day\s+\d+\s*[—\-\u2013\u2014]\s*/iu,
          '',
        ),
        description: frontMatter.description || '',
        topicSlug,
        topicHighlight: meta.highlight,
        topicType: meta.type,
      };
    }
  }

  return scheduleMap;
}

function buildCalendarMonths(scheduleMap) {
  return CALENDAR_RANGE.map(({year, month}) => {
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDayNum = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    // Monday-first: JS getDay() 0=Sun..6=Sat → Mon-first index = (getDay()+6)%7
    const startOffset = (firstDay.getUTCDay() + 6) % 7;

    const weeks = [];
    let week = [];

    // Leading empty cells
    for (let i = 0; i < startOffset; i++) {
      week.push({date: null, dayOfMonth: null, lesson: null, outOfMonth: true});
    }

    for (let d = 1; d <= lastDayNum; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        d,
      ).padStart(2, '0')}`;
      week.push({
        date: dateStr,
        dayOfMonth: d,
        lesson: scheduleMap[dateStr] || null,
        outOfMonth: false,
      });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Trailing empty cells
    if (week.length > 0) {
      while (week.length < 7) {
        week.push({
          date: null,
          dayOfMonth: null,
          lesson: null,
          outOfMonth: true,
        });
      }
      weeks.push(week);
    }

    return {
      key: `${year}-${String(month + 1).padStart(2, '0')}`,
      label: `${MONTH_NAMES[month]} ${year}`,
      year,
      month: month + 1,
      weeks,
    };
  });
}

module.exports = function () {
  const topicMeta = loadTopicMeta();
  const scheduleMap = buildScheduleMap(topicMeta);
  const calendarMonths = buildCalendarMonths(scheduleMap);

  // Compact map for client-side toolbox lookup: date → minimal lesson info
  const lessonMap = {};
  for (const [date, lesson] of Object.entries(scheduleMap)) {
    lessonMap[date] = {
      d: lesson.day,
      u: lesson.url,
      t: lesson.shortTitle,
      h: lesson.topicHighlight,
      y: lesson.topicType,
    };
  }

  return {
    calendarMonths,
    dayNames: DAY_NAMES,
    programStartDate: toISO(PROGRAM_START),
    lessonMap,
  };
};
