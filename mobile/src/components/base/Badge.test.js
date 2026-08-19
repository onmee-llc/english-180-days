// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import Badge from './Badge.vue';

describe('Badge', () => {
  it('renders icon and label', () => {
    const wrapper = mount(Badge, {props: {icon: '🔥', label: '3-day streak'}});
    expect(wrapper.text()).toContain('🔥');
    expect(wrapper.text()).toContain('3-day streak');
  });

  it('applies the earned class only when earned is true', () => {
    const unearned = mount(Badge, {
      props: {icon: '🔥', label: '3-day streak'},
    });
    expect(unearned.classes()).not.toContain('badge--earned');

    const earned = mount(Badge, {
      props: {icon: '🔥', label: '3-day streak', earned: true},
    });
    expect(earned.classes()).toContain('badge--earned');
  });
});
