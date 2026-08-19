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

// Incremented at the start of every fresh attempt (handlePressStart) and
// every resend (retry()). runTranslate() captures the turn it was started
// for and, right before writing any shared state, checks it's still the
// current turn — so a stale in-flight translate from an abandoned attempt
// can't stomp on a newer recording/retry that started while it was pending.
let turn = 0;

async function runTranslate(deps, myTurn) {
  try {
    const translated = await transcribeAndTranslate(
      lastAudioBlob,
      lastAudioMimeType,
      deps.apiKey.value,
    );
    if (myTurn !== turn) return;
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
    if (myTurn !== turn) return;
    status.value = 'error';
    errorMessage.value = err.message || 'Translation failed. Please try again.';
  }
}

async function handlePressEnd(deps) {
  if (status.value !== 'recording') return;
  // Captured before the awaits below so a fast re-press (handlePressStart
  // bumping `turn` while this attempt is still stopping/initializing) is
  // detected instead of this stale attempt claiming the new turn.
  const myTurn = turn;
  let recording = null;
  try {
    recording = await stopRecording();
  } catch (err) {
    if (myTurn !== turn) return;
    status.value = 'error';
    errorMessage.value =
      err.message || 'Could not stop recording. Please try again.';
    return;
  }
  if (myTurn !== turn) return;
  if (!recording.blob) {
    lastVietnameseText.value = '';
    status.value = 'error';
    // ponytail: temporary diagnostic detail appended to the reason from
    // useAudioRecorder.js — remove once root-caused, see the matching note
    // there.
    errorMessage.value = `Didn't catch that — try again. (${recording.reason})`;
    return;
  }

  lastAudioBlob = recording.blob;
  lastAudioMimeType = recording.mimeType;
  status.value = 'translating';
  await deps.initHistory();
  if (myTurn !== turn) return;
  await runTranslate(deps, myTurn);
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
    turn += 1;
    errorMessage.value = '';
    result.value = null;
    lastVietnameseText.value = '';
    lastAudioBlob = null;
    lastAudioMimeType = '';
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
      turn += 1;
      status.value = 'translating';
      errorMessage.value = '';
      return runTranslate(deps, turn);
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
