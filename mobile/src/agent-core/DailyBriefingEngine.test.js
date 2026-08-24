import {describe, it, expect} from 'vitest';
import {DailyBriefingEngine, BRIEFING_PILLARS} from './DailyBriefingEngine.js';

describe('DailyBriefingEngine', () => {
  it('generates a full multi-pillar daily briefing with default preferences', async () => {
    const mockMemory = {
      getTasks: () => [
        {id: '1', title: 'Hoàn thiện Agent Runtime', completed: false},
        {id: '2', title: 'Review PR #42', completed: false},
      ],
    };
    const mockMastery = {
      getStats: () => ({streak: 45, xp: 5100, level: 14}),
    };

    const engine = new DailyBriefingEngine({
      memoryStore: mockMemory,
      masteryStore: mockMastery,
    });

    const briefing = await engine.generateBriefing();

    expect(briefing).toBeDefined();
    expect(briefing.greeting).toContain('Robert');
    expect(briefing.pillars).toHaveLength(4);

    const workPillar = briefing.pillars.find((p) => p.id === BRIEFING_PILLARS.WORK);
    expect(workPillar).toBeDefined();
    expect(workPillar.items.some((i) => i.includes('2 nhiệm vụ'))).toBe(true);

    const masteryPillar = briefing.pillars.find((p) => p.id === BRIEFING_PILLARS.MASTERY);
    expect(masteryPillar.badge).toContain('45 ngày streak');

    expect(briefing.spokenScript).toBeDefined();
    expect(typeof briefing.spokenScript).toBe('string');
  });

  it('respects user-customized pillar preferences', async () => {
    const engine = new DailyBriefingEngine({
      preferences: {
        pillars: [BRIEFING_PILLARS.WORK, BRIEFING_PILLARS.MARKET],
      },
    });

    const briefing = await engine.generateBriefing();

    expect(briefing.pillars).toHaveLength(2);
    expect(briefing.pillars.map((p) => p.id)).toEqual([
      BRIEFING_PILLARS.WORK,
      BRIEFING_PILLARS.MARKET,
    ]);
  });

  it('updates preferences dynamically', () => {
    const engine = new DailyBriefingEngine();
    engine.setPreferences({marketWatchlist: ['ETH', 'SOL']});
    expect(engine.getPreferences().marketWatchlist).toEqual(['ETH', 'SOL']);
  });

  it('synthesizes critical decisions on-demand from personal life profile', async () => {
    const mockMemory = {
      getTasks: () => [],
      getFinancialProfile: () => ({
        debtSchedule: [{lender: 'Shinhan Bank', rate: 14.5, minPayment: 15000000}],
      }),
      getProjectsProfile: () => ({
        activeProjects: [{name: 'Daily Mastery Mobile', priority: 'P0'}],
      }),
      getFamilyProfile: () => ({
        importantDates: [{label: 'Sinh nhật', date: '10-15'}],
      }),
    };

    const engine = new DailyBriefingEngine({memoryStore: mockMemory});
    const briefing = await engine.generateBriefing();

    expect(briefing.criticalDecisions).toBeDefined();
    expect(briefing.criticalDecisions.length).toBe(3);
    expect(briefing.spokenScript).toContain('3 quyết định cần bạn xử lý');
  });
});
