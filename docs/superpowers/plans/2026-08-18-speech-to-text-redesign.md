# Speech-to-Text Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Speak feature's unreliable on-device speech recognition with a single Gemini multimodal call that transcribes and translates the recorded audio together.

**Architecture:** Record the full press-and-hold as one audio clip via the Web `MediaRecorder`/`getUserMedia` APIs (no native STT plugin, no session-restart hacks). On release, send the clip directly to Gemini (already used for translation) in one call that returns `{vietnameseText, englishSentence, ipa, explanation}`.

**Tech Stack:** Vue 3 (Composition API, `<script setup>`), Vitest, `@google/genai`, Web `MediaRecorder`/`getUserMedia` APIs. No new dependencies.

## Global Constraints

- All work is scoped to `mobile/` — the web app (`src/site`) is untouched.
- No new npm dependencies — recording uses the Web platform's own `MediaRecorder`/`getUserMedia`, already available in Capacitor's WebView and in the browser dev server.
- Minimum recording duration to accept: 300ms (shorter clips are treated as empty, same as today's "Didn't catch that" path, without spending an API call).
- Existing test file naming/mocking conventions must be followed: `vi.mock()` for module imports, `vi.resetModules()` + dynamic `import()` per test for module-scope singleton composables (see `useSpeechToText.test.js` / `useSpeakSession.test.js` for the established pattern).

---

### Task 1: `useAudioRecorder` composable

**Files:**
- Create: `mobile/src/composables/useAudioRecorder.js`
- Test: `mobile/src/composables/useAudioRecorder.test.js`

**Interfaces:**
- Produces: `useAudioRecorder()` → `{startRecording, stopRecording}`.
  - `startRecording(): Promise<void>` — requests mic access and starts recording. Rejects (propagating the `getUserMedia` rejection, e.g. a `DOMException` with `.name === 'NotAllowedError'` on permission denial) if it can't start.
  - `stopRecording(): Promise<{blob: Blob, mimeType: string} | null>` — stops recording. Returns `null` if the recording was shorter than 300ms or captured no data; otherwise returns the recorded audio.

- [ ] **Step 1: Write the failing test**

Create `mobile/src/composables/useAudioRecorder.test.js`:

```js
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';

// Minimal fake of the browser MediaRecorder — real one isn't available in
// the vitest node environment. Mirrors the event sequence a real
// MediaRecorder fires on stop(): a final 'dataavailable' with the tail
// chunk, then 'stop'.
class FakeMediaRecorder {
  constructor(stream, options) {
    this.stream = stream;
    this.mimeType = options?.mimeType || 'audio/webm';
    this.listeners = {};
  }
  addEventListener(event, cb) {
    (this.listeners[event] ||= []).push(cb);
  }
  start() {}
  stop() {
    this.listeners.dataavailable?.forEach((cb) =>
      cb({data: new Blob(['chunk'], {type: this.mimeType})}),
    );
    this.listeners.stop?.forEach((cb) => cb());
  }
}
FakeMediaRecorder.isTypeSupported = () => true;

const stopTrack = vi.fn();
const getUserMedia = vi.fn(async () => ({
  getTracks: () => [{stop: stopTrack}],
}));

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal('MediaRecorder', FakeMediaRecorder);
  vi.stubGlobal('navigator', {mediaDevices: {getUserMedia}});
  getUserMedia.mockClear();
  stopTrack.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useAudioRecorder', () => {
  it('discards a recording shorter than the minimum duration', async () => {
    const dateSpy = vi.spyOn(Date, 'now');
    dateSpy.mockReturnValueOnce(1000); // startedAt
    dateSpy.mockReturnValueOnce(1100); // stop, 100ms later

    const {useAudioRecorder} = await import('./useAudioRecorder.js');
    const {startRecording, stopRecording} = useAudioRecorder();

    await startRecording();
    const result = await stopRecording();

    expect(result).toBeNull();
    expect(stopTrack).toHaveBeenCalled();
  });

  it('returns the recorded blob and mimeType once past the minimum duration', async () => {
    const dateSpy = vi.spyOn(Date, 'now');
    dateSpy.mockReturnValueOnce(1000); // startedAt
    dateSpy.mockReturnValueOnce(1500); // stop, 500ms later

    const {useAudioRecorder} = await import('./useAudioRecorder.js');
    const {startRecording, stopRecording} = useAudioRecorder();

    await startRecording();
    const result = await stopRecording();

    expect(result.mimeType).toBe('audio/webm;codecs=opus');
    expect(result.blob).toBeInstanceOf(Blob);
  });

  it('lets a racing stopRecording() wait out a still-starting startRecording()', async () => {
    const dateSpy = vi.spyOn(Date, 'now');
    dateSpy.mockReturnValueOnce(1000); // startedAt
    dateSpy.mockReturnValueOnce(1500); // stop, 500ms later

    const {useAudioRecorder} = await import('./useAudioRecorder.js');
    const {startRecording, stopRecording} = useAudioRecorder();

    const startPromise = startRecording(); // not awaited — simulates a fast tap
    const result = await stopRecording();

    await startPromise;
    expect(result.blob).toBeInstanceOf(Blob);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/composables/useAudioRecorder.test.js`
Expected: FAIL — `Failed to resolve import "./useAudioRecorder.js"` (file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `mobile/src/composables/useAudioRecorder.js`:

```js
const MIN_DURATION_MS = 300;
const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];

function pickMimeType() {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return '';
  }
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

let stream = null;
let recorder = null;
let chunks = [];
let startedAt = 0;
let startPromise = null;

async function doStart() {
  stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const mimeType = pickMimeType();
  recorder = mimeType ? new MediaRecorder(stream, {mimeType}) : new MediaRecorder(stream);
  chunks = [];
  recorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });
  startedAt = Date.now();
  recorder.start();
}

export function useAudioRecorder() {
  async function startRecording() {
    startPromise = doStart();
    return startPromise;
  }

  async function stopRecording() {
    // Let a racing start() finish (or fail) before we try to stop it — a
    // very fast tap can call stop() while start() is still mid-flight.
    if (startPromise) {
      await startPromise.catch(() => {});
      startPromise = null;
    }
    if (!recorder) return null;

    const duration = Date.now() - startedAt;
    const activeRecorder = recorder;
    const activeStream = stream;
    recorder = null;
    stream = null;

    return new Promise((resolve) => {
      activeRecorder.addEventListener('stop', () => {
        activeStream.getTracks().forEach((track) => track.stop());
        if (duration < MIN_DURATION_MS || chunks.length === 0) {
          resolve(null);
          return;
        }
        resolve({
          blob: new Blob(chunks, {type: activeRecorder.mimeType}),
          mimeType: activeRecorder.mimeType,
        });
      });
      activeRecorder.stop();
    });
  }

  return {startRecording, stopRecording};
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/composables/useAudioRecorder.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/composables/useAudioRecorder.js src/composables/useAudioRecorder.test.js
git commit -m "feat(mobile): add useAudioRecorder composable"
```

- [ ] **Step 6: Native spike — confirm `MediaRecorder` works in the iOS WebView before continuing**

This is the risk flagged in the design spec: `MediaRecorder` support in Capacitor's iOS WKWebView isn't guaranteed at the same level as a full browser, and the rest of this plan is only worth building on top of it if it works on the target iOS version. Verify now, before Task 2+:

1. Temporarily add a button anywhere already on screen in `src/views/SpeakView.vue` (e.g. next to the mic) that calls `useAudioRecorder()`'s `startRecording()` on click and `stopRecording()` on a second click, logging the result:
   ```js
   import {useAudioRecorder} from '../composables/useAudioRecorder.js';
   const {startRecording, stopRecording} = useAudioRecorder();
   let spikeRecording = false;
   async function spikeToggle() {
     if (!spikeRecording) {
       spikeRecording = true;
       await startRecording();
     } else {
       spikeRecording = false;
       const rec = await stopRecording();
       console.log('SPIKE RESULT', rec?.mimeType, rec?.blob.size);
     }
   }
   ```
   ```html
   <button type="button" @click="spikeToggle">spike</button>
   ```
2. `npx cap sync ios && npx cap run ios` on a real device or simulator running the app's actual target iOS version.
3. Tap the spike button, speak for a couple seconds, tap it again. Check Xcode's console output for the `SPIKE RESULT` log.
4. Expected: a `mimeType` string and a `blob.size` greater than 0. If `MediaRecorder` or `getUserMedia` is unsupported, `startRecording()` rejects instead — check Safari/Xcode console for the error.
5. Revert the temporary button and import from `SpeakView.vue` (`git checkout -- src/views/SpeakView.vue` if no other edits are staged there yet).

**If unsupported:** stop here and re-open the design — Task 1's `useAudioRecorder` internals would need to swap to a native Capacitor audio-recording plugin instead of the Web API path. Tasks 2–6 are unaffected either way (they only depend on `useAudioRecorder`'s public `{startRecording, stopRecording}` interface, not its internals).

---

### Task 2: Gemini transcribe+translate in one call

**Files:**
- Modify: `mobile/src/composables/useGeminiTranslate.js` (full file, 76 lines)
- Modify: `mobile/src/composables/useGeminiTranslate.test.js` (full file, 19 lines)

**Interfaces:**
- Consumes: nothing new (still just `@google/genai`).
- Produces: `transcribeAndTranslate(audioBlob: Blob, mimeType: string, apiKey: string): Promise<{vietnameseText, englishSentence, ipa, explanation}>` — replaces the removed `translateToEnglish(text, apiKey)`. `extractTranslateResult(response)` keeps its existing signature/behavior (still just parses `response.text` as JSON), only the schema of the JSON it parses gains `vietnameseText`.

- [ ] **Step 1: Update the test fixture**

Replace `mobile/src/composables/useGeminiTranslate.test.js` in full:

```js
import {describe, it, expect} from 'vitest';
import {extractTranslateResult} from './useGeminiTranslate.js';

describe('extractTranslateResult', () => {
  it('returns the parsed JSON when text is present', () => {
    const parsed = {
      vietnameseText: 'giày của con đâu rồi',
      englishSentence: 'Where are your shoes?',
      ipa: '/wɛərz jʊər ʃuz/',
      explanation: 'Dùng "where are" vì hỏi vị trí của vật.',
    };
    const response = {text: JSON.stringify(parsed)};
    expect(extractTranslateResult(response)).toEqual(parsed);
  });

  it('throws with the finishReason when text is missing', () => {
    const response = {text: undefined, candidates: [{finishReason: 'SAFETY'}]};
    expect(() => extractTranslateResult(response)).toThrow(/SAFETY/);
  });
});
```

- [ ] **Step 2: Run test to confirm it still passes**

Run: `npx vitest run src/composables/useGeminiTranslate.test.js`
Expected: PASS — `extractTranslateResult` doesn't care which fields are in the JSON, so this is a data-only change that shouldn't need an implementation change yet. Confirms the parser really is field-agnostic before we touch it.

- [ ] **Step 3: Replace the implementation**

Replace `mobile/src/composables/useGeminiTranslate.js` in full:

```js
import {GoogleGenAI} from '@google/genai';

// Cost-sensitive, high-volume tier — swapped in for real-time conversational
// latency after claude-haiku-4-5 was lagging under repeated Speak use.
const MODEL = 'gemini-3.1-flash-lite';

const SYSTEM_PROMPT = `You are helping a Vietnamese parent with limited
English vocabulary say things to their children in natural English. You
will receive a short audio recording of the parent speaking Vietnamese —
the recording may have background noise or be hard to make out in places.
Infer the parent's likely intent charitably (there is nothing grammatically
wrong with the Vietnamese; any oddness is recording noise, not a mistake to
correct in Vietnamese).

