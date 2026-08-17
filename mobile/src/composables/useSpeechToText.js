import {ref} from 'vue';
import {SpeechRecognition} from '@capacitor-community/speech-recognition';

const isListening = ref(false);
const partialText = ref('');
let partialListenerHandle = null;
let startPromise = null;

async function doStart() {
  partialText.value = '';

  const status = await SpeechRecognition.checkPermissions();
  if (status.speechRecognition !== 'granted') {
    const requested = await SpeechRecognition.requestPermissions();
    if (requested.speechRecognition !== 'granted') {
      throw new Error('Microphone permission was not granted.');
    }
  }

  // Guard against a leaked handle if doStart() somehow runs again before a
  // prior listener was cleaned up.
  if (partialListenerHandle) {
    await partialListenerHandle.remove();
    partialListenerHandle = null;
  }

  partialListenerHandle = await SpeechRecognition.addListener(
    'partialResults',
    (data) => {
      partialText.value = data.matches?.[0] || partialText.value;
    },
  );

  isListening.value = true;
  try {
    // partialResults:true means start() resolves immediately without a
    // final result — the transcript arrives via the listener above, and
    // whatever it last set is treated as final when stopListening() runs.
    await SpeechRecognition.start({
      language: 'vi-VN',
      partialResults: true,
      popup: false,
    });
  } catch (err) {
    // start() rejected (engine busy, hardware unavailable, ...) — roll
    // back so a retry doesn't leak a second listener on top of a stuck
    // isListening flag.
    await partialListenerHandle?.remove();
    partialListenerHandle = null;
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
