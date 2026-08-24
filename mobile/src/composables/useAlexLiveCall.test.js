import {describe, it, expect, beforeEach} from 'vitest';
import {useAlexLiveCall, convertTextToNaturalSpokenVietnamese} from './useAlexLiveCall.js';

describe('useAlexLiveCall', () => {
  beforeEach(() => {
    const {openFullScreenCall, isAudioMuted} = useAlexLiveCall();
    openFullScreenCall();
    isAudioMuted.value = false;
  });

  it('starts in full screen call mode and ready for conversational voice', () => {
    const {isFullScreen, isAudioMuted} = useAlexLiveCall();
    expect(isFullScreen.value).toBe(true);
    expect(isAudioMuted.value).toBe(false);
  });

  it('minimizes to top dock and expands back to full screen', () => {
    const {isFullScreen, minimizeToTopDock, openFullScreenCall} = useAlexLiveCall();

    minimizeToTopDock();
    expect(isFullScreen.value).toBe(false);

    openFullScreenCall();
    expect(isFullScreen.value).toBe(true);
  });

  it('toggles audio mute state cleanly', () => {
    const {isAudioMuted, toggleAudioMute} = useAlexLiveCall();
    isAudioMuted.value = false;

    toggleAudioMute();
    expect(isAudioMuted.value).toBe(true);

    toggleAudioMute();
    expect(isAudioMuted.value).toBe(false);
  });

  it('converts structured markdown text into natural spoken conversational Vietnamese', () => {
    const raw = `### 3 Việc quan trọng hôm nay:
- **Ưu tiên 1**: Review pull request \`auth-guard.ts\`.
- **Ưu tiên 2**: Luyện tập [bài học hôm nay](https://example.com).
1. Uu tiên 3: Hoàn thành deadline.`;

    const spoken = convertTextToNaturalSpokenVietnamese(raw);
    expect(spoken).not.toContain('###');
    expect(spoken).not.toContain('**');
    expect(spoken).not.toContain('`');
    expect(spoken).not.toContain('[');
    expect(spoken).not.toContain('http');
    expect(spoken).toContain('3 Việc quan trọng hôm nay');
    expect(spoken).toContain('Ưu tiên 1: Review pull request');
  });

  it('stops Alex speaking immediately when stopAlexSpeaking is invoked', async () => {
    const {callState, stopAlexSpeaking} = useAlexLiveCall();
    callState.value = 'speaking';

    await stopAlexSpeaking();
    expect(callState.value).toBe('idle');
  });
});