Produce:
1. A literal transcription of the Vietnamese audio.
2. A short, natural English sentence a parent would actually say out loud
   to a child in that situation — not a stiff textbook translation.
3. Its IPA phonetic transcription.
4. A short explanation, written in Vietnamese, of any notable word choice
   or phrasing decision — something that helps the parent learn, not just
   a restatement of the sentence.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    vietnameseText: {
      type: 'string',
      description: 'Literal transcription of the Vietnamese audio.',
    },
    englishSentence: {
      type: 'string',
      description:
        'A short, natural spoken English sentence for a parent to say to their child.',
    },
    ipa: {
      type: 'string',
      description:
        'IPA phonetic transcription of englishSentence, e.g. "/wɛərz jʊər ʃuz/".',
    },
    explanation: {
      type: 'string',
      description:
        'Short Vietnamese-language explanation of the translation or phrasing choice.',
    },
  },
  required: ['vietnameseText', 'englishSentence', 'ipa', 'explanation'],
};

/**
 * Pure extraction step, isolated for testing: given a Gemini generateContent
 * response, returns the validated result or throws with the response's
 * finishReason so a caller can show a meaningful error instead of a blank
 * screen.
 */
export function extractTranslateResult(response) {
  if (!response.text) {
    const finishReason = response.candidates?.[0]?.finishReason || 'unknown';
    throw new Error(
      `Gemini did not return a structured translation (finishReason: ${finishReason}).`,
    );
  }
  return JSON.parse(response.text);
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export async function transcribeAndTranslate(audioBlob, mimeType, apiKey) {
  if (!apiKey) {
    throw new Error('No Gemini API key configured.');
  }
  const client = new GoogleGenAI({apiKey});
  const data = arrayBufferToBase64(await audioBlob.arrayBuffer());
  const response = await client.models.generateContent({
    model: MODEL,
    contents: [{role: 'user', parts: [{inlineData: {mimeType, data}}]}],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseJsonSchema: RESPONSE_SCHEMA,
    },
  });
  return extractTranslateResult(response);
}
```

- [ ] **Step 4: Run test to verify it still passes**

Run: `npx vitest run src/composables/useGeminiTranslate.test.js`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/composables/useGeminiTranslate.js src/composables/useGeminiTranslate.test.js
git commit -m "feat(mobile): transcribe and translate in one Gemini call"
```

