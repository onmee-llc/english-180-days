const MIN_DURATION_MS = 300;
const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];

function pickMimeType() {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return '';
  }
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

let stream = null;
let recorder = null;
let chunks = [];
let startedAt = 0;
let startPromise = null;

async function doStart() {
  stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const mimeType = pickMimeType();
  recorder = mimeType ? new MediaRecorder(stream, {mimeType}) : new MediaRecorder(stream);
  chunks = [];
  recorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });
  startedAt = Date.now();
  recorder.start();
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
    if (!recorder) return null;

    const duration = Date.now() - startedAt;
    const activeRecorder = recorder;
    const activeStream = stream;
    recorder = null;
    stream = null;

    return new Promise((resolve) => {
      activeRecorder.addEventListener('stop', () => {
        activeStream.getTracks().forEach((track) => track.stop());
        if (duration < MIN_DURATION_MS || chunks.length === 0) {
          resolve(null);
          return;
        }
        resolve({
          blob: new Blob(chunks, {type: activeRecorder.mimeType}),
          mimeType: activeRecorder.mimeType,
        });
      });
      activeRecorder.stop();
    });
  }

  return {startRecording, stopRecording};
}
