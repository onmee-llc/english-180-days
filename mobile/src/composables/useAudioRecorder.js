const MIN_DURATION_MS = 300;
const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];

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
  stream = await navigator.mediaDevices.getUserMedia({audio: true});
  try {
    const mimeType = pickMimeType();
    recorder = mimeType
      ? new MediaRecorder(stream, {mimeType})
      : new MediaRecorder(stream);
    chunks = [];
    recorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    });
    startedAt = Date.now();
    recorder.start();
  } catch (err) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
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
    // Let a racing start() finish (or fail) before we try to stop it — a
    // very fast tap can call stop() while start() is still mid-flight.
    if (startPromise) {
      await startPromise.catch(() => {});
      startPromise = null;
    }
    if (!recorder) return {blob: null, reason: 'no active recorder'};

    const duration = Date.now() - startedAt;
    const activeRecorder = recorder;
    const activeStream = stream;
    const activeChunks = chunks;
    recorder = null;
    stream = null;

    return new Promise((resolve) => {
      activeRecorder.addEventListener('stop', () => {
        activeStream.getTracks().forEach((track) => track.stop());
        // ponytail: temporary diagnostic split (was one silent `null` for
        // both cases) — remove once the on-device "no audio captured"
        // report is root-caused, collapse back to a single not-recording
        // check.
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
        resolve({
          blob: new Blob(activeChunks, {type: activeRecorder.mimeType}),
          mimeType: activeRecorder.mimeType,
        });
      });
      activeRecorder.stop();
    });
  }

  return {startRecording, stopRecording};
}