---

### Task 3: Rewire `useSpeakSession` onto the recorder

**Files:**
- Modify: `mobile/src/composables/useSpeakSession.js` (full file, 132 lines)
- Modify: `mobile/src/composables/useSpeakSession.test.js` (full file, 97 lines)

**Interfaces:**
- Consumes: `useAudioRecorder()` → `{startRecording, stopRecording}` (Task 1); `transcribeAndTranslate(audioBlob, mimeType, apiKey)` (Task 2).
- Produces: `useSpeakSession()` → `{status, errorMessage, lastVietnameseText, result, history, initHistory, handlePressStart, handlePressEnd, retry}`. **`partialText` is removed** from the returned object — Task 4 updates the one consumer (`SpeakView.vue`).

- [ ] **Step 1: Write the failing test**

Replace `mobile/src/composables/useSpeakSession.test.js` in full:

```js
import {describe, it, expect, vi, beforeEach} from 'vitest';

const startRecording = vi.fn(async () => {});
const stopRecording = vi.fn(async () => null);
vi.mock('./useAudioRecorder.js', () => ({
  useAudioRecorder: () => ({startRecording, stopRecording}),
}));

const transcribeAndTranslate = vi.fn(async () => ({
  vietnameseText: 'xin chào',
  englishSentence: 'Where are your shoes?',
  ipa: '/x/',
  explanation: 'vi',
}));
vi.mock('./useGeminiTranslate.js', () => ({transcribeAndTranslate}));

const apiKey = {value: 'test-key'};
const initApiKey = vi.fn(async () => {});
vi.mock('./useApiKey.js', () => ({
  useApiKey: () => ({apiKey, init: initApiKey}),
}));

const addEntry = vi.fn(async () => {});
const initHistory = vi.fn(async () => {});
vi.mock('./useTranslateHistory.js', () => ({
  useTranslateHistory: () => ({history: {value: []}, init: initHistory, addEntry}),
}));

const push = vi.fn();
vi.mock('vue-router', () => ({useRouter: () => ({push})}));

const fakeRecording = {blob: new Blob(['audio']), mimeType: 'audio/webm'};

beforeEach(() => {
  vi.resetModules();
  apiKey.value = 'test-key';
  startRecording.mockClear();
  stopRecording.mockReset().mockResolvedValue(null);
  transcribeAndTranslate.mockClear();
  initApiKey.mockClear();
  addEntry.mockClear();
  initHistory.mockClear();
  push.mockClear();
});

describe('useSpeakSession', () => {
  it('sends the user to Settings instead of recording when no API key is set', async () => {
    apiKey.value = '';
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {handlePressStart, status} = useSpeakSession();

    const started = await handlePressStart();

    expect(started).toBe(false);
    expect(push).toHaveBeenCalledWith({name: 'settings'});
    expect(startRecording).not.toHaveBeenCalled();
    expect(status.value).toBe('idle');
  });

  it('shares recording state across separate useSpeakSession() callers', async () => {
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const fromNav = useSpeakSession();
    const fromSpeakView = useSpeakSession();

    await fromNav.handlePressStart();

    expect(fromSpeakView.status.value).toBe('recording');
  });

  it('shows a retry-able error when nothing was recorded', async () => {
    stopRecording.mockResolvedValue(null);
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {handlePressStart, handlePressEnd, status, errorMessage} = useSpeakSession();

    await handlePressStart();
    await handlePressEnd();

    expect(status.value).toBe('error');
    expect(errorMessage.value).toMatch(/Didn't catch that/);
    expect(transcribeAndTranslate).not.toHaveBeenCalled();
  });

  it('transcribes, translates, and records history on a successful hold', async () => {
    stopRecording.mockResolvedValue(fakeRecording);
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {handlePressStart, handlePressEnd, status, result, lastVietnameseText} =
      useSpeakSession();

    await handlePressStart();
    await handlePressEnd();

    expect(status.value).toBe('result');
    expect(lastVietnameseText.value).toBe('xin chào');
    expect(result.value.englishSentence).toBe('Where are your shoes?');
    expect(addEntry).toHaveBeenCalledWith(
      expect.objectContaining({vietnameseText: 'xin chào'}),
    );
  });

  it('retries with the same audio instead of asking the user to re-record', async () => {
    stopRecording.mockResolvedValue(fakeRecording);
    transcribeAndTranslate.mockRejectedValueOnce(new Error('network down'));
    const {useSpeakSession} = await import('./useSpeakSession.js');
    const {handlePressStart, handlePressEnd, retry, status, result} = useSpeakSession();

    await handlePressStart();
    await handlePressEnd();
    expect(status.value).toBe('error');

    await retry();

    expect(status.value).toBe('result');
    expect(result.value.englishSentence).toBe('Where are your shoes?');
    expect(transcribeAndTranslate).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/composables/useSpeakSession.test.js`
