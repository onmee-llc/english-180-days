import {describe, it, expect} from 'vitest';
import {DecisionJournalStore, DECISION_CATEGORIES} from './DecisionJournalStore.js';

describe('DecisionJournalStore', () => {
  it('loads default seeded decisions correctly', () => {
    const store = new DecisionJournalStore();
    const decisions = store.getDecisions();

    expect(decisions.length).toBeGreaterThanOrEqual(4);
    expect(decisions.some((d) => d.tags.includes('decoupling'))).toBe(true);
    expect(decisions.some((d) => d.tags.includes('avalanche'))).toBe(true);
  });

  it('appends a new decision record immutably', () => {
    const store = new DecisionJournalStore();
    const initialCount = store.getDecisions().length;

    const newDec = store.addDecision({
      category: DECISION_CATEGORIES.ENGINEERING,
      situation: 'Lựa chọn database cho lưu trữ ghi chú: SQLite vs IndexedDB',
      optionsConsidered: ['IndexedDB', 'SQLite with WebAssembly'],
      decisionMade: 'Chọn SQLite Local',
      rationale: 'Hỗ trợ truy vấn SQL chuẩn và mở rộng vector search.',
      tradeoffsAccepted: 'Cần nạp thêm file wasm ~1.2MB.',
      tags: ['database', 'sqlite', 'performance'],
    });

    expect(newDec.id).toBeDefined();
    expect(newDec.timestamp).toBeDefined();
    expect(store.getDecisions().length).toBe(initialCount + 1);
    expect(store.getDecisions()[0].id).toBe(newDec.id);
  });

  it('updates decision outcome without losing original rationale', () => {
    const store = new DecisionJournalStore();
    const decisions = store.getDecisions();
    const targetId = decisions[0].id;
    const originalRationale = decisions[0].rationale;

    const updated = store.recordOutcome(targetId, {
      outcome: 'Đã hoàn thành và mang lại hiệu quả vượt trội.',
      learnings: 'Nên tiếp tục duy trì nguyên tắc này.',
    });

    expect(updated).toBeDefined();
    expect(updated.outcome).toContain('vượt trội');
    expect(updated.rationale).toBe(originalRationale);
  });

  it('searches relevant decisions and formats context string for Alex', () => {
    const store = new DecisionJournalStore();

    const results = store.searchRelevantDecisions('trả nợ lãi suất cao');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe(DECISION_CATEGORIES.FINANCE);

    const contextStr = store.formatDecisionsForContext('kiến trúc decoupled');
    expect(contextStr).toContain("[ROBERT'S HISTORICAL DECISIONS & MENTAL MODELS (TRAINING SIGNAL)]");
    expect(contextStr.toLowerCase()).toContain('decoupled');
  });
});
