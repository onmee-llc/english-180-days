import {describe, it, expect} from 'vitest';
import {
  extractDayNumber,
  parseViBlocks,
  resolveI18nRef,
  extractShadowing,
  extractVocabulary,
  extractGrammar,
  extractSentencePatterns,
  extractExamQuestions,
  extractReferences,
  extractOverview,
} from './build-content.js';

describe('extractDayNumber', () => {
  it('reads the day number out of a "Day N — Title" string', () => {
    expect(extractDayNumber('Day 1 — Your Core Story')).toBe(1);
    expect(extractDayNumber('Day 42 - Something')).toBe(42);
    expect(extractDayNumber('Day 211 — AI Threat Modeling')).toBe(211);
  });

  it('computes special topic day numbers', () => {
    expect(extractDayNumber('Group 1 — Morning Routine', 'topic-11-daily-with-kids', 1)).toBe(243);
    expect(extractDayNumber('Foundation — How to Shadow', 'pronunciation-guide', 1)).toBe(251);
  });

  it('returns null when there is no leading "Day N" and no special topic match', () => {
    expect(extractDayNumber('Untitled')).toBeNull();
  });
});

describe('parseViBlocks', () => {
  it('wraps {% vi %}...{% endvi %} blocks in a .lesson-vi div', () => {
    const md = 'Hello.\n\n{% vi %}\nXin chào.\n{% endvi %}\n\nBye.';
    const out = parseViBlocks(md);
    expect(out).toContain('<div class="lesson-vi" lang="vi">');
    expect(out).toContain('Xin chào.');
    expect(out).not.toContain('{% vi %}');
    expect(out).not.toContain('{% endvi %}');
  });
});

describe('extractShadowing', () => {
  it('extracts raw English passage and Vietnamese translation', () => {
    const content = `## Session goal
Some goal

## Shadowing passage

> When threat modeling an enterprise AI architecture, I analyze four distinct layers.
> At the data layer, the risks are data poisoning.

{% vi %}
Khi lập mô hình đe dọa, tôi phân tích bốn tầng.
{% endvi %}

## Key vocabulary`;

    const result = extractShadowing(content);
    expect(result.passage).toContain('When threat modeling an enterprise AI architecture, I analyze four distinct layers.');
    expect(result.viTranslation).toContain('Khi lập mô hình đe dọa, tôi phân tích bốn tầng.');
  });
});

describe('extractVocabulary', () => {
  it('parses markdown table rows into structured vocabulary items', () => {
    const content = `## Key vocabulary

| Term | IPA | Meaning |
|---|---|---|
| **threat modeling** | /θret ˈmɑː.dəl.ɪŋ/ | Lập mô hình đe dọa |
| **attack surface** | /əˈtæk ˈsɝː.fɪs/ | Bề mặt tấn công |
`;
    const vocab = extractVocabulary(content);
    expect(vocab.length).toBe(2);
    expect(vocab[0].word).toBe('threat modeling');
    expect(vocab[0].ipa).toBe('/θret ˈmɑː.dəl.ɪŋ/');
    expect(vocab[0].note).toBe('Lập mô hình đe dọa');
  });
});

describe('extractOverview', () => {
  it('extracts objectives, key takeaways, and core questions', () => {
    const content = `## Session goal
Deliver your self-introduction in 90 seconds.

## Shadowing passage
> I am Robert, a backend AI engineer.

## Key phrases
| Phrase | Listen | Note |
|---|---|---|
| real-world products | /ipa/ | emphasizes production |

## Reflection
Record yourself. Does your specialization land clearly in the first 30 seconds?
`;
    const overview = extractOverview(content, {title: 'Day 1 — Your Core Story', description: '90-second intro'}, 'topic-1-introduce-yourself', 1);
    expect(overview.objectives.length).toBeGreaterThan(0);
    expect(overview.objectives[0]).toContain('Deliver your self-introduction in 90 seconds.');
    expect(overview.keyTakeaways.length).toBeGreaterThan(0);
    expect(overview.coreQuestions.length).toBeGreaterThan(0);
  });
});

describe('extractGrammar & extractSentencePatterns', () => {
  it('extracts grammar points and sentence patterns', () => {
    const content = `## 🧠 Key Grammar

### 1. Participle Clauses
Formula: V-ing, S + V

## 💬 Key Sentence Patterns

1. **Describing Multi-Layered Architecture**: When modeling X, I analyze Y.
- *Example:* When modeling agents, I check tools.
`;
    const grammar = extractGrammar(content);
    const patterns = extractSentencePatterns(content);

    expect(grammar.length).toBe(1);
    expect(grammar[0].title).toBe('1. Participle Clauses');
    expect(patterns.length).toBe(1);
    expect(patterns[0].title).toBe('Describing Multi-Layered Architecture');
  });
});

describe('extractExamQuestions & extractReferences', () => {
  it('parses multiple choice questions and links', () => {
    const content = `## 📝 Lesson Exam

1. **What is threat modeling?**
- (A) Testing software
- (B) Identifying security risks systematically
- *(Correct Answer: B)*

## 📚 References

- 🔗 [OWASP Top 10](https://owasp.org)
`;
    const questions = extractExamQuestions(content);
    const refs = extractReferences(content);

    expect(questions.length).toBe(1);
    expect(questions[0].question).toBe('What is threat modeling?');
    expect(questions[0].correctAnswer).toBe('B');
    expect(refs.length).toBe(1);
    expect(refs[0].title).toBe('OWASP Top 10');
    expect(refs[0].url).toBe('https://owasp.org');
  });
});

describe('resolveI18nRef', () => {
  const i18n = {
    topic_1_introduce_yourself: {
      title: {en: 'Topic 1 — Introduce Yourself'},
      description: {en: 'Some description.'},
    },
  };

  it('resolves an "i18n.courses.<key>.<field>" reference to its English value', () => {
    expect(
      resolveI18nRef('i18n.courses.topic_1_introduce_yourself.title', i18n),
    ).toBe('Topic 1 — Introduce Yourself');
  });

  it('returns the raw string unchanged when it is not an i18n reference', () => {
    expect(resolveI18nRef('Plain title', i18n)).toBe('Plain title');
  });
});

