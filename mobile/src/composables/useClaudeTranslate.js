import Anthropic from '@anthropic-ai/sdk';
import {z} from 'zod';
import {zodOutputFormat} from '@anthropic-ai/sdk/helpers/zod';

// Chosen for real-time conversational latency (user's explicit choice —
// see the plan's Global Constraints — over the claude-api skill's
// claude-opus-5 default).
const MODEL = 'claude-haiku-4-5';

const SYSTEM_PROMPT = `You are helping a Vietnamese parent with limited
English vocabulary say things to their children in natural English. You
will receive a Vietnamese sentence — possibly a rough speech-to-text
transcription that may contain minor recognition errors. Infer the
parent's likely intent charitably (there is nothing grammatically wrong
with the Vietnamese; any oddness is transcription noise, not a mistake to
correct in Vietnamese).

Produce:
1. A short, natural English sentence a parent would actually say out loud
   to a child in that situation — not a stiff textbook translation.
2. Its IPA phonetic transcription.
3. A short explanation, written in Vietnamese, of any notable word choice
   or phrasing decision — something that helps the parent learn, not just
   a restatement of the sentence.`;

const TranslateResultSchema = z.object({
  englishSentence: z
    .string()
    .describe(
      'A short, natural spoken English sentence for a parent to say to their child.',
    ),
  ipa: z
    .string()
    .describe(
      'IPA phonetic transcription of englishSentence, e.g. "/wɛərz jʊər ʃuz/".',
    ),
  explanation: z
    .string()
    .describe(
      'Short Vietnamese-language explanation of the translation or phrasing choice.',
    ),
});

/**
 * Pure extraction step, isolated for testing: given a Claude API response
 * from messages.parse(), returns the validated result or throws with the
 * response's stop_reason so a caller can show a meaningful error instead
 * of a blank screen.
 */
export function extractTranslateResult(response) {
  if (!response.parsed_output) {
    throw new Error(
      `Claude did not return a structured translation (stop_reason: ${response.stop_reason}).`,
    );
  }
  return response.parsed_output;
}

export async function translateToEnglish(vietnameseText, apiKey) {
  if (!apiKey) {
    throw new Error('No Claude API key configured.');
  }
  const client = new Anthropic({apiKey, dangerouslyAllowBrowser: true});
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{role: 'user', content: vietnameseText}],
    output_config: {format: zodOutputFormat(TranslateResultSchema)},
  });
  return extractTranslateResult(response);
}
