import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import AlexLiveCallOverlay from './AlexLiveCallOverlay.vue';
import {useAlexLiveCall} from '../../composables/useAlexLiveCall.js';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('AlexLiveCallOverlay', () => {
  it('renders full-screen voice call with clean subtitles and living voice orb', () => {
    const {openFullScreenCall} = useAlexLiveCall();
    openFullScreenCall();

    const wrapper = mount(AlexLiveCallOverlay);
    expect(wrapper.find('.alex-live-call').exists()).toBe(true);
    expect(wrapper.text()).toContain('Alex Live');
    expect(wrapper.text()).toContain('Xin chào Robert! Hôm nay chúng ta cần giải quyết những việc gì?');
    expect(wrapper.find('.alex-live-call__orb').exists()).toBe(true);
  });

  it('provides slide-up features drawer to navigate to features and minimize', async () => {
    const wrapper = mount(AlexLiveCallOverlay);
    // Open drawer
    const drawerBtn = wrapper.findAll('.alex-live-call__ctrl-btn')[1];
    await drawerBtn.trigger('click');

    expect(wrapper.find('.alex-live-call__drawer-card').exists()).toBe(true);
    expect(wrapper.text()).toContain('Bài học hôm nay');
    expect(wrapper.text()).toContain('Luyện nói tiếng Anh');
  });

  it('allows minimizing to top dock via close button', async () => {
    const {isFullScreen} = useAlexLiveCall();
    const wrapper = mount(AlexLiveCallOverlay);

    const minBtn = wrapper.find('.alex-live-call__pill-btn--close');
    await minBtn.trigger('click');

    expect(isFullScreen.value).toBe(false);
  });
});
