import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import AgentSidebar from './AgentSidebar.vue';

describe('AgentSidebar', () => {
  it('renders channels list', () => {
    const wrapper = mount(AgentSidebar, {
      props: {
        activeChannelId: 'companion',
        runningTasksCount: 2,
        isOpen: true,
      },
    });

    expect(wrapper.text()).toContain('Daily Mastery');
    expect(wrapper.text()).toContain('KÊNH TRỢ LÝ');
    expect(wrapper.text()).toContain('Daily Companion');
    expect(wrapper.text()).toContain('2 tác vụ');
  });

  it('emits select-channel on clicking a channel item', async () => {
    const wrapper = mount(AgentSidebar, {
      props: {
        activeChannelId: 'companion',
        runningTasksCount: 0,
        isOpen: true,
      },
    });

    const items = wrapper.findAll('.agent-sidebar__item');
    expect(items.length).toBeGreaterThan(1);

    await items[1].trigger('click');
    expect(wrapper.emitted('select-channel')).toBeTruthy();
    expect(wrapper.emitted('select-channel')[0][0]).toBe('engineering');
  });
});
