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

async function doStart() {
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
    // Continuous recording ensures valid headers and complete audio frames in WebView
    recorder.start();
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
  async function startRecording() {
    if (startPromise || recorder) {
      await stopRecording().catch(() => {});
    }
    startPromise = doStart();
    return startPromise;
  }

  async function stopRecording() {
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



