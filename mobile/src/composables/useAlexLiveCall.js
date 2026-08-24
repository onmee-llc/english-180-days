import {ref, computed} from 'vue';
import {AgentRuntime} from '../agent-core/AgentRuntime.js';
import {playTtsAudio, stopTtsAudio} from './useSpeechAudio.js';
import {useAudioRecorder} from './useAudioRecorder.js';

// Global Singleton State for Alex Live Call & Co-Pilot
const isFullScreen = ref(true); // Full screen live call by default upon app open
const isAudioMuted = ref(true); // Muted by default upon app open
const callState = ref('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
const currentTranscript = ref('');
const alexResponseText = ref('Xin chào Robert! Hôm nay chúng ta cần giải quyết những việc gì?');
const isKeyboardOpen = ref(false);
const runtimeInstance = ref(null);

let speechRecognitionInstance = null;

/**
 * Converts formatted text / markdown into natural, warm, conversational spoken Vietnamese.
 * Strips all robotic markdown tokens, bullet points, numbers, symbols, and code.
 */
export function convertTextToNaturalSpokenVietnamese(text) {
  if (!text) return '';
  return text
    // 1. Remove markdown links [text](url) -> text
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    // 2. Remove code blocks ```...``` and inline `code`
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // 3. Remove bold / italic markup **text** -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // 4. Remove headings ### Heading -> Heading
    .replace(/#{1,6}\s*([^\n]+)/g, '$1')
    // 5. Convert numbered/bullet lists "1. Item" or "- Item" into natural spoken sentences
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // 6. Remove quotes and brackets
    .replace(/[>~|_#^]/g, ' ')
    // 7. Normalize multiple newlines and spaces to natural conversational pauses
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .replace(/[:;]\s*\./g, '.')
    .replace(/(\.\s*)+/g, '. ')
    .trim();
}

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  const RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!RecognitionClass) return null;
  try {
    const recognition = new RecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'vi-VN';
    return recognition;
  } catch (_) {
    return null;
  }
}

export function useAlexLiveCall() {
  const {startRecording, stopRecording} = useAudioRecorder();

  function initRuntime(apiKey = '', contentLessons = [], masteryStore = null) {
    if (!runtimeInstance.value) {
      runtimeInstance.value = new AgentRuntime({
        apiKey,
        contentLessons,
        masteryStore,
      });
    }
    return runtimeInstance.value;
  }

  function openFullScreenCall() {
    isFullScreen.value = true;
  }

  function minimizeToTopDock() {
    isFullScreen.value = false;
    stopAlexSpeaking();
  }

  function toggleAudioMute() {
    isAudioMuted.value = !isAudioMuted.value;
    if (isAudioMuted.value) {
      stopAlexSpeaking();
    }
  }

  async function stopAlexSpeaking() {
    try {
      await stopTtsAudio();
    } catch (_) {}
    if (callState.value === 'speaking') {
      callState.value = 'idle';
    }
  }

  async function speakAlexResponse(text) {
    if (isAudioMuted.value || !text) {
      callState.value = 'idle';
      return;
    }

    // Convert raw structured text into warm, natural conversational speech
    const naturalSpeech = convertTextToNaturalSpokenVietnamese(text);
    if (!naturalSpeech) {
      callState.value = 'idle';
      return;
    }

    callState.value = 'speaking';
    try {
      await playTtsAudio(
        naturalSpeech,
        1.0,
        () => {
          if (callState.value === 'speaking') {
            callState.value = 'idle';
          }
        },
        () => {
          callState.value = 'idle';
        },
        'vi-VN',
        'male',
      );
    } catch (_) {
      callState.value = 'idle';
    }
  }

  async function handleSendPrompt(promptText, router = null) {
    if (!promptText || !promptText.trim()) return;
    const trimmed = promptText.trim();
    currentTranscript.value = trimmed;
    callState.value = 'thinking';

    // Stop ongoing speech before processing new user turn
    await stopAlexSpeaking();

    // Only minimize and navigate if the user EXPLICITLY requested navigation via specific keywords
    const lower = trimmed.toLowerCase();
    if (router) {
      if (lower.startsWith('mở màn hình bài học') || lower.startsWith('chuyển sang bài học')) {
        minimizeToTopDock();
        router.push('/today-lesson');
        return;
      } else if (lower.startsWith('mở màn hình luyện nói') || lower.startsWith('chuyển sang luyện nói')) {
        minimizeToTopDock();
        router.push('/speak');
        return;
      } else if (lower.startsWith('mở màn hình khóa học') || lower.startsWith('chuyển sang khóa học')) {
        minimizeToTopDock();
        router.push('/courses');
        return;
      } else if (lower.startsWith('mở màn hình cài đặt') || lower.startsWith('mở vault')) {
        minimizeToTopDock();
        router.push('/settings');
        return;
      }
    }

    if (!runtimeInstance.value) {
      initRuntime();
    }

    try {
      await runtimeInstance.value.sendPrompt({
        channelId: 'companion',
        prompt: trimmed,
        onChunk: (chunk) => {
          if (chunk.text) {
            alexResponseText.value = chunk.text;
          }
        },
        onComplete: (msg) => {
          alexResponseText.value = msg.content;
          speakAlexResponse(msg.content);
        },
        onError: () => {
          callState.value = 'idle';
        },
      });
    } catch (_) {
      callState.value = 'idle';
    }
  }

  async function startListening() {
    // If Alex is speaking, immediately interrupt/stop speech
    await stopAlexSpeaking();

    callState.value = 'listening';
    currentTranscript.value = 'Đang lắng nghe Robert...';

    // 1. Try SpeechRecognition for live Vietnamese transcription
    speechRecognitionInstance = getSpeechRecognition();
    if (speechRecognitionInstance) {
      speechRecognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          currentTranscript.value = transcript;
        }
      };
      speechRecognitionInstance.onerror = () => {};
      try {
        speechRecognitionInstance.start();
      } catch (_) {}
    }

    // 2. Also start AudioRecorder for waveform / mic capture
    try {
      await startRecording();
    } catch (_) {}
  }

  async function stopListeningAndSend(router = null) {
    if (callState.value !== 'listening') return;
    callState.value = 'thinking';

    if (speechRecognitionInstance) {
      try {
        speechRecognitionInstance.stop();
      } catch (_) {}
      speechRecognitionInstance = null;
    }

    try {
      await stopRecording().catch(() => {});
    } catch (_) {}

    const captured = currentTranscript.value && currentTranscript.value !== 'Đang lắng nghe Robert...'
      ? currentTranscript.value.trim()
      : 'Alex, hãy báo cáo tóm tắt 3 việc quan trọng hôm nay cho Robert.';

    await handleSendPrompt(captured, router);
  }

  return {
    isFullScreen,
    isAudioMuted,
    callState,
    currentTranscript,
    alexResponseText,
    isKeyboardOpen,
    runtimeInstance,
    initRuntime,
    openFullScreenCall,
    minimizeToTopDock,
    toggleAudioMute,
    stopAlexSpeaking,
    speakAlexResponse,
    handleSendPrompt,
    startListening,
    stopListeningAndSend,
  };
}
