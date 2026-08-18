# Speech-to-Text Redesign — Design

Supersedes the "Speech-to-text" and "Data flow" sections of
`2026-08-17-mic-translate-design.md`. Everything else in that spec (goals,
history, API-key storage, Settings gating) still applies unchanged.

## Context

The Speak feature (`mobile/`) ships and works, but on-device speech
recognition (`@capacitor-community/speech-recognition`) is unreliable in
practice: intermittent "try again" failures. Git history shows 10 straight
fix commits chasing races in this one file (tap-before-start races,
leave-screen-mid-recording, and — the core issue — Android's on-device
recognizer silently ending its session on its own VAD (voice-activity
detection) mid-hold, requiring the app to detect that and restart
transparently). That restart dance is the recurring source of dropped
transcripts.

The user also asked whether the app's framework can support future feature
growth with good performance/low memory, and confirmed this session should
scope to the mobile app only (the web app in `src/site` is out of scope —
left as-is, not maintained further).

## Architecture assessment

Vue 3 + Vite + Capacitor, with module-scope-singleton composables as the
state pattern (no Vuex/Pinia): appropriate for this app's size (~3,200 lines)
and stays appropriate as features are added — it's lazy-loaded per route
already, has no heavy state-management overhead, and the composable pattern
scales by adding more small, independent files rather than growing a shared
store. **No framework change needed.** The reliability problem is isolated
to how STT is implemented, not the app architecture.

## Problem

On-device STT forces the app to own speech-session lifecycle management
(VAD-restart, silence detection, listener cleanup) that the native plugin
doesn't handle reliably. This is inherent to the on-device-continuous-session
approach, not a bug fixable with more patching — confirmed by the fix-commit
history.

## Approaches considered

- **A — record-then-transcribe via Gemini (chosen).** Record the full
  press-and-hold as one audio clip (Web `MediaRecorder`, no on-device
  recognizer). On release, send the audio directly to Gemini
  (`@google/genai`, already a dependency for translation) in one multimodal
  call that returns transcript + translation + IPA + explanation together.
  Eliminates the on-device session entirely, so eliminates the whole class of
  session-lifecycle bugs.
- **B — keep patching the on-device plugin.** Rejected: the fix-commit
  history shows this is whack-a-mole against a fragile foundation, and
  doesn't help future voice features reuse a solid pattern.
- **C — dedicated cloud streaming STT (e.g. Google Cloud Speech-to-Text) via
  a backend proxy, keeping the translate step separate.** Rejected: needs new
  backend infrastructure just to preserve live-partial-transcript display,
  and the user confirmed live partial text isn't required. Over-engineered
  for the actual requirement.

## Non-goal change from the original spec

The original spec's non-goal "no cloud STT ... to stay free and offline for
the transcription step" is explicitly reversed: transcription now goes
through Gemini alongside translation, in the same call. Audio leaves the
device (as text already did for the translation step); there is no offline
mode for this feature going forward.

## Design

### Components

- **New `mobile/src/composables/useAudioRecorder.js`**: wraps
  `navigator.mediaDevices.getUserMedia` + `MediaRecorder` (Web platform
  APIs, no new dependency). `startRecording()` requests the mic and begins
  recording. `stopRecording()` stops and returns `{blob, mimeType}`, or
  `null` if the clip is shorter than a minimum threshold (300ms — avoids an
  API call for an accidental tap).
- **`mobile/src/composables/useGeminiTranslate.js`**: `translateToEnglish
  (text, apiKey)` → `transcribeAndTranslate(audioBlob, mimeType, apiKey)`.
  Response schema gains a `vietnameseText` field (the transcript, now
  produced by Gemini instead of the native plugin). System prompt updated:
  it now describes receiving spoken audio, not pre-transcribed text.
- **`mobile/src/composables/useSpeakSession.js`**: drop `partialText`,
  the silence timer, and the `watch` that drove it — none of that is needed
  without a live-updating on-device session. Add `lastAudioBlob` (module
  state) so `retry()` can resend the same audio without asking the user to
  speak again. `handlePressEnd` now: stop the recorder → empty/too-short →
  existing "Didn't catch that" error path (unchanged UX), else store the
  blob and call `transcribeAndTranslate`.
- **`mobile/src/views/SpeakView.vue`**: drop the live-transcript-while-
  recording display (confirmed acceptable trade-off). While recording, show
  only the existing "Listening…" label + mic-bar animation. The transcript
  box appears once a result (or error) exists, showing the Vietnamese text
  Gemini returned.
- **Removed**: `mobile/src/composables/useSpeechToText.js` and its test, and
  the `@capacitor-community/speech-recognition` dependency.

### Data flow

1. Press mic (`mousedown`/`touchstart`) → `startRecording()` (browser/WebView
   prompts for mic permission on first use) → `status = 'recording'`.
2. Release → `stopRecording()`. Too short/empty → `status = 'error'`,
   "Didn't catch that" message, no API call.
3. Otherwise → `status = 'translating'` → one `transcribeAndTranslate` call
   → on success, `status = 'result'`, entry saved to history (existing
   `useTranslateHistory`, unchanged).

### Error handling

- **Mic permission denied**: catch the `getUserMedia` rejection, show a
  message explaining the feature needs mic access (replaces the old
  permission-specific message that was keyed to the native plugin's error
  text).
- **Recording too short**: client-side guard, same "Didn't catch that" copy
  as today, no wasted API call.
- **Gemini call fails** (network, quota, malformed response): `status =
  'error'`, message from `err.message`. `lastAudioBlob` is retained so
  "Try again" resends the same audio instead of requiring a new recording.

### Testing

- `useAudioRecorder`: mock `navigator.mediaDevices.getUserMedia` and global
  `MediaRecorder` (same mocking style as the existing
  `useSpeechToText.test.js` mocked the native plugin). Cover: normal
  start/stop returns a blob; stop before the minimum duration returns `null`.
- `useGeminiTranslate`: extend `extractTranslateResult` tests to cover the
  new `vietnameseText` field.
- `useSpeakSession.test.js`: update mocks from `useSpeechToText`/
  `translateToEnglish` to `useAudioRecorder`/`transcribeAndTranslate`;
  existing three test cases (no API key → Settings redirect, shared state
  across callers, empty-recording error path, successful hold → history)
  carry over with the new mocks.

### Native config changes

- **iOS** (`Info.plist`): remove `NSSpeechRecognitionUsageDescription`
  (no longer used); keep `NSMicrophoneUsageDescription` (now what triggers
  the mic permission prompt for `getUserMedia`).
- **Android**: `RECORD_AUDIO` was previously auto-merged into the manifest by
  the speech-recognition plugin. Removing that plugin means it must be
  declared explicitly. Since `android/` is gitignored and regenerated via
  `npx cap add android`, add this as a new step to `mobile/README.md`'s
  "required after every `cap add`" checklist.

### Risk to validate early

`MediaRecorder` support in Capacitor's iOS WKWebView varies by iOS version
and isn't guaranteed at the same level as in a full browser. Before building
the rest of this feature, spike a minimal record → play-back-size-check on a
real iOS device/simulator running the app's actual target iOS version. If
unsupported, fall back to a lightweight native audio-recording Capacitor
plugin instead of the pure Web API path — the rest of this design (Gemini
call shape, `useSpeakSession` flow, error handling) is unaffected either way,
since only `useAudioRecorder`'s internals would change.

## Out of scope

- Web app (`src/site`) — not touched, not maintained further per this
  session's direction.
- CI workflows for the web app (`check.yml`, `deploy.yml`,
  `translation-status.yml`) — removed in this same session as unrelated
  cleanup, not part of this feature's design.
