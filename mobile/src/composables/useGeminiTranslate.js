import {GoogleGenAI} from '@google/genai';

// Fast, high-throughput multimodal model for real-time conversational latency
const MODEL = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are a precision speech-to-text transcriber and professional English-Vietnamese translator.
You MUST listen to the user's audio input and perform VERBATIM SPEECH-TO-TEXT transcription and faithful translation.

MANDATORY INSTRUCTIONS:
1. VERBATIM SPEECH TRANSCRIPTION:
   - Carefully transcribe EXACTLY the words spoken in the audio without modifying, dropping, or adding words.
   - NEVER hallucinate, guess, or output pre-fabricated conversational templates.

2. LANGUAGE DIRECTION:
   - If the audio is in VIETNAMESE:
     * "vietnameseText": Exact verbatim transcription of what the user said in Vietnamese.
     * "englishSentence": Accurate, natural, high-level English translation of that exact sentence.
   - If the audio is in ENGLISH:
     * "englishSentence": Exact verbatim transcription of what the user said in English.
     * "vietnameseText": Accurate, natural Vietnamese translation of that exact sentence.

3. PHONETICS & EXPLANATION:
   - "ipa": Full IPA phonetic transcription for "englishSentence".
   - "explanation": Concise Vietnamese explanation highlighting useful vocabulary, idioms, grammar, or natural phrasing for this sentence.

4. NO SPEECH DETECTED:
   - If the audio is completely silent or only contains inaudible noise:
     * "vietnameseText": "Không nhận diện được giọng nói"
     * "englishSentence": "No speech detected"
     * "ipa": ""
     * "explanation": "Vui lòng giữ nút mic và nói to, rõ ràng hơn."`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    vietnameseText: {
      type: 'string',
      description: 'Verbatim transcription of Vietnamese audio or Vietnamese translation of English audio.',
    },
    englishSentence: {
      type: 'string',
      description:
        'Natural, accurate spoken English sentence (technical or daily communication).',
    },
    ipa: {
      type: 'string',
      description:
        'IPA phonetic transcription of englishSentence.',
    },
    explanation: {
      type: 'string',
      description:
        'Short Vietnamese-language explanation of vocabulary, grammar, or phrasing.',
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
  if (!response || !response.text) {
    const finishReason = response?.candidates?.[0]?.finishReason || 'unknown';
    throw new Error(
      `Gemini did not return a structured translation (finishReason: ${finishReason}).`,
    );
  }
  let raw = response.text.trim();
  if (raw.startsWith('```json')) {
    raw = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  } else if (raw.startsWith('```')) {
    raw = raw.replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
  }
  return JSON.parse(raw);
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
    throw new Error('Chưa cấu hình Gemini API key trong Cài đặt.');
  }
  const client = new GoogleGenAI({apiKey});
  const data = arrayBufferToBase64(await audioBlob.arrayBuffer());
  const rawMime = (mimeType || 'audio/webm').split(';')[0].trim();
  const baseMimeType = rawMime || 'audio/webm';

  const response = await client.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {inlineData: {mimeType: baseMimeType, data}},
          {
            text: 'Listen to the audio recording. Transcribe the exact words spoken verbatim into "vietnameseText" (if spoken in Vietnamese) or "englishSentence" (if spoken in English), and provide the translation and IPA. Do not invent sentences.'
          }
        ]
      },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseJsonSchema: RESPONSE_SCHEMA,
    },
  });

  return extractTranslateResult(response);
}

/**
 * Ultra-fast direct verbatim audio transcription for conversational voice assistant turns.
 * Returns raw spoken text in < 300ms without JSON schema overhead.
 */
export async function fastTranscribeAudio(audioBlob, mimeType, apiKey) {
  if (!apiKey || !audioBlob) return '';
  try {
    const client = new GoogleGenAI({apiKey});
    const data = arrayBufferToBase64(await audioBlob.arrayBuffer());
    const rawMime = (mimeType || 'audio/webm').split(';')[0].trim();
    const baseMimeType = rawMime || 'audio/webm';

    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {inlineData: {mimeType: baseMimeType, data}},
            {
              text: 'Listen to the audio recording carefully. Transcribe the spoken speech verbatim in the exact language it was spoken (Vietnamese or English). Return ONLY the plain transcribed words. Do not add markdown, quotes, conversational replies, or explanations. If completely silent, return empty string.',
            },
          ],
        },
      ],
    });

    const text = response?.text ? response.text.trim() : '';
    return text.replace(/^["'>`]+|["'>`]+$/g, '').trim();
  } catch (err) {
    console.warn('fastTranscribeAudio error:', err);
    return '';
  }
}
