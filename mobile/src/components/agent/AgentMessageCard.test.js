import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import AgentMessageCard from './AgentMessageCard.vue';

describe('AgentMessageCard', () => {
  it('renders user message', () => {
    const message = {
      id: 'm1',
      role: 'user',
      content: 'Xin chào AI Co-pilot',
      timestamp: new Date().toISOString(),
    };

    const wrapper = mount(AgentMessageCard, {
      props: {message, channelId: 'companion'},
    });

    expect(wrapper.text()).toContain('Xin chào AI Co-pilot');
    expect(wrapper.text()).toContain('Bạn');
  });

  it('renders model message with persona badge and thinking trace', () => {
    const message = {
      id: 'm2',
      role: 'model',
      content: 'Chào bạn, tôi sẵn sàng hỗ trợ!',
      thinking: null,
      toolsExecuted: [
        {toolName: 'manage_tasks', executionMs: 15},
      ],
      timestamp: new Date().toISOString(),
    };

    const wrapper = mount(AgentMessageCard, {
      props: {message, channelId: 'companion'},
    });

    expect(wrapper.text()).toContain('Chào bạn, tôi sẵn sàng hỗ trợ!');
    expect(wrapper.text()).toContain('Alex');
    expect(wrapper.text()).toContain('Đã thực thi 1 công cụ');
  });
});
