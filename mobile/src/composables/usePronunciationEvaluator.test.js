import {describe, it, expect} from 'vitest';
import {
  normalizeText,
  levenshtein,
  stringSimilarity,
  evaluatePronunciation,
} from './usePronunciationEvaluator.js';

describe('usePronunciationEvaluator', () => {
  describe('normalizeText', () => {
    it('normalizes contractions, casing and removes punctuation', () => {
      const input = "I'm a senior engineer, and we'll build scalable AI systems!";
      const words = normalizeText(input);
      expect(words).toEqual([
        'i',
        'am',
        'a',
        'senior',
        'engineer',
        'and',
        'we',
        'will',
        'build',
        'scalable',
        'ai',
        'systems',
      ]);
    });
  });

  describe('levenshtein & stringSimilarity', () => {
    it('calculates distance and similarity correctly', () => {
      expect(levenshtein('security', 'security')).toBe(0);
      expect(stringSimilarity('security', 'security')).toBe(1.0);

      expect(levenshtein('pipeline', 'pipelne')).toBe(1);
      expect(stringSimilarity('pipeline', 'pipelne')).toBeCloseTo(0.875, 2);
    });
  });

  describe('evaluatePronunciation', () => {
    it('scores 100% and marks passed for accurate speech', () => {
      const target = 'I specialize in building scalable backend systems.';
      const spoken = "I specialize in building scalable backend systems.";
      const result = evaluatePronunciation(target, spoken);

      expect(result.score).toBe(100);
      expect(result.passed).toBe(true);
      expect(result.stats.correct).toBe(result.stats.total);
      expect(result.stats.missed).toBe(0);
    });

    it('handles minor deviations with close status and calculates score', () => {
      const target = 'We build adversarial machine learning pipelines.';
      // Spoken has minor mispronunciation
      const spoken = 'We build adversary machine learning pipeline.';
      const result = evaluatePronunciation(target, spoken);

      expect(result.score).toBeGreaterThan(70);
      expect(result.passed).toBe(true);
      expect(result.breakdown.some((b) => b.status === 'close' || b.status === 'correct')).toBe(true);
    });

    it('marks failed when speech is incomplete or largely missed', () => {
      const target = 'Adversarial prompt injection vulnerabilities in large language models.';
      const spoken = 'Prompt models.';
      const result = evaluatePronunciation(target, spoken);

      expect(result.score).toBeLessThan(70);
      expect(result.passed).toBe(false);
      expect(result.stats.missed).toBeGreaterThan(0);
    });

    it('handles empty input gracefully', () => {
      const target = 'Hello world';
      const spoken = '';
      const result = evaluatePronunciation(target, spoken);

      expect(result.score).toBe(0);
      expect(result.passed).toBe(false);
      expect(result.stats.missed).toBe(2);
    });
  });
});
