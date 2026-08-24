import {describe, it, expect} from 'vitest';
import {AdaptiveLearningEngine, STYLE_TRAITS} from './AdaptiveLearningEngine.js';

describe('AdaptiveLearningEngine', () => {
  it('ingests user feedback and mutates learned traits', () => {
    let savedProfile = null;
    const mockMemory = {
      getProfile: () => ({preferences: {}}),
      updateProfile: (p) => {
        savedProfile = p;
      },
    };

    const engine = new AdaptiveLearningEngine({memoryStore: mockMemory});

    const result = engine.ingestInteraction('Alex hãy trả lời thật ngắn gọn và súc tích bằng bullet points nhé');
    expect(result.adapted).toBe(true);
    expect(result.traits).toContain(STYLE_TRAITS.CONCISE);
    expect(savedProfile).toBeDefined();
  });

  it('generates system prompt style augmentation', () => {
    const engine = new AdaptiveLearningEngine();
    const augmentation = engine.generateStyleAugmentation();

    expect(augmentation).toContain('[ADAPTIVE USER STYLE & PERSONALIZATION]');
    expect(augmentation).toContain('Robert');
    expect(augmentation).toContain('súc tích');
  });

  it('returns metrics correctly', () => {
    const engine = new AdaptiveLearningEngine();
    const metrics = engine.getMetrics();

    expect(metrics.traitsCount).toBeGreaterThan(0);
    expect(metrics.lastAdaptedAt).toBeDefined();
  });
});
