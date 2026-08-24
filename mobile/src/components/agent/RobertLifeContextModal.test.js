import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import RobertLifeContextModal from './RobertLifeContextModal.vue';

describe('RobertLifeContextModal', () => {
  const mockMemory = {
    getProfile: () => ({
      name: 'Robert',
      title: 'Senior Principal Engineer',
      financialProfile: {
        monthlyCashflow: {primaryIncome: '120.000.000 ₫', essentialBurnRate: '35.000.000 ₫'},
        debts: [{id: 'd1', name: 'Khoản nợ A', amount: '50.000.000 ₫', rate: '8.5%', payment: '5.000.000 ₫'}],
      },
    }),
    updateProfile: vi.fn(),
  };

  const mockJournal = {
    getDecisions: () => [
      {
        id: 'dec_1',
        category: 'architecture',
        situation: 'Decoupled Engine vs Vue Pinia',
        decisionMade: 'Decoupled Vanilla JS',
        rationale: 'Clean testability and native portability',
        tradeoffsAccepted: 'Requires bridge layer',
        timestamp: '2026-08-20T00:00:00.000Z',
      },
    ],
    addDecision: vi.fn(),
  };

  it('renders modal when isOpen is true and defaults to Decisions Table', () => {
    const wrapper = mount(RobertLifeContextModal, {
      props: {
        isOpen: true,
        memoryStore: mockMemory,
        decisionJournal: mockJournal,
      },
    });

    expect(wrapper.text()).toContain('Hồ Sơ Cuộc Sống Cá Nhân Của Robert');
    expect(wrapper.find('.vault-modal__sheet').exists()).toBe(true);
    expect(wrapper.text()).toContain('Decisions Table (Training Signal)');
    expect(wrapper.text()).toContain('Decoupled Engine vs Vue Pinia');
  });

  it('allows tab navigation across finance, personality, projects, and family', async () => {
    const wrapper = mount(RobertLifeContextModal, {
      props: {
        isOpen: true,
        memoryStore: mockMemory,
        decisionJournal: mockJournal,
      },
    });

    const tabs = wrapper.findAll('.vault-modal__tab');
    expect(tabs.length).toBe(6);

    // Switch to finance tab
    await tabs[1].trigger('click');
    expect(wrapper.text()).toContain('Thu nhập hàng tháng (Dòng tiền vào)');

    // Switch to personality tab
    await tabs[2].trigger('click');
    expect(wrapper.text()).toContain('Khung giờ tập trung đỉnh cao');

    // Switch to projects tab
    await tabs[3].trigger('click');
    expect(wrapper.text()).toContain('Daily Mastery & Alex AI');
  });

  it('saves profile updates to memoryStore', async () => {
    const wrapper = mount(RobertLifeContextModal, {
      props: {
        isOpen: true,
        memoryStore: mockMemory,
        decisionJournal: mockJournal,
      },
    });

    const saveBtn = wrapper.find('.vault-save-btn');
    await saveBtn.trigger('click');

    expect(mockMemory.updateProfile).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Đã lưu mã hóa an toàn');
  });

  it('emits ask-alex and close when clicking a quick ask button', async () => {
    const wrapper = mount(RobertLifeContextModal, {
      props: {
        isOpen: true,
        memoryStore: mockMemory,
        decisionJournal: mockJournal,
      },
    });

    const askBtn = wrapper.find('.vault-ask-btn');
    expect(askBtn.exists()).toBe(true);
    await askBtn.trigger('click');

    expect(wrapper.emitted('ask-alex')).toBeDefined();
    expect(wrapper.emitted('close')).toBeDefined();
  });
});
