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

  it('extracts pure spoken English and strips Vietnamese translation notes from audio TTS', () => {
    const raw = `Hello Robert! I am doing great today.
(Tiếng Việt: Chào Robert! Hôm nay tôi rất khỏe.)
- **Tip**: Practice saying "Decoupled Architecture".`;

    const spoken = convertTextToNaturalSpokenVietnamese(raw);
    expect(spoken).not.toContain('###');
    expect(spoken).not.toContain('**');
    expect(spoken).not.toContain('`');
    expect(spoken).not.toContain('Chào Robert');
    expect(spoken).toContain('Hello Robert');
    expect(spoken).toContain('Practice saying');
    expect(spoken).toContain('Decoupled Architecture');
  });

  it('stops Alex speaking immediately when stopAlexSpeaking is invoked', async () => {
    const {callState, stopAlexSpeaking} = useAlexLiveCall();
    callState.value = 'speaking';

    await stopAlexSpeaking();
    expect(callState.value).toBe('idle');
  });

  it('cleans raw markdown, hashes, bullet points and bold markers for spoken dialogue', () => {
    const raw = `### Priorities for today:
- **Priority 1**: Build streaming TTS.
- **Priority 2**: Optimize latency.
💡 In natural English: "Let us optimize the pipeline."`;

    const cleaned = convertTextToNaturalSpokenVietnamese(raw);
    expect(cleaned).not.toContain('###');
    expect(cleaned).not.toContain('**');
    expect(cleaned).not.toContain('- ');
    expect(cleaned).not.toContain('💡');
    expect(cleaned).toContain('Priorities for today');
    expect(cleaned).toContain('Build streaming TTS');
  });
});
