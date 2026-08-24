import {describe, it, expect, vi} from 'vitest';
import {mount, flushPromises} from '@vue/test-utils';
import AlexTalkHomeView from './AlexTalkHomeView.vue';

// Mock dependencies
vi.mock('../composables/useApiKey.js', () => ({
  useApiKey: () => ({
    apiKey: {value: 'test-key'},
    init: vi.fn(),
  }),
}));

vi.mock('../composables/useMasteryPoints.js', () => ({
  useMasteryPoints: () => ({
    totalXp: {value: 4520},
    currentLevel: {value: {level: 12}},
    addXp: vi.fn(),
  }),
  XP_REWARDS: {SPEAK_SESSION: 10},
}));

vi.mock('../composables/useProgress.js', () => ({
  useProgress: () => ({
    progress: {value: {streak: {'2026-08-24': true}}},
  }),
}));

vi.mock('../composables/useAudioRecorder.js', () => ({
  useAudioRecorder: () => ({
    status: {value: 'idle'},
    startRecording: vi.fn(),
    stopRecording: vi.fn().mockResolvedValue(new Blob([])),
  }),
}));

vi.mock('../composables/useSpeechAudio.js', () => ({
  playTtsAudio: vi.fn().mockResolvedValue(true),
  stopTtsAudio: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('AlexTalkHomeView', () => {
  it('renders correctly as the first landing screen with default MUTED audio', async () => {
    const wrapper = mount(AlexTalkHomeView);

    // 1. Verify screen greeting
    expect(wrapper.text()).toContain('Alex · Trợ lý cá nhân của Robert');

    // 2. Verify sound output is MUTED by default
    const audioBtn = wrapper.find('.alex-home__audio-btn');
    expect(audioBtn.exists()).toBe(true);
    expect(audioBtn.text()).toContain('Tắt âm');

    // 3. Verify toggling audio state
    await audioBtn.trigger('click');
    expect(audioBtn.text()).toContain('Bật âm');
  });

  it('renders daily briefing pillars and allows tab switching', async () => {
    const wrapper = mount(AlexTalkHomeView);
    await flushPromises();

    // Verify briefing section
    const briefingSection = wrapper.find('.alex-home__briefing-card');
    expect(briefingSection.exists()).toBe(true);
    expect(wrapper.text()).toContain('Báo Cáo Điều Hành Hôm Nay');

    // Verify pillar tabs exist
    const tabs = wrapper.findAll('.alex-home__pillar-tab');
    expect(tabs.length).toBeGreaterThanOrEqual(2);
  });

  it('toggles collapsible text input bar cleanly', async () => {
    const wrapper = mount(AlexTalkHomeView);

    // Initial state: collapsed
    const typeBtn = wrapper.find('.alex-home__type-btn');
    expect(typeBtn.exists()).toBe(true);
    expect(wrapper.find('textarea').exists()).toBe(false);

    // Click to expand text input
    await typeBtn.trigger('click');
    expect(wrapper.find('textarea').exists()).toBe(true);

    // Click close button to collapse
    const closeBtn = wrapper.find('.alex-home__control-btn');
    await closeBtn.trigger('click');
    expect(wrapper.find('textarea').exists()).toBe(false);
  });
});
