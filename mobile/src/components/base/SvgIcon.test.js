import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import SvgIcon from './SvgIcon.vue';

describe('SvgIcon', () => {
  it('renders svg icon with custom size and stroke', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        name: 'spark',
        size: 20,
        color: '#3d4ee8',
      },
    });

    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.attributes('style')).toContain('width: 20px');
    expect(wrapper.attributes('style')).toContain('height: 20px');
    expect(wrapper.attributes('style')).toContain('#3d4ee8');
  });

  it('renders different icon names accurately', () => {
    const names = ['code', 'voice', 'chart', 'inbox', 'bolt', 'gear', 'task-check', 'play', 'stop'];
    names.forEach((name) => {
      const wrapper = mount(SvgIcon, {props: {name}});
      expect(wrapper.find('svg').exists()).toBe(true);
    });
  });
});
