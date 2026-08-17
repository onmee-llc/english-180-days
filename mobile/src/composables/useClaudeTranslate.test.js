import {describe, it, expect} from 'vitest';
import {extractTranslateResult} from './useClaudeTranslate.js';

describe('extractTranslateResult', () => {
  it('returns parsed_output when present', () => {
    const response = {
      stop_reason: 'end_turn',
      parsed_output: {
        englishSentence: 'Where are your shoes?',
        ipa: '/wɛərz jʊər ʃuz/',
        explanation: 'Dùng "where are" vì hỏi vị trí của vật.',
      },
    };
    expect(extractTranslateResult(response)).toEqual(response.parsed_output);
  });

  it('throws with the stop_reason when parsed_output is missing', () => {
    const response = {stop_reason: 'refusal', parsed_output: null};
    expect(() => extractTranslateResult(response)).toThrow(/refusal/);
  });
});
