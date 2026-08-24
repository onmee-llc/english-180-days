// Shared recording/translate state — lifted out of SpeakView.vue so a
// long-press on the bottom-nav Speak icon (BottomNav.vue) can drive the
// same session from any screen, and SpeakView.vue picks up wherever it
// left off when it mounts.
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useAudioRecorder} from './useAudioRecorder.js';
import {transcribeAndTranslate} from './useGeminiTranslate.js';
import {useApiKey} from './useApiKey.js';
import {useTranslateHistory} from './useTranslateHistory.js';
import {useWakeLock} from './useWakeLock.js';
import {useProgress} from './useProgress.js';

const status = ref('idle'); // idle | recording | translating | result | error
const errorMessage = ref('');
const lastVietnameseText = ref('');
const result = ref(null); // {englishSentence, ipa, explanation}

const {startRecording, stopRecording} = useAudioRecorder();
const {acquire: acquireWakeLock, release: releaseWakeLock} = useWakeLock();

let lastAudioBlob = null;
let lastAudioMimeType = '';
let turn = 0;

async function runTranslate(deps, myTurn) {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              'Quá thời gian phản hồi từ AI. Vui lòng kiểm tra kết nối mạng và thử lại.',
            ),
          ),
        18000,
      ),
    );
    const translatePromise = transcribeAndTranslate(
      lastAudioBlob,
      lastAudioMimeType,
      deps.apiKey.value,
    );
    const translated = await Promise.race([translatePromise, timeoutPromise]);
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
    if (deps.incrementSpeakCount) {
      await deps.incrementSpeakCount().catch(() => {});
    }
    await releaseWakeLock();
  } catch (err) {
    if (myTurn !== turn) return;
    status.value = 'error';
    errorMessage.value = err.message || 'Dịch thất bại. Vui lòng thử lại.';
    await releaseWakeLock();
  }
}

async function handlePressEnd(deps) {
  if (status.value !== 'recording') return;
  const myTurn = turn;
  // Immediate visual feedback to user so they know recording stopped and processing began
  status.value = 'translating';

  let recording = null;
  try {
    recording = await stopRecording();
  } catch (err) {
    if (myTurn !== turn) return;
    status.value = 'error';
    errorMessage.value =
      err.message || 'Không thể dừng thu âm. Vui lòng thử lại.';
    await releaseWakeLock();
    return;
  }
  if (myTurn !== turn) return;
  if (!recording || !recording.blob) {
    lastVietnameseText.value = '';
    status.value = 'error';
    errorMessage.value = `Didn't catch that — try again. (${recording?.reason || 'quá ngắn'})`;
    await releaseWakeLock();
    return;
  }

  lastAudioBlob = recording.blob;
  lastAudioMimeType = recording.mimeType;
  await deps.initHistory();
  if (myTurn !== turn) return;
  await runTranslate(deps, myTurn);
}

export function useSpeakSession() {
  const router = useRouter();
  const {apiKey, init: initApiKey} = useApiKey();
  const {history, init: initHistory, addEntry} = useTranslateHistory();
  const {incrementSpeakCount} = useProgress();
  const deps = {apiKey, initHistory, addEntry, incrementSpeakCount};

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
    await acquireWakeLock();
    try {
      await startRecording();
    } catch (err) {
      status.value = 'error';
      errorMessage.value =
        err.name === 'NotAllowedError'
          ? 'Ứng dụng cần quyền sử dụng Micro để thu âm. Vui lòng cấp quyền trong Cài đặt và thử lại.'
          : err.message || 'Không thể khởi động micro. Vui lòng thử lại.';
      await releaseWakeLock();
      return false;
    }
    return true;
  }

  async function retry() {
    if (lastAudioBlob) {
      turn += 1;
      status.value = 'translating';
      errorMessage.value = '';
      await acquireWakeLock();
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

