// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import TextField from './TextField.vue';

describe('TextField', () => {
  it('binds modelValue and emits update:modelValue on input', async () => {
    const wrapper = mount(TextField, {
      props: {modelValue: '', label: 'Gemini API key', id: 'api-key'},
    });
    await wrapper.find('input').setValue('AIzaTest');
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['AIzaTest']);
  });

  it('shows the hint by default and swaps to the error when set', async () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Gemini API key',
        id: 'api-key',
        hint: 'Stored on this device.',
      },
    });
    expect(wrapper.text()).toContain('Stored on this device.');
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('false');

    await wrapper.setProps({error: 'Could not save the key.'});
    expect(wrapper.text()).not.toContain('Stored on this device.');
    expect(wrapper.text()).toContain('Could not save the key.');
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
  });

  it('renders the success status line when set', () => {
    const wrapper = mount(TextField, {
      props: {label: 'Gemini API key', id: 'api-key', success: '✓ Saved'},
    });
    const status = wrapper.find('[role="status"]');
    expect(status.exists()).toBe(true);
    expect(status.text()).toBe('✓ Saved');
  });

  it('forwards native attributes to the input', () => {
    const wrapper = mount(TextField, {
      props: {label: 'Gemini API key', id: 'api-key'},
      attrs: {placeholder: 'AIza...', autocomplete: 'off'},
    });
    expect(wrapper.find('input').attributes('placeholder')).toBe('AIza...');
    expect(wrapper.find('input').attributes('autocomplete')).toBe('off');
  });
});
