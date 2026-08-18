import {describe, it, expect} from 'vitest';
import {extractTranslateResult} from './useGeminiTranslate.js';

describe('extractTranslateResult', () => {
  it('returns the parsed JSON when text is present', () => {
    const parsed = {
      vietnameseText: 'giày của con đâu rồi',
      englishSentence: 'Where are your shoes?',
      ipa: '/wɛərz jʊər ʃuz/',
      explanation: 'Dùng "where are" vì hỏi vị trí của vật.',
    };
    const response = {text: JSON.stringify(parsed)};
    expect(extractTranslateResult(response)).toEqual(parsed);
  });

  it('throws with the finishReason when text is missing', () => {
    const response = {text: undefined, candidates: [{finishReason: 'SAFETY'}]};
    expect(() => extractTranslateResult(response)).toThrow(/SAFETY/);
  });
});
