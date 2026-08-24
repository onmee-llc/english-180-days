import {ref} from 'vue';
import {AgentRuntime} from '../agent-core/AgentRuntime.js';
import {playTtsAudio, stopTtsAudio} from './useSpeechAudio.js';
import {useAudioRecorder} from './useAudioRecorder.js';
import {useApiKey} from './useApiKey.js';

// Global Singleton State for Alex Live Call & Co-Pilot
const isFullScreen = ref(true); // Full screen live call by default upon app open
const isAudioMuted = ref(false); // Unmuted for natural conversational voice interaction
const callState = ref('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
const currentTranscript = ref('');
const alexResponseText = ref('Hello Robert! I am Alex, your AI Co-pilot and English Speaking Coach. How can I help you today?');
const isKeyboardOpen = ref(false);
const runtimeInstance = ref(null);

let speechRecognitionInstance = null;

/**
 * Extracts ONLY natural English speech for TTS audio playback.
 * Strips all Vietnamese translation notes, parentheses, brackets, markdown tokens, and code.
 */
export function extractSpokenEnglishOnly(text) {
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
    // 5. Remove bullet markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // 6. Remove explicit Vietnamese translation blocks e.g. (Tiếng Việt: ...) or (Dịch: ...)
    .replace(/\((?:Tiếng Việt|Dịch|Nghĩa là|Bản dịch|Gợi ý)[^)]*\)/gi, '')
    .replace(/\[(?:Tiếng Việt|Dịch|Nghĩa là|Bản dịch|Gợi ý)[^\]]*\]/gi, '')
    // 7. Filter out Vietnamese-only lines from audio playback
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (/^(?:tiếng việt|dịch nghĩa|nghĩa tiếng việt|lưu ý|chú thích|hướng dẫn):/i.test(trimmed)) {
        return false;
      }
      return true;
    })
    .join('. ')
    // 8. Strip any remaining Vietnamese accented characters so TTS only pronounces English
    .replace(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi, '')
    // 9. Remove remaining special characters and normalize whitespace
    .replace(/[>~|_#^]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[:;]\s*\./g, '.')
    .replace(/(\.\s*)+/g, '. ')
    .trim();
}

/**
 * Backward compatibility alias for existing tests
 */
export const convertTextToNaturalSpokenVietnamese = extractSpokenEnglishOnly;

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  const RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!RecognitionClass) return null;
  try {
    const recognition = new RecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    return recognition;
  } catch (_) {
    return null;
  }
}

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result || '').split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function useAlexLiveCall() {
  const {startRecording, stopRecording} = useAudioRecorder();
  const {apiKey, init: initApiKey} = useApiKey();

  async function getEffectiveApiKey() {
    await initApiKey();
    if (apiKey.value) return apiKey.value;
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('dm_gemini_api_key') || localStorage.getItem('gemini_api_key') || '';
    }
    return '';
  }

  async function initRuntime(providedKey = '', contentLessons = [], masteryStore = null) {
    if (!runtimeInstance.value) {
      const effectiveKey = providedKey || (await getEffectiveApiKey());
      runtimeInstance.value = new AgentRuntime({
        apiKey: effectiveKey,
        contentLessons,
        masteryStore,
      });
    } else if (providedKey) {
      runtimeInstance.value.setApiKey(providedKey);
    }
    return runtimeInstance.value;
  }

  function openFullScreenCall() {
    isFullScreen.value = true;
    if (!isAudioMuted.value && callState.value === 'idle') {
      speakAlexResponse(alexResponseText.value);
    }
  }

  function minimizeToTopDock() {
    isFullScreen.value = false;
    stopAlexSpeaking();
  }

  function toggleAudioMute() {
    isAudioMuted.value = !isAudioMuted.value;
    if (isAudioMuted.value) {
      stopAlexSpeaking();
    } else if (callState.value === 'idle') {
      speakAlexResponse(alexResponseText.value);
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

    // Extract ONLY fluent English sentences for TTS audio output
    const spokenEnglish = extractSpokenEnglishOnly(text);
    if (!spokenEnglish) {
      callState.value = 'idle';
      return;
    }

    callState.value = 'speaking';
    try {
      await playTtsAudio(
        spokenEnglish,
        1.0,
        () => {
          if (callState.value === 'speaking') {
            callState.value = 'idle';
          }
        },
        () => {
          callState.value = 'idle';
        },
        'en-US',
        'male',
      );
    } catch (_) {
      callState.value = 'idle';
    }
  }

  async function handleSendPrompt(promptText, router = null, audioPart = null) {
    if (!promptText && !audioPart) return;
    const trimmed = (promptText || '').trim();
    if (trimmed) {
      currentTranscript.value = trimmed;
    }
    callState.value = 'thinking';

    // Stop ongoing speech before processing new user turn
    await stopAlexSpeaking();

    // Check for explicit navigation keywords
    const lower = trimmed.toLowerCase();
    if (router && trimmed) {
      if (lower.startsWith('mở màn hình bài học') || lower.startsWith('chuyển sang bài học') || lower.includes('open lesson')) {
        minimizeToTopDock();
        router.push('/today-lesson');
        return;
      } else if (lower.startsWith('mở màn hình luyện nói') || lower.startsWith('chuyển sang luyện nói') || lower.includes('open speaking')) {
        minimizeToTopDock();
        router.push('/speak');
        return;
      } else if (lower.startsWith('mở màn hình khóa học') || lower.startsWith('chuyển sang khóa học') || lower.includes('open courses')) {
        minimizeToTopDock();
        router.push('/courses');
        return;
      } else if (lower.startsWith('mở màn hình cài đặt') || lower.startsWith('mở vault') || lower.includes('open settings')) {
        minimizeToTopDock();
        router.push('/settings');
        return;
      }
    }

    const effectiveKey = await getEffectiveApiKey();
    if (!runtimeInstance.value) {
      await initRuntime(effectiveKey);
    } else if (effectiveKey) {
      runtimeInstance.value.setApiKey(effectiveKey);
    }

    try {
      await runtimeInstance.value.sendPrompt({
        channelId: 'companion',
        prompt: trimmed,
        audioPart,
        onToken: (token) => {
          if (token && token.accumulated) {
            alexResponseText.value = token.accumulated;
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

    // Engaging in voice talk enables audio response
    isAudioMuted.value = false;
    callState.value = 'listening';
    currentTranscript.value = 'Listening to Robert...';

    // 1. Try Web SpeechRecognition for live real-time transcription
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

    // 2. Also start AudioRecorder for high-fidelity audio capture
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

    let recording = null;
    try {
      recording = await stopRecording();
    } catch (_) {}

    let capturedText = '';
    if (currentTranscript.value && currentTranscript.value !== 'Listening to Robert...') {
      capturedText = currentTranscript.value.trim();
    }

    // Direct single-roundtrip multimodal streaming:
    // If text was recognized, stream directly with text.
    // If text was empty but audio exists, stream directly with audioPart in a single request!
    if (capturedText) {
      await handleSendPrompt(capturedText, router);
      return;
    }

    if (recording && recording.blob && recording.blob.size > 200) {
      currentTranscript.value = 'Understanding Robert...';
      try {
        const base64Audio = await blobToBase64(recording.blob);
        await handleSendPrompt('', router, {
          mimeType: recording.mimeType || 'audio/webm',
          data: base64Audio,
        });
        return;
      } catch (err) {
        console.warn('Direct multimodal audio streaming error:', err);
      }
    }

    // If still no speech detected, prompt Robert
    callState.value = 'idle';
    currentTranscript.value = '';
    alexResponseText.value = 'I did not catch that, Robert. Please tap the mic again to speak, or type a message.';
    if (!isAudioMuted.value) {
      speakAlexResponse(alexResponseText.value);
    }
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
