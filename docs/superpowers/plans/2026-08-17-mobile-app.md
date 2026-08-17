# Daily Mastery Mobile App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Daily Mastery mobile app scaffold — Vue 3 + Vite frontend wrapped in Capacitor, sharing the existing Firebase project's auth/progress data, reading lesson content bundled offline from the existing markdown/yml source.

**Architecture:** A new, independent `mobile/` npm package inside this repo. A build-time Node script parses the existing Eleventy content (`src/site/content/en/learn/**`, `src/site/_data/courses/**`, `src/site/_data/i18n/courses.yml`) into `mobile/src/content/lessons.json`. The Vue app reads that JSON for all lesson content (fully offline) and talks to the existing Firebase project (`aevo-labs`) only for auth + progress sync, reusing the merge strategy already proven in `src/lib/fb.js`. Capacitor wraps the Vite build into iOS and Android projects.

**Tech Stack:** Vue 3 (`<script setup>`), Vite 5, vue-router 4, Capacitor 6 (`@capacitor/core`, `@capacitor/ios`, `@capacitor/android`, `@capacitor/preferences`, `@capacitor/local-notifications`), Firebase JS SDK 10, gray-matter + js-yaml + markdown-it (content build script), Vitest (pure-logic unit tests).

## Global Constraints

- Lesson content is bundled at build time — no runtime content API (per spec: `docs/superpowers/specs/2026-08-17-mobile-app-design.md`).
- Progress data (`streak`, `completed`) syncs to the same Firestore path `users/{uid}` the web app already uses — same document shape, same union-merge semantics as `src/lib/fb.js`.
- `PROGRAM_START` is `2026-08-22`, matching `src/site/_data/lessonSchedule.js`.
- Automated tests are written only for pure/branching logic (content-build self-check, progress merge). UI screens are verified manually — matches the spec's own Testing section.
- This environment has no Xcode app or Android SDK installed (only Xcode command-line tools). Tasks that only need `npx cap sync` will run here; `npx cap run ios|android` needs to happen on a machine with Xcode/Android Studio installed — note this explicitly when you reach Task 8.
- This plan builds structure and data flow only. Per the spec's "Visual design" section, invoke the `hallmark` or `taste-skill` skill for the actual visual/UI polish pass as a follow-up after this plan — not part of any task here.

---

### Task 1: Scaffold Vue 3 + Vite app

**Files:**
- Create: `mobile/package.json`
- Create: `mobile/vite.config.js`
- Create: `mobile/index.html`
- Create: `mobile/src/main.js`
- Create: `mobile/src/App.vue`
- Create: `mobile/.gitignore`

**Interfaces:**
- Produces: a Vite dev server on `http://localhost:5173` serving `App.vue`. Later tasks replace `App.vue`'s contents.

- [ ] **Step 1: Create `mobile/package.json`**

```json
{
  "name": "daily-mastery-mobile",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "build-content": "node scripts/build-content.js"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "firebase": "^10.12.0",
    "@capacitor/core": "^6.0.0",
    "@capacitor/preferences": "^6.0.0",
    "@capacitor/local-notifications": "^6.0.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.0.0",
    "@capacitor/ios": "^6.0.0",
    "@capacitor/android": "^6.0.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.3.0",
    "vitest": "^1.6.0",
    "gray-matter": "^4.0.3",
    "js-yaml": "^4.1.0",
    "markdown-it": "^14.1.0"
  }
}
```

- [ ] **Step 2: Create `mobile/vite.config.js`**

```js
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {port: 5173},
});
```

- [ ] **Step 3: Create `mobile/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Daily Mastery</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 4: Create `mobile/src/main.js`**

```js
import {createApp} from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

- [ ] **Step 5: Create `mobile/src/App.vue`**

```vue
<script setup></script>

<template>
  <main>
    <h1>Daily Mastery</h1>
  </main>
</template>
```

- [ ] **Step 6: Create `mobile/.gitignore`**

```
node_modules/
dist/
ios/
android/
src/content/lessons.json
```