Expected: FAIL — `useSpeakSession.js` still imports `./useSpeechToText.js` and `translateToEnglish`, neither of which the new mocks provide, so several assertions fail (e.g. `startRecording`/`transcribeAndTranslate` never called).

- [ ] **Step 3: Replace the implementation**

Replace `mobile/src/composables/useSpeakSession.js` in full:

```js
// Shared recording/translate state — lifted out of SpeakView.vue so a
// long-press on the bottom-nav Speak icon (BottomNav.vue) can drive the
// same session from any screen, and SpeakView.vue picks up wherever it
// left off when it mounts (a fresh instance, since navigation happens
// after the press ends).
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useAudioRecorder} from './useAudioRecorder.js';
import {transcribeAndTranslate} from './useGeminiTranslate.js';
import {useApiKey} from './useApiKey.js';
import {useTranslateHistory} from './useTranslateHistory.js';

const status = ref('idle'); // idle | recording | translating | result | error
const errorMessage = ref('');
const lastVietnameseText = ref('');
const result = ref(null); // {englishSentence, ipa, explanation}

const {startRecording, stopRecording} = useAudioRecorder();

let lastAudioBlob = null;
let lastAudioMimeType = '';

async function runTranslate(deps) {
  try {
    const translated = await transcribeAndTranslate(
      lastAudioBlob,
      lastAudioMimeType,
      deps.apiKey.value,
    );
    lastVietnameseText.value = translated.vietnameseText;
    result.value = {
      englishSentence: translated.englishSentence,
      ipa: translated.ipa,
      explanation: translated.explanation,
    };
    status.value = 'result';
    await deps.addEntry({
      vietnameseText: translated.vietnameseText,
      englishSentence: translated.englishSentence,
      ipa: translated.ipa,
      explanation: translated.explanation,
    });
  } catch (err) {
    status.value = 'error';
    errorMessage.value = err.message || 'Translation failed. Please try again.';
  }
}

async function handlePressEnd(deps) {
  if (status.value !== 'recording') return;
  let recording = null;
  try {
    recording = await stopRecording();
  } catch (err) {
    status.value = 'error';
    errorMessage.value = err.message || 'Could not stop recording. Please try again.';
    return;
  }
  if (!recording) {
    lastVietnameseText.value = '';
    status.value = 'error';
    errorMessage.value = "Didn't catch that — try again.";
    return;
  }

  lastAudioBlob = recording.blob;
  lastAudioMimeType = recording.mimeType;
  status.value = 'translating';
  await deps.initHistory();
  await runTranslate(deps);
}

export function useSpeakSession() {
  const router = useRouter();
  const {apiKey, init: initApiKey} = useApiKey();
  const {history, init: initHistory, addEntry} = useTranslateHistory();
  const deps = {apiKey, initHistory, addEntry};

  async function handlePressStart() {
    await initApiKey();
    if (!apiKey.value) {
      router.push({name: 'settings'});
      return false;
    }
    errorMessage.value = '';
    result.value = null;
    lastVietnameseText.value = '';
    status.value = 'recording';
    try {
      await startRecording();
    } catch (err) {
      status.value = 'error';
      // getUserMedia rejects with a DOMException — NotAllowedError means the
      // user (or OS) denied mic access; anything else (no device, dev-server
      // quirks, ...) gets its own message instead of misdiagnosing as a
      // permission problem.
      errorMessage.value =
        err.name === 'NotAllowedError'
          ? 'Microphone access is needed for this feature. Please allow it and try again.'
          : err.message || 'Could not start recording. Please try again.';
    }
    return true;
  }

  function retry() {
    if (lastAudioBlob) {
      status.value = 'translating';
      errorMessage.value = '';
      return runTranslate(deps);
    }
    status.value = 'idle';
    errorMessage.value = '';
    return undefined;
  }

  return {
    status,
    errorMessage,
    lastVietnameseText,
    result,
    history,
    initHistory,
    handlePressStart,
    handlePressEnd: () => handlePressEnd(deps),
    retry,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/composables/useSpeakSession.test.js`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/composables/useSpeakSession.js src/composables/useSpeakSession.test.js
