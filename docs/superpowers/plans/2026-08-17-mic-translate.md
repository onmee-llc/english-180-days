# Mic Translate Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hold-to-record mic screen to the Daily Mastery mobile app that turns a spoken Vietnamese sentence into a natural English sentence with IPA phonetics and a short Vietnamese explanation, using on-device speech recognition and the Claude API.

**Architecture:** A new 5th tab/screen (`SpeakView.vue`) in the existing `mobile/` app. On-device Vietnamese speech-to-text via `@capacitor-community/speech-recognition`. The transcribed text is sent to Claude (`claude-haiku-4-5`, chosen for real-time conversational latency) via the official `@anthropic-ai/sdk`, using structured outputs (`output_config.format`) so the response shape is guaranteed by the API rather than hand-parsed from free text. The user's own Claude API key is entered once in Settings and stored via `capacitor-secure-storage-plugin`. Each successful lookup is appended to a local phrasebook history stored via `@capacitor/preferences` (already a dependency).

**Tech Stack:** `@capacitor-community/speech-recognition@6.0.1` (pinned for Capacitor 6), `capacitor-secure-storage-plugin@0.10.0` (pinned for Capacitor 6), `@anthropic-ai/sdk` (latest, browser-mode via `dangerouslyAllowBrowser: true` — works both in the Vite dev server and inside the native WebView via Capacitor's `CapacitorHttp` interception), `zod` (peer dependency of the SDK's structured-output helper).

## Global Constraints