- [ ] **Step 7: Install and verify dev server**

Run:
```bash
cd mobile && npm install && npm run dev
```
Expected: Vite prints `Local: http://localhost:5173/`. Open it — page shows "Daily Mastery". Stop the server (Ctrl+C) once confirmed.

- [ ] **Step 8: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/package.json mobile/vite.config.js mobile/index.html mobile/src/main.js mobile/src/App.vue mobile/.gitignore
git commit -m "feat(mobile): scaffold Vue 3 + Vite app"
```

---

### Task 2: Content build script

**Files:**
- Create: `mobile/scripts/build-content.js`
- Create: `mobile/scripts/build-content.test.js`

**Interfaces:**
- Consumes: `src/site/content/en/learn/**/lesson-*.md` (frontmatter: `title`, `description`; body: markdown with `{% vi %}...{% endvi %}` blocks), `src/site/_data/courses/**/meta.yml` (`title`, `description` as `i18n.courses.<key>.<field>` references, `highlight`, `type`), `src/site/_data/i18n/courses.yml` (`<key>.title.en`, `<key>.description.en`).
- Produces: `mobile/src/content/lessons.json` with shape `{programStart: "2026-08-22", lessons: [{day, date, topicSlug, topicTitle, topicHighlight, topicType, lessonNum, title, shortTitle, description, bodyHtml}, ...]}`, sorted by `day` ascending.

- [ ] **Step 1: Write the failing test**

```js
// mobile/scripts/build-content.test.js
import {describe, it, expect} from 'vitest';
import {extractDayNumber, parseViBlocks, resolveI18nRef} from './build-content.js';

describe('extractDayNumber', () => {
  it('reads the day number out of a "Day N — Title" string', () => {
    expect(extractDayNumber('Day 1 — Your Core Story')).toBe(1);
    expect(extractDayNumber('Day 42 - Something')).toBe(42);
  });

  it('returns null when there is no leading "Day N"', () => {
    expect(extractDayNumber('Untitled')).toBeNull();
  });
});

describe('parseViBlocks', () => {
  it('wraps {% vi %}...{% endvi %} blocks in a .lesson-vi div', () => {
    const md = 'Hello.\n\n{% vi %}\nXin chào.\n{% endvi %}\n\nBye.';
    const out = parseViBlocks(md);
    expect(out).toContain('<div class="lesson-vi" lang="vi">');
    expect(out).toContain('Xin chào.');
    expect(out).not.toContain('{% vi %}');
    expect(out).not.toContain('{% endvi %}');
  });
});

