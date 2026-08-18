// Distinguishes a tap (let default click/navigation happen) from a hold
// (start an action immediately, suppress the click). No native long-press
// event exists on the web, so this is the minimal timer-based version.
export function createPressGesture({thresholdMs, onLongPress}) {
  let timer = null;
  let isLongPress = false;

  return {
    start() {
      isLongPress = false;
      timer = setTimeout(() => {
        isLongPress = true;
        onLongPress();
      }, thresholdMs);
    },
    // Returns whether this press turned out to be a long press.
    end() {
      clearTimeout(timer);
      return isLongPress;
    },
    cancel() {
      clearTimeout(timer);
      isLongPress = false;
    },
  };
}