git commit -m "feat(mobile): rewire useSpeakSession onto useAudioRecorder"
```

---

### Task 4: Update `SpeakView.vue`

**Files:**
- Modify: `mobile/src/views/SpeakView.vue:1-33` (script) and `:35-59` (transcript template block) and `:268-271` (dead CSS)

**Interfaces:**
- Consumes: `useSpeakSession()`'s new return shape from Task 3 (no `partialText`).

- [ ] **Step 1: Update the script block**

In `mobile/src/views/SpeakView.vue`, replace lines 1–33:

```html
<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {useSpeakSession} from '../composables/useSpeakSession.js';

const {
  status,
  errorMessage,
  lastVietnameseText,
  result,
  history,
  initHistory,
  handlePressStart,
  handlePressEnd,
  retry,
} = useSpeakSession();

const showHistory = ref(false);

onMounted(initHistory);

// Leaving the screen mid-recording (bottom nav, back gesture) would otherwise
// leave the mic recording with nothing to ever stop it. Treat it like
// releasing the mic button: finish the turn (stop, transcribe, translate,
// save) in the shared session so the result is there if the user comes back.
onUnmounted(() => {
  if (status.value === 'recording') handlePressEnd();
});
</script>
```

- [ ] **Step 2: Update the transcript template block**

Replace the `<Transition name="speak-fade" ...>` block (originally lines 46–59):

```html
      <Transition name="speak-fade" mode="out-in">
        <p
          v-if="lastVietnameseText"
          key="held"
          class="speak__transcript"
          aria-live="polite"
        >
          {{ lastVietnameseText }}
        </p>
        <p v-else class="speak__transcript speak__transcript--placeholder">
          We'll show what you said once you let go of the mic.
        </p>
      </Transition>
