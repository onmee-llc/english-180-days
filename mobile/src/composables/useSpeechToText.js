import {ref} from 'vue';
import {SpeechRecognition} from '@capacitor-community/speech-recognition';

const isListening = ref(false);
const partialText = ref('');
let committedText = '';
let partialListenerHandle = null;
let listeningStateHandle = null;
let startPromise = null;

function setSessionText(text) {
  partialText.value = committedText ? `${committedText} ${text}` : text;
}

async function beginNativeSession() {
  await SpeechRecognition.start({
    language: 'vi-VN',
    partialResults: true,
    popup: false,
  });
}

async function doStart() {
  partialText.value = '';
  committedText = '';

  const status = await SpeechRecognition.checkPermissions();
  if (status.speechRecognition !== 'granted') {
    const requested = await SpeechRecognition.requestPermissions();
    if (requested.speechRecognition !== 'granted') {
      throw new Error('Microphone permission was not granted.');
    }
  }

  // Guard against leaked handles if doStart() somehow runs again before
  // prior listeners were cleaned up.
  if (partialListenerHandle) {
    await partialListenerHandle.remove();
    partialListenerHandle = null;
  }
  if (listeningStateHandle) {
    await listeningStateHandle.remove();
    listeningStateHandle = null;
  }

  partialListenerHandle = await SpeechRecognition.addListener(
    'partialResults',
    (data) => {
      setSessionText(data.matches?.[0] || '');
    },
  );

  // Android's on-device recognizer ends its native session on its own
  // short-pause VAD even while the user still holds the mic down — without
  // this, anything spoken after that silent session death is lost. Fold
  // what was heard into committedText and restart transparently.
  listeningStateHandle = await SpeechRecognition.addListener(
    'listeningState',
    (data) => {
      if (data.status !== 'stopped' || !isListening.value) return;
      committedText = partialText.value;
      beginNativeSession().catch(() => {
        isListening.value = false;
      });
    },
  );

  isListening.value = true;
  try {
    // partialResults:true means start() resolves immediately without a
    // final result — the transcript arrives via the listener above, and
    // whatever it last set is treated as final when stopListening() runs.
    await beginNativeSession();
  } catch (err) {
    // start() rejected (engine busy, hardware unavailable, ...) — roll
    // back so a retry doesn't leak a second listener on top of a stuck
    // isListening flag.
    await partialListenerHandle?.remove();
    await listeningStateHandle?.remove();
    partialListenerHandle = null;
    listeningStateHandle = null;
    isListening.value = false;
    throw err;
  }
}

export function useSpeechToText() {
  async function startListening() {
    startPromise = doStart();
    return startPromise;
  }

  async function stopListening() {
    // Let a racing start() finish (or fail) before we try to stop it —
    // otherwise a very fast tap can call stop() while start() is still
    // mid-flight, leaving the native mic recording with nothing tracking it.
    if (startPromise) {
      await startPromise.catch(() => {});
      startPromise = null;
    }

    // Set before stop() so the listeningState handler above sees an
    // intentional stop (not a mid-hold native session death) and doesn't
    // restart on the 'stopped' event this triggers.
    isListening.value = false;

    // Not awaited: the native Android plugin's stop() never resolves its
    // PluginCall on success (only rejects on error) — awaiting it here
    // hangs handlePressEnd forever. The transcript we need is already in
    // partialText via the listener above; stop() is fire-and-forget.
    SpeechRecognition.stop().catch(() => {});
    if (partialListenerHandle) {
      await partialListenerHandle.remove();
      partialListenerHandle = null;
    }
    if (listeningStateHandle) {
      await listeningStateHandle.remove();
      listeningStateHandle = null;
    }
    return partialText.value;
  }

  return {isListening, partialText, startListening, stopListening};
}
