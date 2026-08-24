import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import AgentActionCard from './AgentActionCard.vue';

describe('AgentActionCard', () => {
  it('renders task list card and emits toggle-task', async () => {
    const card = {
      type: 'TASK_LIST',
      tasks: [
        {id: 't1', title: 'Task One', completed: false, category: 'work'},
      ],
    };

    const wrapper = mount(AgentActionCard, {
      props: {card},
    });

    expect(wrapper.text()).toContain('Task One');
    expect(wrapper.text()).toContain('Action Items');

    await wrapper.find('.card-task__item').trigger('click');
    expect(wrapper.emitted('toggle-task')).toBeTruthy();
  });

  it('renders code snippet card and code', () => {
    const card = {
      type: 'CODE_SNIPPET',
      language: 'javascript',
      code: 'const x = 10;',
      runnable: true,
    };

    const wrapper = mount(AgentActionCard, {
      props: {card},
    });

    expect(wrapper.text()).toContain('const x = 10;');
    expect(wrapper.text().toLowerCase()).toContain('javascript');
  });

  it('renders audio memo card', () => {
    const card = {
      type: 'AUDIO_MEMO',
      title: 'Practice Phrase',
      ipa: '/ˌæk.sɪˈzɪʃ.ən/',
      text: 'Acquisition',
    };

    const wrapper = mount(AgentActionCard, {
      props: {card},
    });

    expect(wrapper.text()).toContain('Practice Phrase');
    expect(wrapper.text()).toContain('/ˌæk.sɪˈzɪʃ.ən/');
  });

  it('renders git diff card and emits commit-diff', async () => {
    const card = {
      type: 'GIT_DIFF',
      branch: 'feature/alex-auth',
      file: 'src/auth.js',
      diff: '+ const token = "abc";',
    };

    const wrapper = mount(AgentActionCard, {
      props: {card},
    });

    expect(wrapper.text()).toContain('feature/alex-auth');
    expect(wrapper.text()).toContain('src/auth.js');
    expect(wrapper.text()).toContain('Approve & Commit');

    await wrapper.find('.card-diff__btn--commit').trigger('click');
    expect(wrapper.emitted('commit-diff')).toBeTruthy();
  });

  it('renders agent dispatch card for Antigravity or Claude Code', () => {
    const card = {
      type: 'AGENT_DISPATCH',
      engine: {name: 'Google Antigravity', badge: 'AGY Engine'},
      taskTitle: 'Refactor Database Models',
      logs: ['[AGY] Analyzing models...', '[AGY] Done.'],
    };

    const wrapper = mount(AgentActionCard, {
      props: {card},
    });

    expect(wrapper.text()).toContain('Google Antigravity');
    expect(wrapper.text()).toContain('Refactor Database Models');
    expect(wrapper.text()).toContain('[AGY] Analyzing models...');
  });
});
