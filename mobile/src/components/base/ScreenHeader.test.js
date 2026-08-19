// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import ScreenHeader from './ScreenHeader.vue';

describe('ScreenHeader', () => {
  it('renders eyebrow and title', () => {
    const wrapper = mount(ScreenHeader, {
      props: {eyebrow: 'SETTINGS', title: 'Settings'},
    });
    expect(wrapper.find('.screen-header__eyebrow').text()).toBe('SETTINGS');
    expect(wrapper.find('.screen-header__title').text()).toBe('Settings');
  });

  it('renders no subtitle element when omitted', () => {
    const wrapper = mount(ScreenHeader, {
      props: {eyebrow: 'SETTINGS', title: 'Settings'},
    });
    expect(wrapper.find('.screen-header__subtitle').exists()).toBe(false);
  });

  it('renders the subtitle when provided', () => {
    const wrapper = mount(ScreenHeader, {
      props: {
        eyebrow: 'SIGN IN',
        title: 'Daily Mastery',
        subtitle: 'Sign in to continue.',
      },
    });
    expect(wrapper.find('.screen-header__subtitle').text()).toBe(
      'Sign in to continue.',
    );
  });
});