```

- [ ] **Step 3: Remove the now-dead `--live` transcript style**

Delete this rule (originally lines 268–271):

```css
.speak__transcript--live {
  background: var(--color-accent-2-tint);
  box-shadow: inset 0 0 0 1.5px color-mix(in oklab, var(--color-accent-2) 35%, transparent);
}
```

- [ ] **Step 4: Manual smoke check**

Run: `npm run dev`, open the Speak tab in the browser, hold the mic button, allow mic access when prompted, speak, release.
Expected: transcript box shows a placeholder while recording, "Listening…" label and mic-bar animation play during the hold, and (once a Gemini API key is set in Settings) the Vietnamese transcript + English result appear after release. No console errors about `partialText` or `useSpeechToText`.

- [ ] **Step 5: Commit**

```bash
git add src/views/SpeakView.vue
git commit -m "feat(mobile): drop live transcript display from SpeakView"
```

---

### Task 5: Remove the old STT plugin and composable

**Files:**
- Delete: `mobile/src/composables/useSpeechToText.js`
- Delete: `mobile/src/composables/useSpeechToText.test.js`
- Modify: `mobile/package.json`, `mobile/package-lock.json` (via `npm uninstall`)

**Interfaces:** none — nothing outside these files references `useSpeechToText` after Task 3.

- [ ] **Step 1: Confirm nothing else references the old composable**

Run: `grep -rn "useSpeechToText" src`
Expected: no output (empty) — Task 3 already removed the only import.

- [ ] **Step 2: Delete the files**

```bash
git rm src/composables/useSpeechToText.js src/composables/useSpeechToText.test.js
```

- [ ] **Step 3: Remove the native plugin dependency**

```bash
npm uninstall @capacitor-community/speech-recognition
```

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: PASS, all suites — no test references the removed files.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(mobile): remove on-device speech-recognition plugin"
```

