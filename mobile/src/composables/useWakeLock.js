// Keeps the screen from auto-locking during a Speak turn. Android backgrounds
// (pauses/stops) an app the instant its screen locks, and backgrounding kills
// an in-progress microphone recording — the app has no foreground service to
// keep mic access alive. A screen auto-lock mid-recording (or mid-wait for
// the translate response) was the root cause of Speak turns silently failing
// or needing several retries.
let wakeLock = null;

export function useWakeLock() {
  async function acquire() {
    if (!('wakeLock' in navigator)) return;
    // A fast re-press can call acquire() again before the prior turn's
    // release() ran (see the turn-guard race documented in
    // useSpeakSession.js) — release the stale lock first so it isn't
    // orphaned holding the screen awake after the new turn ends.
    await release();
    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
      // Not fatal — recording still works, it's just no longer protected
      // from a screen-timeout mid-turn. Seen when battery saver or a
      // similar OS policy denies the request.
      wakeLock = null;
    }
  }

  async function release() {
    if (!wakeLock) return;
    const lock = wakeLock;
    wakeLock = null;
    await lock.release().catch(() => {});
  }

  return {acquire, release};
}