- Model is `claude-haiku-4-5` — the user explicitly chose it for latency over `claude-opus-5` (the claude-api skill's default). Do not "upgrade" this without asking.
- No text-to-speech in v1 (explicitly out of scope per spec).
- No cloud STT — on-device only, via the plugin above.
- Feature is mobile-app-only, not on the web site.
- History is local-only (`@capacitor/preferences`), never synced to Firestore — it is not learning-progress data.
- Package versions above are pinned to what's compatible with this app's Capacitor 6 install — do not let `npm install` pull latest majors (which require Capacitor 7+) without deliberately upgrading Capacitor first.
- Automated tests only for pure/branching logic (this plan has exactly one such unit: the Claude response extractor). Everything else is manually verified, consistent with the rest of this app.
- The actual mic → STT → Claude → result flow can only be verified end-to-end on a real device (same limitation as the rest of this app — no Xcode/Android Studio in the current dev environment). Build success + code-path tracing is the available verification here.

---

### Task 1: API key setting (Secure Storage)

**Files:**
- Create: `mobile/src/composables/useApiKey.js`
- Modify: `mobile/src/views/SettingsView.vue`

**Interfaces:**
- Produces: `useApiKey()` exposing `{apiKey, isLoaded, init(), setApiKey(newKey)}`. Later tasks (`useClaudeTranslate.js`, `SpeakView.vue`) read `apiKey.value` to call Claude.

- [ ] **Step 1: Install the secure storage plugin at the Capacitor-6-compatible version**

Run: `cd mobile && npm install capacitor-secure-storage-plugin@0.10.0`

- [ ] **Step 2: Create `mobile/src/composables/useApiKey.js`**

```js
// mobile/src/composables/useApiKey.js
import {ref} from 'vue';
import {SecureStoragePlugin} from 'capacitor-secure-storage-plugin';

const API_KEY_STORAGE_KEY = 'dm_claude_api_key';

const apiKey = ref('');
const isLoaded = ref(false);

export function useApiKey() {
  async function init() {
    if (isLoaded.value) return;
    try {
      const {value} = await SecureStoragePlugin.get({key: API_KEY_STORAGE_KEY});
      apiKey.value = value;
    } catch (_) {
      // Plugin throws when the key doesn't exist yet — first run.
      apiKey.value = '';
    }
    isLoaded.value = true;
  }

  async function setApiKey(newKey) {
    apiKey.value = newKey;
    if (newKey) {
      await SecureStoragePlugin.set({key: API_KEY_STORAGE_KEY, value: newKey});
    } else {
      await SecureStoragePlugin.remove({key: API_KEY_STORAGE_KEY}).catch(() => {});
    }
  }

  return {apiKey, isLoaded, init, setApiKey};
}
```

- [ ] **Step 3: Add an API key field to `mobile/src/views/SettingsView.vue`**

Modify the `<script setup>` block to import and use the composable, and add a row to the template. Read the current file first (it has sign-in and reminder-time rows from earlier tasks) and add, without disturbing the existing rows:

```vue
<script setup>
import {onMounted, ref} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';
import {useApiKey} from '../composables/useApiKey.js';

const {isSignedIn, authError, signIn, signOut} = useProgress();
const {time, init: initReminder, setTime} = useReminder();
const {apiKey, init: initApiKey, setApiKey} = useApiKey();

const signInError = ref('');
const apiKeyDraft = ref('');
const apiKeySaved = ref(false);

async function handleSignIn() {
  signInError.value = '';
  try {
    await signIn();
  } catch (err) {
    signInError.value = 'Sign-in was cancelled or failed. Please try again.';
  }
}

async function saveApiKey() {
  await setApiKey(apiKeyDraft.value.trim());
  apiKeySaved.value = true;
  setTimeout(() => (apiKeySaved.value = false), 2000);
}

onMounted(async () => {
  initReminder();
  await initApiKey();
  apiKeyDraft.value = apiKey.value;
});
</script>
```

Add this row to the `<template>`, after the existing reminder-time row and before the closing `</section>`:

```vue
    <div class="settings__row">
      <label for="claude-api-key">Claude API key</label>
      <input
        id="claude-api-key"
        type="password"
        v-model="apiKeyDraft"
        placeholder="sk-ant-..."
        autocomplete="off"
      />
      <button type="button" @click="saveApiKey">Save</button>
      <span v-if="apiKeySaved" class="settings__saved">Saved</span>
      <p class="settings__hint">
        Used by the Speak tab to translate and explain sentences. Stored only
        on this device.
      </p>
    </div>
```

Add to the `<style scoped>` block:

```css
.settings__saved {
  color: #2ecc71;
  font-size: 0.85rem;
  margin-left: 0.5rem;
}
.settings__hint {
  color: #999;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
```

- [ ] **Step 4: Verify**

Run: `cd mobile && npm run build`
Expected: succeeds. Trace: `onMounted` now calls both `initReminder()` and `await initApiKey()` — confirm this doesn't change the existing sign-in/reminder behavior (it's additive), and that `apiKeyDraft` is seeded from the loaded key so re-opening Settings shows the previously-saved key (masked, since the input is `type="password"`).

- [ ] **Step 5: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/composables/useApiKey.js mobile/src/views/SettingsView.vue mobile/package.json mobile/package-lock.json
git commit -m "feat(mobile): store Claude API key via secure storage"
```

---

### Task 2: Claude translate client with structured outputs

**Files:**
- Create: `mobile/src/composables/useClaudeTranslate.js`
- Create: `mobile/src/composables/useClaudeTranslate.test.js`

**Interfaces:**
- Consumes: `@anthropic-ai/sdk`, `zod`.
- Produces: `translateToEnglish(vietnameseText, apiKey)` → `Promise<{englishSentence, ipa, explanation}>`, throws on failure (missing/invalid key, network error, or Claude declining to produce structured output). `extractTranslateResult(response)` is the pure, exported, unit-tested piece.

- [ ] **Step 1: Install dependencies**

Run: `cd mobile && npm install @anthropic-ai/sdk zod`

- [ ] **Step 2: Write the failing test**

```js
// mobile/src/composables/useClaudeTranslate.test.js
import {describe, it, expect} from 'vitest';
import {extractTranslateResult} from './useClaudeTranslate.js';

