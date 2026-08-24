import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import AgentPromptBar from './AgentPromptBar.vue';

describe('AgentPromptBar', () => {
  it('renders quick action chips for active persona', () => {
    const wrapper = mount(AgentPromptBar, {
      props: {
        channelId: 'companion',
        isStreaming: false,
        isRecording: false,
      },
    });

    const chips = wrapper.findAll('.agent-prompt-bar__chip');
    expect(chips.length).toBeGreaterThan(0);
    expect(chips[0].text()).toContain("Today's Priorities");
  });

  it('emits send-prompt when submitting input', async () => {
    const wrapper = mount(AgentPromptBar, {
      props: {
        channelId: 'companion',
        isStreaming: false,
        isRecording: false,
      },
    });

    const textarea = wrapper.find('textarea');
    await textarea.setValue('Tạo task review code');
    await wrapper.find('.agent-prompt-bar__send-btn').trigger('click');

    expect(wrapper.emitted('send-prompt')).toBeTruthy();
    expect(wrapper.emitted('send-prompt')[0][0]).toEqual({
      prompt: 'Tạo task review code',
      mode: 'stream',
    });
  });

  it('switches execution mode between stream and background', async () => {
    const wrapper = mount(AgentPromptBar, {
      props: {
        channelId: 'companion',
        isStreaming: false,
        isRecording: false,
      },
    });

    const modeBtns = wrapper.findAll('.agent-prompt-bar__mode-btn');
    expect(modeBtns.length).toBe(2);

    await modeBtns[1].trigger('click'); // Background mode

    const textarea = wrapper.find('textarea');
    await textarea.setValue('Phân tích chuyên sâu');
    await wrapper.find('.agent-prompt-bar__send-btn').trigger('click');

    expect(wrapper.emitted('send-prompt')[0][0].mode).toBe('background');
  });
});
