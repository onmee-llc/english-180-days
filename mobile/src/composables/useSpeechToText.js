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
