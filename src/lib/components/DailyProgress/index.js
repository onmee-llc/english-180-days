/**
 * @fileoverview DailyProgress web component.
 *
 * Tracks and displays:
 * - Days elapsed and remaining in the 180-day journey
 * - Consecutive day streak (days with at least one lesson visited)
 * - Course completion percentage
 * - Manual lesson completion toggle
 *
 * Storage key: `dm_progress` in localStorage.
 * Schema:
 * {
 *   firstVisit: ISO date string (YYYY-MM-DD),
 *   streak: { "YYYY-MM-DD": true, ... },
 *   completed: ["/learn/topic-1/index", ...]
 * }
 */

const STORAGE_KEY = 'dm_progress';
const TOTAL_DAYS = 180;

/** @returns {string} Today as YYYY-MM-DD */
function today() {
  return new Date().toISOString().slice(0, 10);
}

/** @returns {object} Parsed progress data */
function loadProgress() {
  try {
    return JSON.parse(localStorage[STORAGE_KEY] || 'null') || {};
  } catch (e) {
    return {};
  }
}

/** @param {object} data */
function saveProgress(data) {
  try {
    localStorage[STORAGE_KEY] = JSON.stringify(data);
  } catch (e) {
    console.warn('DailyProgress: failed to write to localStorage');
  }
}

/**
 * Record today as active and set firstVisit if not yet set.
 * @param {object} data
 * @returns {object} Updated data
 */
function recordToday(data) {
  const d = today();
  if (!data.firstVisit) data.firstVisit = d;
  if (!data.streak) data.streak = {};
  data.streak[d] = true;
  return data;
}

/**
 * Count how many consecutive days ending today have streak entries.
 * @param {object} streak
 * @returns {number}
 */
function calcStreak(streak) {
  if (!streak) return 0;
  let count = 0;
  const d = new Date();
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const key = d.toISOString().slice(0, 10);
    if (!streak[key]) break;
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

/**
 * Days elapsed since firstVisit (inclusive).
 * @param {string|undefined} firstVisit
 * @returns {number}
 */
function calcDaysElapsed(firstVisit) {
  if (!firstVisit) return 0;
  const start = new Date(firstVisit);
  const now = new Date();
  const diff = Math.floor((now - start) / 86400000);
  return Math.min(diff + 1, TOTAL_DAYS);
}

class DailyProgress extends HTMLElement {
  connectedCallback() {
    let data = loadProgress();
    data = recordToday(data);
    saveProgress(data);
    this.render(data);
  }

  render(data) {
    const streak = calcStreak(data.streak);
    const elapsed = calcDaysElapsed(data.firstVisit);
    const remaining = Math.max(TOTAL_DAYS - elapsed, 0);

    // Read course completion % from CourseLinks storage
    const courseKey = this.getAttribute('data-course-key');
    let percent = 0;
    try {
      const cp = JSON.parse(localStorage['webdev_course_progress'] || 'null');
      if (cp && courseKey && cp[courseKey]) {
        percent = Math.round(Number(cp[courseKey].percent) || 0);
      }
    } catch (e) {
      // ignore
    }

    this.innerHTML = `
      <div class="daily-progress">
        <div class="daily-progress__stats">
          <div class="daily-progress__stat" title="Consecutive days of practice">
            <span class="daily-progress__value">${streak}</span>
            <span class="daily-progress__label">🔥 streak</span>
          </div>
          <div class="daily-progress__stat" title="Days remaining in your 180-day journey">
            <span class="daily-progress__value">${remaining}</span>
            <span class="daily-progress__label">📅 remaining</span>
          </div>
          <div class="daily-progress__stat" title="Days elapsed since you began">
            <span class="daily-progress__value">${elapsed}</span>
            <span class="daily-progress__label">day ${elapsed}/${TOTAL_DAYS}</span>
          </div>
        </div>
        <div class="daily-progress__bar-wrap" title="${percent}% of this topic complete">
          <div class="daily-progress__bar" style="width:${percent}%"></div>
        </div>
        <span class="daily-progress__percent">${percent}%</span>
      </div>
    `;
  }
}

customElements.define('daily-progress', DailyProgress);

// ─────────────────────────────────────────────────────────────────────────────
// LessonComplete — a toggle button placed on each lesson page
// ─────────────────────────────────────────────────────────────────────────────

class LessonComplete extends HTMLElement {
  connectedCallback() {
    this._url = this.getAttribute('data-url') || window.location.pathname;
    this._render();
  }

  _isComplete() {
    const data = loadProgress();
    return Array.isArray(data.completed) && data.completed.includes(this._url);
  }

  _toggle() {
    const data = loadProgress();
    if (!Array.isArray(data.completed)) data.completed = [];
    const idx = data.completed.indexOf(this._url);
    if (idx === -1) {
      data.completed.push(this._url);
    } else {
      data.completed.splice(idx, 1);
    }
    saveProgress(data);
    this._render();

    // Sync the course-links sidebar checkmark for this url
    document
      .querySelectorAll(`course-links a[href="${this._url}"]`)
      .forEach((a) => {
        if (idx === -1) {
          a.setAttribute('data-complete', 'true');
        } else {
          a.removeAttribute('data-complete');
        }
      });
  }

  _render() {
    const done = this._isComplete();
    const btnClass = done
      ? 'lesson-complete__btn is-done'
      : 'lesson-complete__btn';
    const label = done ? '\u2713 Lesson complete' : 'Mark as complete';
    this.innerHTML =
      `<button class="${btnClass}" type="button" aria-pressed="${done}">` +
      `<span>${label}</span></button>`;
    this.querySelector('button').addEventListener('click', () =>
      this._toggle(),
    );
  }
}

customElements.define('lesson-complete', LessonComplete);
