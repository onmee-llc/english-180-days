const MIN_DURATION_MS = 300;
const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/aac',
  'audio/ogg',
  'audio/wav',
];

function pickMimeType() {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return '';
  }
  return (
    MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) || ''
  );
}

let stream = null;
let recorder = null;
let chunks = [];
let startedAt = 0;
let startPromise = null;
let audioContext = null;
let analyserNode = null;
let vadTimer = null;
let silenceCallback = null;

async function doStart(options = {}) {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (err) {
    stream = null;
    recorder = null;
    throw err;
  }

  try {
    const mimeType = pickMimeType();
    recorder = mimeType
      ? new MediaRecorder(stream, {mimeType, audioBitsPerSecond: 128000})
      : new MediaRecorder(stream);
    chunks = [];

    const onData = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    if (typeof recorder.addEventListener === 'function') {
      recorder.addEventListener('dataavailable', onData);
    }
    recorder.ondataavailable = onData;

    startedAt = Date.now();
    // Continuous 250ms timeslices ensure valid audio packets on Android WebView
    recorder.start(250);

    // Setup Web Audio API VAD (Voice Activity Detection)
    silenceCallback = options.onSilence || null;
    const silenceTimeoutMs = options.silenceTimeoutMs || 1200;
    const minSpeechMs = options.minSpeechMs || 500;

    if (silenceCallback && typeof window !== 'undefined') {
      try {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) {
          audioContext = new AudioCtxClass();
          const source = audioContext.createMediaStreamSource(stream);
          analyserNode = audioContext.createAnalyser();
          analyserNode.fftSize = 512;
          source.connect(analyserNode);

          const bufferLength = analyserNode.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          let hasDetectedVoice = false;
          let lastVoiceAt = Date.now();

          vadTimer = setInterval(() => {
            if (!analyserNode) return;
            analyserNode.getByteTimeDomainData(dataArray);

            // Compute RMS (Root Mean Square) volume level
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              const val = (dataArray[i] - 128) / 128;
              sum += val * val;
            }
            const rms = Math.sqrt(sum / bufferLength);

            // Audio threshold: > 0.02 means user is actively speaking
            if (rms > 0.02) {
              hasDetectedVoice = true;
              lastVoiceAt = Date.now();
            } else if (hasDetectedVoice) {
              const silenceElapsed = Date.now() - lastVoiceAt;
              const totalElapsed = Date.now() - startedAt;
              if (silenceElapsed >= silenceTimeoutMs && totalElapsed >= minSpeechMs) {
                if (vadTimer) {
                  clearInterval(vadTimer);
                  vadTimer = null;
                }
                if (silenceCallback) {
                  const cb = silenceCallback;
                  silenceCallback = null;
                  cb();
                }
              }
            }
          }, 100);
        }
      } catch (vadErr) {
        console.warn('VAD initialization warning:', vadErr);
      }
    }
  } catch (err) {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    recorder = null;
    throw err;
  }
}

export function useAudioRecorder() {
  async function startRecording(options = {}) {
    if (startPromise || recorder) {
      await stopRecording().catch(() => {});
    }
    startPromise = doStart(options);
    return startPromise;
  }

  async function stopRecording() {
    if (vadTimer) {
      clearInterval(vadTimer);
      vadTimer = null;
    }
    silenceCallback = null;

    if (audioContext) {
      try {
        audioContext.close().catch(() => {});
      } catch (_) {}
      audioContext = null;
      analyserNode = null;
    }

    if (startPromise) {
      await startPromise.catch(() => {});
      startPromise = null;
    }
    if (!recorder) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
      return {blob: null, reason: 'no active recorder'};
    }

    const duration = Date.now() - startedAt;
    const activeRecorder = recorder;
    const activeStream = stream;
    const activeChunks = chunks;
    recorder = null;
    stream = null;

    return new Promise((resolve) => {
      let isResolved = false;

      const finalizeStop = () => {
        if (isResolved) return;
        isResolved = true;

        if (activeStream) {
          try {
            activeStream.getTracks().forEach((track) => track.stop());
          } catch (_) {}
        }

        if (duration < MIN_DURATION_MS) {
          resolve({blob: null, reason: `held for only ${duration}ms`});
          return;
        }

        if (activeChunks.length === 0) {
          resolve({
            blob: null,
            reason: `no audio data captured (${duration}ms, mimeType=${
              activeRecorder.mimeType || 'default'
            })`,
          });
          return;
        }

        const mimeType = activeRecorder.mimeType || 'audio/webm';
        const blob = new Blob(activeChunks, {type: mimeType});
        resolve({blob, mimeType});
      };

      // Fallback timeout in case MediaRecorder 'stop' event does not fire promptly in WebView
      const safetyTimer = setTimeout(finalizeStop, 750);

      if (typeof activeRecorder.addEventListener === 'function') {
        activeRecorder.addEventListener('stop', () => {
          clearTimeout(safetyTimer);
          finalizeStop();
        }, {once: true});
      }
      activeRecorder.onstop = () => {
        clearTimeout(safetyTimer);
        finalizeStop();
      };

      try {
        if (activeRecorder.state !== 'inactive') {
          try {
            activeRecorder.requestData();
          } catch (_) {}
          activeRecorder.stop();
        } else {
          clearTimeout(safetyTimer);
          finalizeStop();
        }
      } catch (_) {
        clearTimeout(safetyTimer);
        finalizeStop();
      }
    });
  }

  return {startRecording, stopRecording};
}



