import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import AlexTopDockCoPilot from './AlexTopDockCoPilot.vue';
import {useAlexLiveCall} from '../../composables/useAlexLiveCall.js';

describe('AlexTopDockCoPilot', () => {
  it('renders mini top-dock when not full-screen', () => {
    const {minimizeToTopDock} = useAlexLiveCall();
    minimizeToTopDock();

    const wrapper = mount(AlexTopDockCoPilot);
    expect(wrapper.find('.alex-top-dock').exists()).toBe(true);
    expect(wrapper.text()).toContain('Alex');
    expect(wrapper.find('.alex-top-dock__pill').exists()).toBe(true);
  });

  it('expands to full screen call when tapped', async () => {
    const {minimizeToTopDock, isFullScreen} = useAlexLiveCall();
    minimizeToTopDock();

    const wrapper = mount(AlexTopDockCoPilot);
    await wrapper.find('.alex-top-dock__pill').trigger('click');

    expect(isFullScreen.value).toBe(true);
  });
});
