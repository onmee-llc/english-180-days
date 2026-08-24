import {ref} from 'vue';

const CONTRACTION_MAP = {
  "i'm": 'i am',
  "we're": 'we are',
  "you're": 'you are',
  "they're": 'they are',
  "it's": 'it is',
  "that's": 'that is',
  "there's": 'there is',
  "can't": 'can not',
  "won't": 'will not',
  "don't": 'do not',
  "doesn't": 'does not',
  "didn't": 'did not',
  "isn't": 'is not',
  "aren't": 'are not',
  "wasn't": 'was not',
  "weren't": 'were not',
  "hasn't": 'has not',
  "haven't": 'have not',
  "hadn't": 'had not',
  "i'll": 'i will',
  "we'll": 'we will',
  "you'll": 'you will',
  "they'll": 'they will',
  "he'll": 'he will',
  "she'll": 'she will',
  "it'll": 'it will',
  "i've": 'i have',
  "we've": 'we have',
  "you've": 'you have',
  "they've": 'they have',
  "let's": 'let us',
};

const HOMOPHONE_MAP = {
  there: 'their',
  their: 'there',
  theyre: 'there',
  to: 'too',
  too: 'to',
  two: 'to',
  for: 'four',
  four: 'for',
  hear: 'here',
  here: 'hear',
  buy: 'by',
  by: 'buy',
  bye: 'by',
  peace: 'piece',
  piece: 'peace',
  role: 'roll',
  roll: 'role',
};

/**
 * Normalizes text: lowercases, expands contractions, strips punctuation.
 */
export function normalizeText(text) {
  if (!text) return [];
  let clean = text.toLowerCase().trim();

  for (const [contraction, expansion] of Object.entries(CONTRACTION_MAP)) {
    const regex = new RegExp(`\\b${contraction.replace("'", "['’]?")}\\b`, 'gi');
    clean = clean.replace(regex, expansion);
  }

  clean = clean
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return clean.split(' ').filter(Boolean);
}

/**
 * Levenshtein edit distance between two strings.
 */
