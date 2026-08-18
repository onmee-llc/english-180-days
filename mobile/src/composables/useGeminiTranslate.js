import {GoogleGenAI} from '@google/genai';

// Cost-sensitive, high-volume tier — swapped in for real-time conversational
// latency after claude-haiku-4-5 was lagging under repeated Speak use.
const MODEL = 'gemini-3.1-flash-lite';

const SYSTEM_PROMPT = `You are helping a Vietnamese parent with limited
English vocabulary say things to their children in natural English. You
will receive a short audio recording of the parent speaking Vietnamese —
the recording may have background noise or be hard to make out in places.
Infer the parent's likely intent charitably (there is nothing grammatically
wrong with the Vietnamese; any oddness is recording noise, not a mistake to
correct in Vietnamese).

Produce:
1. A literal transcription of the Vietnamese audio.
2. A short, natural English sentence a parent would actually say out loud
   to a child in that situation — not a stiff textbook translation.
3. Its IPA phonetic transcription.
4. A short explanation, written in Vietnamese, of any notable word choice
   or phrasing decision — something that helps the parent learn, not just
   a restatement of the sentence.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    vietnameseText: {
      type: 'string',
      description: 'Literal transcription of the Vietnamese audio.',
    },
    englishSentence: {
      type: 'string',
      description:
        'A short, natural spoken English sentence for a parent to say to their child.',
    },
    ipa: {
      type: 'string',
      description:
        'IPA phonetic transcription of englishSentence, e.g. "/wɛərz jʊər ʃuz/".',
    },
    explanation: {
      type: 'string',
      description:
        'Short Vietnamese-language explanation of the translation or phrasing choice.',
    },
  },
  required: ['vietnameseText', 'englishSentence', 'ipa', 'explanation'],
};

/**
 * Pure extraction step, isolated for testing: given a Gemini generateContent
 * response, returns the validated result or throws with the response's
 * finishReason so a caller can show a meaningful error instead of a blank
 * screen.
 */
export function extractTranslateResult(response) {
  if (!response.text) {
    const finishReason = response.candidates?.[0]?.finishReason || 'unknown';
    throw new Error(
      `Gemini did not return a structured translation (finishReason: ${finishReason}).`,
    );
  }
  return JSON.parse(response.text);
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export async function transcribeAndTranslate(audioBlob, mimeType, apiKey) {
  if (!apiKey) {
    throw new Error('No Gemini API key configured.');
  }
  const client = new GoogleGenAI({apiKey});
  const data = arrayBufferToBase64(await audioBlob.arrayBuffer());
  const response = await client.models.generateContent({
    model: MODEL,
    contents: [{role: 'user', parts: [{inlineData: {mimeType, data}}]}],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseJsonSchema: RESPONSE_SCHEMA,
    },
  });
  return extractTranslateResult(response);
}