describe('resolveI18nRef', () => {
  const i18n = {
    topic_1_introduce_yourself: {
      title: {en: 'Topic 1 — Introduce Yourself'},
      description: {en: 'Some description.'},
    },
  };

  it('resolves an "i18n.courses.<key>.<field>" reference to its English value', () => {
    expect(
      resolveI18nRef('i18n.courses.topic_1_introduce_yourself.title', i18n),
    ).toBe('Topic 1 — Introduce Yourself');
  });

  it('returns the raw string unchanged when it is not an i18n reference', () => {
    expect(resolveI18nRef('Plain title', i18n)).toBe('Plain title');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mobile && npx vitest run scripts/build-content.test.js`
Expected: FAIL — `Cannot find module './build-content.js'` (or named exports missing).

- [ ] **Step 3: Write the implementation**

```js
// mobile/scripts/build-content.js
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

    const meta = topicMeta[topicSlug] || {highlight: 'purple', type: 'tech', title: topicSlug};

    for (const file of lessonFiles) {
      const raw = fs.readFileSync(path.join(topicDir, file), 'utf8');
      const {data: frontMatter, content} = matter(raw);

      const dayNum = extractDayNumber(frontMatter.title || '');
      if (!dayNum) continue;

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

  const lessonFileCount = fs
    .readdirSync(CONTENT_DIR)
    .filter((slug) => fs.statSync(path.join(CONTENT_DIR, slug)).isDirectory())
    .flatMap((slug) =>
      fs
        .readdirSync(path.join(CONTENT_DIR, slug))
        .filter((f) => /^lesson-\d+\.md$/.test(f)),
    ).length;

  if (lessons.length !== lessonFileCount) {
    throw new Error(
      `build-content: parsed ${lessons.length} lessons but found ` +
        `${lessonFileCount} lesson-*.md files — a lesson likely failed to ` +
        `parse (missing/malformed "Day N" title in frontmatter).`,
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mobile && npx vitest run scripts/build-content.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Run the script for real and inspect output**

Run: `cd mobile && npm run build-content`
Expected: `build-content: wrote N lessons to .../mobile/src/content/lessons.json` with no thrown error. Open the file and confirm the first entry has `day: 1`, `date: "2026-08-22"`, and a `bodyHtml` containing `<div class="lesson-vi"`.

- [ ] **Step 6: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/scripts/build-content.js mobile/scripts/build-content.test.js
git commit -m "feat(mobile): build-time content script parsing lessons into JSON"
```

---

### Task 3: Firebase composable with progress merge logic

**Files:**
- Create: `mobile/src/firebase.js`
- Create: `mobile/src/composables/useProgress.js`
- Create: `mobile/src/composables/mergeProgress.js`
- Create: `mobile/src/composables/mergeProgress.test.js`

**Interfaces:**
- Consumes: `firebase/app`, `firebase/auth`, `firebase/firestore`, `@capacitor/preferences`.
- Produces: `useProgress()` composable exposing `{progress, isSignedIn, init(), signIn(), signOut(), markComplete(lessonKey)}`, backed by `mergeProgress(a, b)`. Later tasks (`TodayView.vue`, `SettingsView.vue`) consume this composable directly.

- [ ] **Step 1: Write the failing test for the pure merge function**

```js
// mobile/src/composables/mergeProgress.test.js
import {describe, it, expect} from 'vitest';
import {mergeProgress} from './mergeProgress.js';

describe('mergeProgress', () => {
  it('unions streak days from both sides', () => {
    const a = {streak: {'2026-08-22': true}};
    const b = {streak: {'2026-08-23': true}};
    expect(mergeProgress(a, b).streak).toEqual({
      '2026-08-22': true,
      '2026-08-23': true,
    });
  });

  it('unions completed lessons without duplicates', () => {
    const a = {completed: ['lesson-1']};
    const b = {completed: ['lesson-1', 'lesson-2']};
    expect(mergeProgress(a, b).completed.sort()).toEqual([
      'lesson-1',
      'lesson-2',
    ]);
  });

  it('picks the earliest firstVisit', () => {
    const a = {firstVisit: '2026-08-25'};
    const b = {firstVisit: '2026-08-22'};
    expect(mergeProgress(a, b).firstVisit).toBe('2026-08-22');
  });

  it('handles missing fields on both sides', () => {
    expect(mergeProgress({}, {})).toEqual({streak: {}, completed: []});
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mobile && npx vitest run src/composables/mergeProgress.test.js`
Expected: FAIL — `Cannot find module './mergeProgress.js'`.

- [ ] **Step 3: Implement `mergeProgress.js`**

```js
// mobile/src/composables/mergeProgress.js
// Ported verbatim from src/lib/fb.js — same commutative/idempotent union
// merge, so the mobile app and web app converge on repeated syncs.
export function mergeProgress(a = {}, b = {}) {
  const out = {};

  const firstVisits = [a.firstVisit, b.firstVisit].filter(Boolean).sort();
  if (firstVisits.length) {
    out.firstVisit = firstVisits[0];
  }

  out.streak = Object.assign({}, a.streak || {}, b.streak || {});

  const completed = new Set([
    ...(Array.isArray(a.completed) ? a.completed : []),
    ...(Array.isArray(b.completed) ? b.completed : []),
  ]);
  out.completed = [...completed];

  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mobile && npx vitest run src/composables/mergeProgress.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Create `mobile/src/firebase.js`**

```js
// mobile/src/firebase.js
import {initializeApp, getApps} from 'firebase/app';

// Same aevo-labs project the web app uses (src/site/_data/site.js).
// Firebase web API keys are not secret — access is enforced by
// firestore.rules, not by hiding this value.
const firebaseConfig = {
  apiKey: 'AIzaSyDG2xe1oIY6KywRLLiSx_9iPAVHDjnKs3Q',
  authDomain: 'aevo-labs.firebaseapp.com',
  projectId: 'aevo-labs',
  storageBucket: 'aevo-labs.firebasestorage.app',
  messagingSenderId: '372316750039',
  appId: '1:372316750039:web:dd0018f4275ac35201f092',
};

export function ensureFirebaseApp() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}
```

- [ ] **Step 6: Create `mobile/src/composables/useProgress.js`**

```js
// mobile/src/composables/useProgress.js
import {reactive, toRefs} from 'vue';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as authSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import {Preferences} from '@capacitor/preferences';
import {ensureFirebaseApp} from '../firebase.js';
import {mergeProgress} from './mergeProgress.js';

const PROGRESS_KEY = 'dm_progress';

const state = reactive({
  progress: {streak: {}, completed: []},
  isSignedIn: false,
  isReady: false,
});

let unsubscribeSnapshot = () => {};

async function loadLocalProgress() {
  const {value} = await Preferences.get({key: PROGRESS_KEY});
  try {
    return value ? JSON.parse(value) : {streak: {}, completed: []};
  } catch (_) {
    return {streak: {}, completed: []};
  }
}

async function saveLocalProgress(data) {
  state.progress = data;
  await Preferences.set({key: PROGRESS_KEY, value: JSON.stringify(data)});
}

function userRef(uid) {
  return doc(getFirestore(), 'users', uid);
}

async function pushProgress(uid) {
  try {
    await setDoc(userRef(uid), state.progress, {merge: true});
  } catch (err) {
    console.warn('could not write progress to Firestore', err);
  }
}

export function useProgress() {
  async function init() {
    if (state.isReady) return;
    ensureFirebaseApp();
    state.progress = await loadLocalProgress();

    onAuthStateChanged(getAuth(), async (user) => {
      unsubscribeSnapshot();
      state.isSignedIn = !!user;
      if (!user) return;

      const snap = await getDoc(userRef(user.uid));
      const remote = snap.exists() ? snap.data() : {};
      const merged = mergeProgress(state.progress, remote);
      await saveLocalProgress(merged);
      await pushProgress(user.uid);

      unsubscribeSnapshot = onSnapshot(userRef(user.uid), async (s) => {
        const r = s.exists() ? s.data() : {};
        await saveLocalProgress(mergeProgress(state.progress, r));
      });
    });

    state.isReady = true;
  }

  async function signIn() {
    ensureFirebaseApp();
    await signInWithPopup(getAuth(), new GoogleAuthProvider());
  }

  async function signOut() {
    await authSignOut(getAuth());
  }

  async function markComplete(lessonKey) {
    const completed = new Set(state.progress.completed);
    completed.add(lessonKey);
    const today = new Date().toISOString().slice(0, 10);
    const next = {
      ...state.progress,
      completed: [...completed],
      streak: {...state.progress.streak, [today]: true},
      firstVisit: state.progress.firstVisit || today,
    };
    await saveLocalProgress(next);
    const user = getAuth().currentUser;
    if (user) await pushProgress(user.uid);
  }

  return {...toRefs(state), init, signIn, signOut, markComplete};
}
```

- [ ] **Step 7: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/firebase.js mobile/src/composables/useProgress.js mobile/src/composables/mergeProgress.js mobile/src/composables/mergeProgress.test.js
git commit -m "feat(mobile): Firebase auth + Firestore progress sync composable"
```

---

### Task 4: Router, bottom nav shell, Today screen

**Files:**
- Create: `mobile/src/router.js`
- Create: `mobile/src/components/BottomNav.vue`
- Create: `mobile/src/views/TodayView.vue`
- Modify: `mobile/src/App.vue`

**Interfaces:**
- Consumes: `useProgress()` (Task 3), `mobile/src/content/lessons.json` (Task 2).
- Produces: 4 routes (`/`, `/calendar`, `/courses`, `/settings`) — Tasks 5–7 fill in the last three views.

- [ ] **Step 1: Create `mobile/src/router.js`**

```js
// mobile/src/router.js
import {createRouter, createWebHistory} from 'vue-router';
import TodayView from './views/TodayView.vue';
import CalendarView from './views/CalendarView.vue';
import CoursesView from './views/CoursesView.vue';
import SettingsView from './views/SettingsView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', name: 'today', component: TodayView},
    {path: '/calendar', name: 'calendar', component: CalendarView},
    {path: '/courses', name: 'courses', component: CoursesView},
    {path: '/settings', name: 'settings', component: SettingsView},
  ],
});
```

- [ ] **Step 2: Create `mobile/src/components/BottomNav.vue`**

```vue
<script setup></script>

<template>
  <nav class="bottom-nav">
    <router-link to="/">Today</router-link>
    <router-link to="/calendar">Calendar</router-link>
    <router-link to="/courses">Courses</router-link>
    <router-link to="/settings">Settings</router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0 env(safe-area-inset-bottom);
  background: #111;
  border-top: 1px solid #333;
}
.bottom-nav a {
  color: #999;
  text-decoration: none;
  font-size: 0.85rem;
}
.bottom-nav a.router-link-exact-active {
  color: #fff;
  font-weight: 600;
}
</style>
```

- [ ] **Step 3: Create `mobile/src/views/TodayView.vue`**

```vue
<script setup>
import {computed} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';

const {progress, isSignedIn, markComplete} = useProgress();

const todayISO = new Date().toISOString().slice(0, 10);
const lesson = computed(
  () =>
    content.lessons.find((l) => l.date === todayISO) ||
    content.lessons.find((l) => l.date >= content.programStart),
);

const lessonKey = computed(() =>
  lesson.value ? `${lesson.value.topicSlug}/lesson-${lesson.value.lessonNum}` : '',
);
const isComplete = computed(() =>
  progress.value.completed.includes(lessonKey.value),
);
</script>

<template>
  <section v-if="lesson" class="today">
    <p class="today__day">Day {{ lesson.day }} · {{ lesson.topicTitle }}</p>
    <h1>{{ lesson.shortTitle }}</h1>
    <div class="today__body" v-html="lesson.bodyHtml"></div>
    <button
      type="button"
      :disabled="isComplete"
      @click="markComplete(lessonKey)"
    >
      {{ isComplete ? 'Completed ✓' : 'Mark complete' }}
    </button>
    <p v-if="!isSignedIn" class="today__hint">
      Sign in from Settings to sync progress across devices.
    </p>
  </section>
  <p v-else>No lesson scheduled for today.</p>
</template>
```

- [ ] **Step 4: Modify `mobile/src/App.vue`**

```vue
<script setup>
import {onMounted} from 'vue';
import {useProgress} from './composables/useProgress.js';
import BottomNav from './components/BottomNav.vue';

const {init} = useProgress();
onMounted(init);
</script>

<template>
  <router-view />
  <BottomNav />
</template>
```

- [ ] **Step 5: Add router to `main.js`**

Modify `mobile/src/main.js`:

```js
import {createApp} from 'vue';
import App from './App.vue';
import {router} from './router.js';

createApp(App).use(router).mount('#app');
```

- [ ] **Step 6: Add `vue-router` dependency and stub the two remaining views so the app compiles**

Run: `cd mobile && npm install vue-router@^4.3.0`

Create `mobile/src/views/CalendarView.vue`:
```vue
<template>
  <p>Calendar — see Task 5.</p>
</template>
```

Create `mobile/src/views/CoursesView.vue`:
```vue
<template>
  <p>Courses — see Task 6.</p>
</template>
```

Create `mobile/src/views/SettingsView.vue`:
```vue
<template>
  <p>Settings — see Task 7.</p>
</template>
```

- [ ] **Step 7: Verify manually**

Run: `cd mobile && npm run build-content && npm run dev`
Open `http://localhost:5173`. Expected: "Day 1 · Topic 1 — ..." heading, the lesson-001 body rendered (including a Vietnamese block), a "Mark complete" button, and a bottom nav with 4 tabs. Click "Mark complete" — button becomes disabled and reads "Completed ✓". Click "Calendar"/"Courses"/"Settings" tabs — each shows its stub text.

- [ ] **Step 8: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/router.js mobile/src/components/BottomNav.vue mobile/src/views/TodayView.vue mobile/src/views/CalendarView.vue mobile/src/views/CoursesView.vue mobile/src/views/SettingsView.vue mobile/src/App.vue mobile/src/main.js mobile/package.json mobile/package-lock.json
git commit -m "feat(mobile): router, bottom nav shell, Today screen"
```

---

### Task 5: Calendar screen

**Files:**
- Modify: `mobile/src/views/CalendarView.vue`

**Interfaces:**
- Consumes: `useProgress()` (`progress.streak`), `content/lessons.json`.

- [ ] **Step 1: Implement `mobile/src/views/CalendarView.vue`**

```vue
<script setup>
import {computed} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';

const {progress} = useProgress();

const months = computed(() => {
  const byMonth = {};
  for (const lesson of content.lessons) {
    const key = lesson.date.slice(0, 7); // YYYY-MM
    (byMonth[key] ||= []).push(lesson);
  }
  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, lessons]) => ({key, lessons}));
});

const streakCount = computed(
  () => Object.keys(progress.value.streak || {}).length,
);
</script>

<template>
  <section class="calendar">
    <h1>Calendar</h1>
    <p class="calendar__streak">🔥 {{ streakCount }}-day streak</p>

    <div v-for="month in months" :key="month.key" class="calendar__month">
      <h2>{{ month.key }}</h2>
      <ul>
        <li
          v-for="lesson in month.lessons"
          :key="lesson.date"
          :class="{'calendar__day--done': progress.streak[lesson.date]}"
        >
          <span class="calendar__date">{{ lesson.date }}</span>
          <span class="calendar__title">{{ lesson.shortTitle }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.calendar__day--done {
  color: #2ecc71;
}
</style>
```

- [ ] **Step 2: Verify manually**

Run: `cd mobile && npm run dev`. Open `/calendar`. Expected: streak count line, lessons grouped by month in ascending date order, each row showing date + short title. Go to Today and mark today's lesson complete, return to Calendar — that day's row should now be styled green (has the `calendar__day--done` class).

- [ ] **Step 3: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/views/CalendarView.vue
git commit -m "feat(mobile): Calendar screen with streak grouping"
```

---

### Task 6: Courses screen

**Files:**
- Modify: `mobile/src/views/CoursesView.vue`
- Modify: `mobile/src/router.js`
- Create: `mobile/src/views/LessonView.vue`

**Interfaces:**
- Consumes: `content/lessons.json`, `useProgress()`.
- Produces: route `/lesson/:topicSlug/:lessonNum` for viewing any past/future lesson (reuses the same rendering `TodayView` uses).

- [ ] **Step 1: Implement `mobile/src/views/CoursesView.vue`**

```vue
<script setup>
import {computed} from 'vue';
import content from '../content/lessons.json';

const topics = computed(() => {
  const byTopic = {};
  for (const lesson of content.lessons) {
    (byTopic[lesson.topicSlug] ||= {
      topicSlug: lesson.topicSlug,
      topicTitle: lesson.topicTitle,
      topicHighlight: lesson.topicHighlight,
      lessons: [],
    }).lessons.push(lesson);
  }
  return Object.values(byTopic);
});
</script>

<template>
  <section class="courses">
    <h1>Courses</h1>
    <article v-for="topic in topics" :key="topic.topicSlug" class="courses__topic">
      <h2>{{ topic.topicTitle }}</h2>
      <ul>
        <li v-for="lesson in topic.lessons" :key="lesson.lessonNum">
          <router-link
            :to="{name: 'lesson', params: {topicSlug: topic.topicSlug, lessonNum: lesson.lessonNum}}"
          >
            Day {{ lesson.day }} · {{ lesson.shortTitle }}
          </router-link>
        </li>
      </ul>
    </article>
  </section>
</template>
```

- [ ] **Step 2: Create `mobile/src/views/LessonView.vue`**

```vue
<script setup>
import {computed} from 'vue';
import {useRoute} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';

const route = useRoute();
const {progress, markComplete} = useProgress();

const lesson = computed(() =>
  content.lessons.find(
    (l) =>
      l.topicSlug === route.params.topicSlug &&
      l.lessonNum === route.params.lessonNum,
  ),
);
const lessonKey = computed(() =>
  lesson.value ? `${lesson.value.topicSlug}/lesson-${lesson.value.lessonNum}` : '',
);
const isComplete = computed(() =>
  progress.value.completed.includes(lessonKey.value),
);
</script>

<template>
  <section v-if="lesson" class="lesson">
    <p class="lesson__day">Day {{ lesson.day }} · {{ lesson.topicTitle }}</p>
    <h1>{{ lesson.shortTitle }}</h1>
    <div class="lesson__body" v-html="lesson.bodyHtml"></div>
    <button
      type="button"
      :disabled="isComplete"
      @click="markComplete(lessonKey)"
    >
      {{ isComplete ? 'Completed ✓' : 'Mark complete' }}
    </button>
  </section>
  <p v-else>Lesson not found.</p>
</template>
```

- [ ] **Step 3: Add the route**

Modify `mobile/src/router.js` — add the import and route entry:

```js
import LessonView from './views/LessonView.vue';
```

```js
    {
      path: '/lesson/:topicSlug/:lessonNum',
      name: 'lesson',
      component: LessonView,
    },
```
(inserted into the `routes` array alongside the existing 4 entries)

- [ ] **Step 4: Verify manually**

Run: `cd mobile && npm run dev`. Open `/courses`. Expected: one section per topic, each listing its lessons as links. Click a lesson link — navigates to `/lesson/<topicSlug>/<lessonNum>` and renders that lesson's title/body/complete button, matching what Today shows for day 1.

- [ ] **Step 5: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/views/CoursesView.vue mobile/src/views/LessonView.vue mobile/src/router.js
git commit -m "feat(mobile): Courses screen and per-lesson detail route"
```

---

### Task 7: Settings screen — sign-in, reminder time, local notification

**Files:**
- Modify: `mobile/src/views/SettingsView.vue`
- Create: `mobile/src/composables/useReminder.js`

**Interfaces:**
- Consumes: `useProgress()` (`isSignedIn`, `signIn`, `signOut`), `@capacitor/preferences`, `@capacitor/local-notifications`, `@capacitor/core` (`Capacitor.isNativePlatform`).
- Produces: `useReminder()` exposing `{time, setTime(hhmm)}`. `setTime` persists the chosen time and (native only) reschedules a daily repeating local notification.

- [ ] **Step 1: Create `mobile/src/composables/useReminder.js`**

```js
// mobile/src/composables/useReminder.js
import {ref} from 'vue';
import {Preferences} from '@capacitor/preferences';
import {Capacitor} from '@capacitor/core';
import {LocalNotifications} from '@capacitor/local-notifications';

const REMINDER_KEY = 'dm_reminder_time'; // "HH:mm"
const NOTIFICATION_ID = 1;

const time = ref('20:00');

async function scheduleNative(hhmm) {
  if (!Capacitor.isNativePlatform()) return;

  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') {
    const req = await LocalNotifications.requestPermissions();
    if (req.display !== 'granted') return;
  }

  await LocalNotifications.cancel({notifications: [{id: NOTIFICATION_ID}]});

  const [hour, minute] = hhmm.split(':').map(Number);
  await LocalNotifications.schedule({
    notifications: [
      {
        id: NOTIFICATION_ID,
        title: 'Daily Mastery',
        body: "Today's lesson is ready — keep the streak going.",
        schedule: {on: {hour, minute}, every: 'day'},
      },
    ],
  });
}

export function useReminder() {
  async function init() {
    const {value} = await Preferences.get({key: REMINDER_KEY});
    if (value) time.value = value;
  }

  async function setTime(hhmm) {
    time.value = hhmm;
    await Preferences.set({key: REMINDER_KEY, value: hhmm});
    await scheduleNative(hhmm);
  }

  return {time, init, setTime};
}
```

- [ ] **Step 2: Implement `mobile/src/views/SettingsView.vue`**

```vue
<script setup>
import {onMounted} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';

const {isSignedIn, signIn, signOut} = useProgress();
const {time, init, setTime} = useReminder();

onMounted(init);
</script>

<template>
  <section class="settings">
    <h1>Settings</h1>

    <div class="settings__row">
      <button v-if="!isSignedIn" type="button" @click="signIn">
        Sign in with Google
      </button>
      <button v-else type="button" @click="signOut">Sign out</button>
    </div>

    <div class="settings__row">
      <label for="reminder-time">Daily reminder</label>
      <input
        id="reminder-time"
        type="time"
        :value="time"
        @change="setTime($event.target.value)"
      />
    </div>
  </section>
</template>
```

- [ ] **Step 3: Verify manually**

Run: `cd mobile && npm run dev`. Open `/settings`. Expected: "Sign in with Google" button (clicking opens the Google popup flow — sign in with the same Google account used on the web app; button then reads "Sign out"). Change the time input — no error in the console (native scheduling is skipped in the browser since `Capacitor.isNativePlatform()` is `false` there; this is verified for real once Task 8's native build runs on-device).

- [ ] **Step 4: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/views/SettingsView.vue mobile/src/composables/useReminder.js
git commit -m "feat(mobile): Settings screen with sign-in and daily reminder"
```

---

### Task 8: Add Capacitor platforms

**Files:**
- Create: `mobile/capacitor.config.json`

**Interfaces:**
- Produces: `mobile/ios/` and `mobile/android/` native projects (gitignored — regenerated via `npx cap sync`, not committed).

- [ ] **Step 1: Create `mobile/capacitor.config.json`**

```json
{
  "appId": "vn.onmee.dailymastery",
  "appName": "Daily Mastery",
  "webDir": "dist"
}
```

- [ ] **Step 2: Build the web app and add platforms**

Run:
```bash
cd mobile && npm run build-content && npm run build && npx cap add ios && npx cap add android
```
Expected: `npx cap add ios` creates `mobile/ios/App/`; `npx cap add android` creates `mobile/android/`. Both commands print "add ... in ...ms" with no errors.

- [ ] **Step 3: Sync**

Run: `cd mobile && npx cap sync`
Expected: "Sync finished" with `@capacitor/preferences` and `@capacitor/local-notifications` listed as found/updated plugins.

- [ ] **Step 4: Note the native-run limitation**

Running the app on an actual simulator/emulator needs `npx cap run ios` (requires Xcode) or `npx cap run android` (requires Android Studio + SDK). This environment has neither installed, so that step can't be executed here — do it on a machine with Xcode and/or Android Studio installed, after which sign-in, the daily reminder notification, and general on-device layout should be spot-checked manually.

- [ ] **Step 5: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/capacitor.config.json
git commit -m "feat(mobile): add Capacitor iOS and Android platforms"
```

---

## Definition of Done

- `cd mobile && npm run build-content && npm test` passes (content self-check + merge-logic unit tests).
- `cd mobile && npm run dev` serves a working app: Today shows the current lesson and a working complete button; Calendar shows streak + month grouping; Courses lists all topics and links into per-lesson detail; Settings supports Google sign-in and setting a reminder time.
- `cd mobile && npx cap sync` succeeds with no errors, producing `ios/` and `android/` native projects.
- Mic-translate feature (separate plan, per
  `docs/superpowers/specs/2026-08-17-mic-translate-design.md`) can be built
  on top of this scaffold — it needs a new nav tab/route plus an API-key
  field in `SettingsView.vue`.