export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = Array.from({length: a.length + 1}, () =>
    new Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * String similarity ratio from 0.0 to 1.0.
 */
export function stringSimilarity(a, b) {
  if (a === b) return 1.0;
  if (HOMOPHONE_MAP[a] === b || HOMOPHONE_MAP[b] === a) return 1.0;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshtein(a, b);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Evaluates spoken text against expected target text.
 */
export function evaluatePronunciation(targetText, spokenText, passThreshold = 70) {
  const targetWords = normalizeText(targetText);
  const spokenWords = normalizeText(spokenText);

  if (targetWords.length === 0) {
    return {
      score: 100,
      passed: true,
      breakdown: [],
      stats: {total: 0, correct: 0, close: 0, missed: 0},
      feedback: 'Không có nội dung cần đánh giá.',
      phoneticTips: [],
    };
  }

  if (spokenWords.length === 0) {
    const breakdown = targetWords.map((w) => ({
      word: w,
      status: 'missed',
      score: 0,
    }));
    return {
      score: 0,
      passed: false,
      breakdown,
      stats: {total: targetWords.length, correct: 0, close: 0, missed: targetWords.length},
      feedback: 'Chưa thu được giọng nói. Vui lòng thử nói to và rõ hơn.',
      phoneticTips: ['Hãy giữ nút mic và đọc to từng câu.'],
    };
  }

  const breakdown = [];
  let totalScoreSum = 0;
  let correctCount = 0;
  let closeCount = 0;
  let missedCount = 0;
  const tipsSet = new Set();

  let spokenIndex = 0;

  for (let i = 0; i < targetWords.length; i++) {
    const tWord = targetWords[i];
    let bestSim = 0;
    let bestMatchSpokenIdx = -1;

    const windowSize = 4;
    const startIdx = Math.max(0, spokenIndex - 1);
    const endIdx = Math.min(spokenWords.length, spokenIndex + windowSize);

    for (let s = startIdx; s < endIdx; s++) {
      const sim = stringSimilarity(tWord, spokenWords[s]);
      if (sim > bestSim) {
        bestSim = sim;
        bestMatchSpokenIdx = s;
      }
    }

    if (bestSim >= 0.82) {
      breakdown.push({word: tWord, status: 'correct', score: 100});
      totalScoreSum += 100;
      correctCount++;
      if (bestMatchSpokenIdx >= 0) spokenIndex = bestMatchSpokenIdx + 1;
    } else if (bestSim >= 0.55) {
      breakdown.push({word: tWord, status: 'close', score: 70});
      totalScoreSum += 70;
      closeCount++;
      if (bestMatchSpokenIdx >= 0) spokenIndex = bestMatchSpokenIdx + 1;

      if (tWord.endsWith('s') || tWord.endsWith('es')) {
        tipsSet.add(`Chú ý phát âm rõ âm đuôi /-s/ hoặc /-z/ ở từ "${tWord}".`);
      } else if (tWord.endsWith('ed')) {
        tipsSet.add(`Chú ý phát âm bật đuôi quá khứ /-t/, /-d/ hoặc /-ɪd/ ở từ "${tWord}".`);
      } else if (tWord.length > 7) {
        tipsSet.add(`Nhấn đúng trọng âm chính của từ đa âm tiết "${tWord}".`);
      }
    } else {
      breakdown.push({word: tWord, status: 'missed', score: 0});
      missedCount++;
      tipsSet.add(`Cần phát âm rõ ràng hơn từ "${tWord}".`);
    }
  }

  const averageScore = Math.round(totalScoreSum / targetWords.length);
  const passed = averageScore >= passThreshold;

  let feedback = '';
  if (averageScore >= 90) {
    feedback = 'Xuất sắc! Phát âm rất tự nhiên và chuẩn xác.';
  } else if (averageScore >= 75) {
    feedback = 'Rất tốt! Bạn đã đạt yêu cầu phát âm của bài học.';
  } else if (averageScore >= 60) {
    feedback = 'Khá ổn, nhưng cần chú ý một vài âm đuôi và từ chưa chuẩn.';
  } else {
    feedback = 'Cần luyện tập thêm. Hãy nghe lại ở tốc độ 0.6x hoặc 0.8x trước khi nói lại.';
  }

  return {
    score: averageScore,
    passed,
    breakdown,
    stats: {
      total: targetWords.length,
      correct: correctCount,
      close: closeCount,
      missed: missedCount,
    },
    feedback,
    phoneticTips: Array.from(tipsSet).slice(0, 3),
  };
}

export function usePronunciationEvaluator() {
  const isListening = ref(false);
  const recognizedText = ref('');
  const evaluationResult = ref(null);
  const error = ref('');

  let recognitionInstance = null;

  function initRecognition() {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      error.value = 'Trình duyệt chưa hỗ trợ Web Speech Recognition.';
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    return recognition;
  }

  async function startListening(targetText) {
    error.value = '';
    recognizedText.value = '';
    evaluationResult.value = null;

    recognitionInstance = initRecognition();
    if (!recognitionInstance) {
      isListening.value = true;
      return;
    }

    recognitionInstance.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      recognizedText.value = (final + interim).trim();
    };

    recognitionInstance.onerror = (event) => {
      if (event.error !== 'no-speech') {
        error.value = `Lỗi nhận diện âm thanh: ${event.error}`;
      }
      isListening.value = false;
    };

    recognitionInstance.onend = () => {
      isListening.value = false;
      if (targetText && recognizedText.value) {
        evaluate(targetText, recognizedText.value);
      }
    };

    try {
      recognitionInstance.start();
      isListening.value = true;
    } catch (err) {
      console.warn('Failed to start speech recognition', err);
      isListening.value = false;
    }
  }

  function stopListening(targetText = '') {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (_) {}
    }
    isListening.value = false;
    if (targetText && recognizedText.value) {
      evaluate(targetText, recognizedText.value);
    }
  }

  function evaluate(targetText, spokenText, passThreshold = 70) {
    const result = evaluatePronunciation(targetText, spokenText, passThreshold);
    evaluationResult.value = result;
    return result;
  }

  function reset() {
    isListening.value = false;
    recognizedText.value = '';
    evaluationResult.value = null;
    error.value = '';
    if (recognitionInstance) {
      try {
        recognitionInstance.abort();
      } catch (_) {}
    }
  }

  return {
    isListening,
    recognizedText,
    evaluationResult,
    error,
    startListening,
    stopListening,
    evaluate,
    reset,
  };
}