---

### Task 6: Update native setup docs

**Files:**
- Modify: `mobile/README.md`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Replace the iOS/Android permission checklist steps**

In `mobile/README.md`, replace step 8 and the sentence before step 9 (originally):

```markdown
8. **iOS only:** the Speak tab's speech recognition needs two usage strings in
   `Info.plist` — add them the same way as the URL scheme in step 6 (Xcode →
   `App` target → **Info** tab, or by editing `Info.plist` directly):
   - `NSSpeechRecognitionUsageDescription` — e.g. "Used to transcribe what you
     say for the Speak translation feature."
   - `NSMicrophoneUsageDescription` — e.g. "Used to record your voice for the
     Speak translation feature."

   iOS kills the app on the first speech-recognition call if either is
   missing. Android needs nothing here: the plugin ships its own
   `RECORD_AUDIO` permission and Android 11+ `<queries>` entry, merged in
   automatically.
9. Re-run `npx cap sync`.
```

with:

```markdown
8. **iOS only:** the Speak tab's audio recording needs a usage string in
   `Info.plist` — add it the same way as the URL scheme in step 6 (Xcode →
   `App` target → **Info** tab, or by editing `Info.plist` directly):
   - `NSMicrophoneUsageDescription` — e.g. "Used to record your voice for the
     Speak translation feature."

   iOS kills the app on the first microphone-recording call if this is
   missing.
9. **Android only:** open `mobile/android/app/src/main/AndroidManifest.xml`
   and add, as a direct child of `<manifest>`:
   ```xml
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   ```
   The Speak tab records audio directly via the browser's `getUserMedia`
   API now (no plugin auto-merging this permission) — without it,
   `getUserMedia()` rejects on Android the moment recording starts.
10. Re-run `npx cap sync`.
```

- [ ] **Step 2: Update the dev-server capability note**

Replace this paragraph (originally near the end of the file):

```markdown
The Speak tab does not: `@capacitor-community/speech-recognition` has no web
implementation, so every call throws `Method not implemented on web.` in
`npm run dev`. On-device speech recognition can only be tested in a native
build.
```

with:

```markdown
The Speak tab also works in `npm run dev`: it records audio with the
standard `MediaRecorder`/`getUserMedia` Web APIs (no native plugin), so the
browser will prompt for mic access the same way it would for any other site.
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs(mobile): update native setup for audio recording, not speech-recognition"
```
