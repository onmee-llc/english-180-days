// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import BaseButton from './BaseButton.vue';

describe('BaseButton', () => {
  it('renders the default slot as its label', () => {
    const wrapper = mount(BaseButton, {slots: {default: 'Sign in'}});
    expect(wrapper.text()).toBe('Sign in');
  });

  it('applies the variant and tone classes', () => {
    const wrapper = mount(BaseButton, {
      props: {variant: 'outline', tone: 'coral'},
    });
    expect(wrapper.classes()).toContain('base-button--outline');
    expect(wrapper.classes()).toContain('base-button--coral');
  });

  it('disables the button and swaps to loadingLabel while loading', () => {
    const wrapper = mount(BaseButton, {
      props: {loading: true, loadingLabel: 'Signing in…'},
      slots: {default: 'Sign in with Google', icon: '<svg />'},
    });
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.text()).toBe('Signing in…');
    expect(wrapper.find('svg').exists()).toBe(false);
  });

  it('emits a native click to a parent listener when enabled', async () => {
    const wrapper = mount(BaseButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