describe('extractTranslateResult', () => {
  it('returns parsed_output when present', () => {
    const response = {
      stop_reason: 'end_turn',
      parsed_output: {
        englishSentence: 'Where are your shoes?',
        ipa: '/wɛərz jʊər ʃuz/',
        explanation: 'Dùng "where are" vì hỏi vị trí của vật.',
      },
    };
    expect(extractTranslateResult(response)).toEqual(response.parsed_output);
  });

  it('throws with the stop_reason when parsed_output is missing', () => {
    const response = {stop_reason: 'refusal', parsed_output: null};
    expect(() => extractTranslateResult(response)).toThrow(/refusal/);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd mobile && npx vitest run src/composables/useClaudeTranslate.test.js`
Expected: FAIL — `Cannot find module './useClaudeTranslate.js'`.

- [ ] **Step 4: Write the implementation**

```js
// mobile/src/composables/useClaudeTranslate.js
import Anthropic from '@anthropic-ai/sdk';
import {z} from 'zod';
import {zodOutputFormat} from '@anthropic-ai/sdk/helpers/zod';

// Chosen for real-time conversational latency (user's explicit choice —
// see the plan's Global Constraints — over the claude-api skill's
// claude-opus-5 default).
const MODEL = 'claude-haiku-4-5';

const SYSTEM_PROMPT = `You are helping a Vietnamese parent with limited
English vocabulary say things to their children in natural English. You
will receive a Vietnamese sentence — possibly a rough speech-to-text
transcription that may contain minor recognition errors. Infer the
parent's likely intent charitably (there is nothing grammatically wrong
with the Vietnamese; any oddness is transcription noise, not a mistake to
correct in Vietnamese).

Produce:
1. A short, natural English sentence a parent would actually say out loud
   to a child in that situation — not a stiff textbook translation.
2. Its IPA phonetic transcription.
3. A short explanation, written in Vietnamese, of any notable word choice
   or phrasing decision — something that helps the parent learn, not just
   a restatement of the sentence.`;

const TranslateResultSchema = z.object({
  englishSentence: z
    .string()
    .describe(
      'A short, natural spoken English sentence for a parent to say to their child.',
    ),
  ipa: z
    .string()
    .describe(
      'IPA phonetic transcription of englishSentence, e.g. "/wɛərz jʊər ʃuz/".',
    ),
  explanation: z
    .string()
    .describe(
      'Short Vietnamese-language explanation of the translation or phrasing choice.',
    ),
});

/**
 * Pure extraction step, isolated for testing: given a Claude API response
 * from messages.parse(), returns the validated result or throws with the
 * response's stop_reason so a caller can show a meaningful error instead
 * of a blank screen.
 */
export function extractTranslateResult(response) {
  if (!response.parsed_output) {
    throw new Error(
      `Claude did not return a structured translation (stop_reason: ${response.stop_reason}).`,
    );
  }
  return response.parsed_output;
}

export async function translateToEnglish(vietnameseText, apiKey) {
  if (!apiKey) {
    throw new Error('No Claude API key configured.');
  }
  const client = new Anthropic({apiKey, dangerouslyAllowBrowser: true});
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{role: 'user', content: vietnameseText}],
    output_config: {format: zodOutputFormat(TranslateResultSchema)},
  });
  return extractTranslateResult(response);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd mobile && npx vitest run src/composables/useClaudeTranslate.test.js`
Expected: PASS (2 tests).

- [ ] **Step 6: Verify the whole build still compiles**

Run: `cd mobile && npm run build`
Expected: succeeds — confirms `@anthropic-ai/sdk`/`zod` import correctly under Vite.

- [ ] **Step 7: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/composables/useClaudeTranslate.js mobile/src/composables/useClaudeTranslate.test.js mobile/package.json mobile/package-lock.json
git commit -m "feat(mobile): Claude translate client with structured outputs"
```

---

### Task 3: Speech-to-text composable

**Files:**
- Create: `mobile/src/composables/useSpeechToText.js`

**Interfaces:**
- Consumes: `@capacitor-community/speech-recognition`.
- Produces: `useSpeechToText()` exposing `{isListening, partialText, startListening(), stopListening()}`. `startListening()` throws if permission is denied. `stopListening()` returns the final transcribed string (the last partial result — this plugin has no separate "final" result distinct from the last partial).

- [ ] **Step 1: Install the plugin at the Capacitor-6-compatible version**

Run: `cd mobile && npm install @capacitor-community/speech-recognition@6.0.1`

- [ ] **Step 2: Create `mobile/src/composables/useSpeechToText.js`**

```js
// mobile/src/composables/useSpeechToText.js
import {ref} from 'vue';
import {SpeechRecognition} from '@capacitor-community/speech-recognition';

const isListening = ref(false);
const partialText = ref('');

export function useSpeechToText() {
  let partialListenerHandle = null;

  async function startListening() {
    partialText.value = '';

    const status = await SpeechRecognition.checkPermissions();
    if (status.speechRecognition !== 'granted') {
      const requested = await SpeechRecognition.requestPermissions();
      if (requested.speechRecognition !== 'granted') {
        throw new Error('Microphone permission was not granted.');
      }
    }

    partialListenerHandle = await SpeechRecognition.addListener(
      'partialResults',
      (data) => {
        partialText.value = data.matches?.[0] || partialText.value;
      },
    );

    isListening.value = true;
    // partialResults:true means start() resolves immediately without a
    // final result — the transcript arrives via the listener above, and
    // whatever it last set is treated as final when stopListening() runs.
    await SpeechRecognition.start({
      language: 'vi-VN',
      partialResults: true,
      popup: false,
    });
  }

  async function stopListening() {
    await SpeechRecognition.stop();
    if (partialListenerHandle) {
      await partialListenerHandle.remove();
      partialListenerHandle = null;
    }
    isListening.value = false;
    return partialText.value;
  }

  return {isListening, partialText, startListening, stopListening};
}
```

- [ ] **Step 3: Verify**

Run: `cd mobile && npm run build`
Expected: succeeds. Trace: `startListening()` guards on permission status before calling `start()`; `stopListening()` always cleans up the listener even if `partialText` ended up empty (e.g. the user held and released without speaking) — confirm the calling code (Task 5) treats an empty return as the "didn't catch that" case from the spec, not a crash.

- [ ] **Step 4: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/composables/useSpeechToText.js mobile/package.json mobile/package-lock.json
git commit -m "feat(mobile): on-device Vietnamese speech-to-text composable"
```

---

### Task 4: Translate history composable

**Files:**
- Create: `mobile/src/composables/useTranslateHistory.js`

**Interfaces:**
- Consumes: `@capacitor/preferences` (already a dependency).
- Produces: `useTranslateHistory()` exposing `{history, init(), addEntry(entry)}`. `history` is a reactive array, newest first.

- [ ] **Step 1: Create `mobile/src/composables/useTranslateHistory.js`**

```js
// mobile/src/composables/useTranslateHistory.js
import {ref} from 'vue';
import {Preferences} from '@capacitor/preferences';

const HISTORY_KEY = 'dm_translate_history';

const history = ref([]);
let isLoaded = false;

async function persist() {
  await Preferences.set({
    key: HISTORY_KEY,
    value: JSON.stringify(history.value),
  });
}

export function useTranslateHistory() {
  async function init() {
    if (isLoaded) return;
    const {value} = await Preferences.get({key: HISTORY_KEY});
    try {
      history.value = value ? JSON.parse(value) : [];
    } catch (_) {
      history.value = [];
    }
    isLoaded = true;
  }

  /**
   * @param {{vietnameseText: string, englishSentence: string, ipa: string, explanation: string}} entry
   */
  async function addEntry(entry) {
    history.value = [
      {...entry, timestamp: new Date().toISOString()},
      ...history.value,
    ];
    await persist();
  }

  return {history, init, addEntry};
}
```

- [ ] **Step 2: Verify**

Run: `cd mobile && npm run build`
Expected: succeeds. No automated test — this is a thin, direct wrapper around `Preferences.get`/`.set` with no branching logic beyond a JSON try/catch already covered by the same pattern proven in `useProgress.js`.

- [ ] **Step 3: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/composables/useTranslateHistory.js
git commit -m "feat(mobile): local translate history composable"
```

---

### Task 5: Speak screen (hold-to-record UI)

**Files:**
- Create: `mobile/src/views/SpeakView.vue`

**Interfaces:**
- Consumes: `useSpeechToText()` (Task 3), `translateToEnglish()` (Task 2), `useApiKey()` (Task 1), `useTranslateHistory()` (Task 4), `vue-router`.

This is the main visual surface of this feature and the user asked for the best UI/UX you can do for a personal app. **Before writing the final template/styles, invoke the `hallmark` or `taste-skill` skill** to drive layout, motion, and visual polish for the hold-to-record interaction (recording state feedback, result card, history list) — don't ship the plain structural markup below as the final design; use it as the functional/wiring baseline the design pass builds on.

- [ ] **Step 1: Implement the functional baseline**

```vue
<!-- mobile/src/views/SpeakView.vue -->
<script setup>
import {ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useSpeechToText} from '../composables/useSpeechToText.js';
import {translateToEnglish} from '../composables/useClaudeTranslate.js';
import {useApiKey} from '../composables/useApiKey.js';
import {useTranslateHistory} from '../composables/useTranslateHistory.js';

const router = useRouter();
const {isListening, partialText, startListening, stopListening} =
  useSpeechToText();
const {apiKey, init: initApiKey} = useApiKey();
const {history, init: initHistory, addEntry} = useTranslateHistory();

const status = ref('idle'); // idle | recording | translating | result | error
const errorMessage = ref('');
const lastVietnameseText = ref('');
const result = ref(null); // {englishSentence, ipa, explanation}
const showHistory = ref(false);

onMounted(async () => {
  await initApiKey();
  await initHistory();
});

async function handlePressStart() {
  if (!apiKey.value) {
    router.push({name: 'settings'});
    return;
  }
  errorMessage.value = '';
  result.value = null;
  status.value = 'recording';
  try {
    await startListening();
  } catch (err) {
    status.value = 'error';
    errorMessage.value =
      'Microphone access is needed for this feature. Please allow it and try again.';
  }
}

async function handlePressEnd() {
  if (status.value !== 'recording') return;
  const text = await stopListening();
  if (!text.trim()) {
    status.value = 'idle';
    errorMessage.value = "Didn't catch that — try again.";
    return;
  }

  lastVietnameseText.value = text;
  status.value = 'translating';
  await runTranslate(text);
}

async function runTranslate(text) {
  try {
    const translated = await translateToEnglish(text, apiKey.value);
    result.value = translated;
    status.value = 'result';
    await addEntry({vietnameseText: text, ...translated});
  } catch (err) {
    status.value = 'error';
    errorMessage.value = err.message || 'Translation failed. Please try again.';
  }
}

function retry() {
  if (lastVietnameseText.value) {
    status.value = 'translating';
    errorMessage.value = '';
    runTranslate(lastVietnameseText.value);
  } else {
    status.value = 'idle';
    errorMessage.value = '';
  }
}

const displayText = computed(() =>
  status.value === 'recording' ? partialText.value : lastVietnameseText.value,
);
</script>

<template>
  <section class="speak">
    <h1>Speak</h1>

    <p v-if="displayText" class="speak__transcript">{{ displayText }}</p>

    <button
      type="button"
      class="speak__mic"
      :class="{'speak__mic--recording': status === 'recording'}"
      @mousedown="handlePressStart"
      @mouseup="handlePressEnd"
      @mouseleave="status === 'recording' && handlePressEnd()"
      @touchstart.prevent="handlePressStart"
      @touchend.prevent="handlePressEnd"
    >
      {{ status === 'recording' ? 'Listening…' : 'Hold to speak' }}
    </button>

    <p v-if="status === 'translating'">Translating…</p>

    <div v-if="status === 'error'" class="speak__error">
      <p>{{ errorMessage }}</p>
      <button v-if="lastVietnameseText" type="button" @click="retry">
        Retry
      </button>
    </div>

    <div v-if="status === 'result' && result" class="speak__result">
      <p class="speak__english">{{ result.englishSentence }}</p>
      <p class="speak__ipa">{{ result.ipa }}</p>
      <p class="speak__explanation">{{ result.explanation }}</p>
    </div>

    <button type="button" @click="showHistory = !showHistory">
      {{ showHistory ? 'Hide history' : 'Show history' }} ({{ history.length }})
    </button>

    <ul v-if="showHistory" class="speak__history">
      <li v-for="(entry, i) in history" :key="i">
        <strong>{{ entry.vietnameseText }}</strong>
        <span> → {{ entry.englishSentence }} ({{ entry.ipa }})</span>
      </li>
    </ul>
  </section>
</template>
```

- [ ] **Step 2: Design pass**

Invoke `hallmark` or `taste-skill` for the actual visual design of this screen (colors, spacing, the recording-state animation on the mic button, result card styling, history list styling) — replace/extend the plain structural template and add a `<style scoped>` block. Keep all the `<script setup>` logic from Step 1 unchanged; this step is presentation only.

- [ ] **Step 3: Verify**

Run: `cd mobile && npm run build`
Expected: succeeds. Trace through the state machine once more after the design pass: `idle → recording → translating → result`, with `error` reachable from both the permission failure in `handlePressStart` and the translate failure in `runTranslate`, and `retry()` only usable when `lastVietnameseText` is set (matches the spec's "keep the already-transcribed text visible and offer a retry button" requirement).

- [ ] **Step 4: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/views/SpeakView.vue
git commit -m "feat(mobile): Speak screen with hold-to-record translate flow"
```

---

### Task 6: Router and bottom nav wiring

**Files:**
- Modify: `mobile/src/router.js`
- Modify: `mobile/src/components/BottomNav.vue`

**Interfaces:**
- Produces: route `/speak` (name `speak`), reachable from the bottom nav's 5th tab.

- [ ] **Step 1: Add the route**

Modify `mobile/src/router.js` — add the import and a new route entry alongside the existing 5 (today/calendar/courses/settings/lesson):

```js
import SpeakView from './views/SpeakView.vue';
```

```js
    {path: '/speak', name: 'speak', component: SpeakView},
```

- [ ] **Step 2: Add the nav tab**

Modify `mobile/src/components/BottomNav.vue` — add one more `router-link` alongside the existing 4, keeping the same structure:

```vue
    <router-link to="/speak">Speak</router-link>
```

- [ ] **Step 3: Verify**

Run: `cd mobile && npm run build-content && npm run build`
Expected: succeeds. Trace: confirm all 4 existing routes and the `lesson` detail route from the mobile-app plan are unchanged — this task only adds one route and one nav link.

- [ ] **Step 4: Commit**

```bash
cd /Users/hoangminh.ho/Works/goal/daily-mastery
git add mobile/src/router.js mobile/src/components/BottomNav.vue
git commit -m "feat(mobile): wire Speak screen into router and bottom nav"
```

---

## Definition of Done

- `cd mobile && npx vitest run` passes, including the new `useClaudeTranslate.test.js`.
- `cd mobile && npm run build-content && npm run build` succeeds.
- Settings has a working API key field (masked input, save, persisted via secure storage).
- The bottom nav has a 5th "Speak" tab reachable at `/speak`, with a hold-to-record button, live partial transcript, a translated result (English + IPA + Vietnamese explanation), error/retry handling per the spec, and a viewable local history list.
- Required manual follow-up before this works on a real device (document in `mobile/README.md` alongside the existing Google Sign-In follow-up from the mobile-app plan): iOS needs `NSSpeechRecognitionUsageDescription` and `NSMicrophoneUsageDescription` added to `Info.plist` (same "re-add after every `cap add ios`" caveat as the existing URL-scheme entry) — the speech-recognition plugin will not prompt for permission without them.
