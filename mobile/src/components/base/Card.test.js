// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import Card from './Card.vue';

describe('Card', () => {
  it('renders slot content inside the card wrapper', () => {
    const wrapper = mount(Card, {slots: {default: '<p>Hello</p>'}});
    expect(wrapper.find('.card p').text()).toBe('Hello');
  });
});
