/**
 * Study toolbox — floating FAB with today's lesson lookup.
 * Loaded globally on every page via default.njk → pageScripts.
 */

const TOOLBOX_ID = 'study-toolbox';
const BTN_ID = 'study-toolbox-btn';
const PANEL_ID = 'study-toolbox-panel';
const DATA_ID = 'study-toolbox-data';
const PROGRESS_ID = 'study-toolbox-progress';
const TODAY_CARD_ID = 'study-toolbox-today-card';
const TOMORROW_CARD_ID = 'study-toolbox-tomorrow-card';

const PROGRAM_START = new Date('2026-04-13');
const TOTAL_DAYS = 180;
const CIRCUMFERENCE = 2 * Math.PI * 22; // r=22 → ~138.23

function getISODate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function renderLessonCard(lesson, container) {
  if (!lesson) {
    container.innerHTML =
      '<span class="study-toolbox__no-lesson">No lesson scheduled today — take a rest! 🌿</span>';
    return;
  }
  container.innerHTML = `
    <span class="study-toolbox__day-badge" data-topic-color="${lesson.h}">Day ${lesson.d}</span>
    <span class="study-toolbox__lesson-title">${lesson.t}</span>
    <a href="${lesson.u}" class="study-toolbox__open-btn">Open lesson &rarr;</a>
  `;
}

function renderMiniLesson(lesson, container) {
  if (!lesson) {
    container.innerHTML = '<span class="study-toolbox__no-lesson">—</span>';
    return;
  }
  container.innerHTML = `
    <span class="study-toolbox__day-badge study-toolbox__day-badge--sm" data-topic-color="${lesson.h}">Day ${lesson.d}</span>
    <a href="${lesson.u}" class="study-toolbox__lesson-title study-toolbox__lesson-title--mini">${lesson.t}</a>
  `;
}

function updateProgressRing(toolbox, todayDate) {
  const daysPassed = Math.max(
    0,
    Math.floor((todayDate - PROGRAM_START) / 86400000),
  );
  const progress = Math.min(daysPassed / TOTAL_DAYS, 1);
  const offset = CIRCUMFERENCE * (1 - progress);

  const fill = toolbox.querySelector('.study-toolbox__progress-fill');
  if (fill) {
    fill.style.strokeDashoffset = String(offset);
  }

  const progressEl = document.getElementById(PROGRESS_ID);
  if (progressEl) {
    const pct = Math.round(progress * 100);
    progressEl.textContent = `${daysPassed} / ${TOTAL_DAYS} days (${pct}%)`;
  }
}

function open(toolbox, btn, panel) {
  toolbox.classList.add('is-open');
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('aria-label', 'Close study toolbox');
  panel.removeAttribute('hidden');
}

function close(toolbox, btn, panel) {
  toolbox.classList.remove('is-open');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Open study toolbox');
  panel.setAttribute('hidden', '');
}

function init() {
  const toolbox = document.getElementById(TOOLBOX_ID);
  const btn = document.getElementById(BTN_ID);
  const panel = document.getElementById(PANEL_ID);
  const dataEl = document.getElementById(DATA_ID);

  if (!toolbox || !btn || !panel || !dataEl) return;

  let lessonMap = {};
  try {
    lessonMap = JSON.parse(dataEl.textContent);
  } catch (_) {
    // malformed data — toolbox still renders without lesson info
  }

  const today = new Date();
  const todayStr = getISODate(today);
  const tomorrowStr = getISODate(addDays(today, 1));

  const todayLesson = lessonMap[todayStr] || null;
  const tomorrowLesson = lessonMap[tomorrowStr] || null;

  const todayCard = document.getElementById(TODAY_CARD_ID);
  const tomorrowCard = document.getElementById(TOMORROW_CARD_ID);

  if (todayCard) renderLessonCard(todayLesson, todayCard);
  if (tomorrowCard) renderMiniLesson(tomorrowLesson, tomorrowCard);

  updateProgressRing(toolbox, today);

  btn.addEventListener('click', () => {
    if (toolbox.classList.contains('is-open')) {
      close(toolbox, btn, panel);
    } else {
      open(toolbox, btn, panel);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toolbox.classList.contains('is-open')) {
      close(toolbox, btn, panel);
      btn.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (toolbox.classList.contains('is-open') && !toolbox.contains(e.target)) {
      close(toolbox, btn, panel);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
