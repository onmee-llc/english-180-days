// Shared recording/translate state — lifted out of SpeakView.vue so a
// long-press on the bottom-nav Speak icon (BottomNav.vue) can drive the
// same session from any screen, and SpeakView.vue picks up wherever it
// left off when it mounts (a fresh instance, since navigation happens
// after the press ends).
import {ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useSpeechToText} from './useSpeechToText.js';
import {translateToEnglish} from './useGeminiTranslate.js';
import {useApiKey} from './useApiKey.js';
import {useTranslateHistory} from './useTranslateHistory.js';

const status = ref('idle'); // idle | recording | translating | result | error
const errorMessage = ref('');
const lastVietnameseText = ref('');
const result = ref(null); // {englishSentence, ipa, explanation}

const {partialText, startListening, stopListening} = useSpeechToText();

// Android's on-device recognizer doesn't reliably signal end-of-speech back
// to this plugin — waiting on it silently loses the transcript. So we own
// silence detection: 3s with no new partial while recording ends the turn.
const SILENCE_MS = 3000;
let silenceTimer = null;
function resetSilenceTimer() {
  clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => {
    if (status.value === 'recording') handlePressEnd();
  }, SILENCE_MS);
}
function clearSilenceTimer() {
  clearTimeout(silenceTimer);
  silenceTimer = null;
}
// Module scope, not inside useSpeakSession(): registering this once for the
// app's lifetime — instead of once per caller (BottomNav + SpeakView both
// call useSpeakSession()) — avoids duplicate watchers on the same singleton.
watch(partialText, () => {
  if (status.value === 'recording') resetSilenceTimer();
});

async function runTranslate(text, apiKey, addEntry) {
  try {
    const translated = await translateToEnglish(text, apiKey);
    result.value = translated;
    status.value = 'result';
    await addEntry({vietnameseText: text, ...translated});
  } catch (err) {
    status.value = 'error';
    errorMessage.value = err.message || 'Translation failed. Please try again.';
  }
}

async function handlePressEnd(deps) {
  if (status.value !== 'recording') return;
  clearSilenceTimer();
  let text = '';
  try {
    text = await stopListening();
  } catch (err) {
    status.value = 'error';
    errorMessage.value =
      err.message || 'Could not stop listening. Please try again.';
    return;
  }
  if (!text.trim()) {
    lastVietnameseText.value = '';
    status.value = 'error';
    errorMessage.value = "Didn't catch that — try again.";
    return;
  }

  lastVietnameseText.value = text;
  status.value = 'translating';
  await deps.initHistory();
  await runTranslate(text, deps.apiKey.value, deps.addEntry);
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
    status.value = 'recording';
    try {
      await startListening();
      resetSilenceTimer();
    } catch (err) {
      status.value = 'error';
      // startListening() also rejects for non-permission reasons (native start()
      // failure, or the plugin's web stub throwing "not implemented on web" in
      // the dev server) — showing permission copy for those misdiagnoses them.
      errorMessage.value =
        err.message === 'Microphone permission was not granted.'
          ? 'Microphone access is needed for this feature. Please allow it and try again.'
          : err.message || 'Could not start listening. Please try again.';
    }
    return true;
  }

  function retry() {
    if (lastVietnameseText.value) {
      status.value = 'translating';
      errorMessage.value = '';
      runTranslate(lastVietnameseText.value, apiKey.value, addEntry);
    } else {
      status.value = 'idle';
      errorMessage.value = '';
    }
  }

  return {
    status,
    errorMessage,
    lastVietnameseText,
    result,
    partialText,
    history,
    initHistory,
    handlePressStart,
    handlePressEnd: () => handlePressEnd(deps),
    retry,
  };
}
