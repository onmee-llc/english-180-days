import {describe, it, expect} from 'vitest';
import {
  extractDayNumber,
  parseViBlocks,
  resolveI18nRef,
} from './build-content.js';

describe('extractDayNumber', () => {
  it('reads the day number out of a "Day N — Title" string', () => {
    expect(extractDayNumber('Day 1 — Your Core Story')).toBe(1);
    expect(extractDayNumber('Day 42 - Something')).toBe(42);
  });

  it('returns null when there is no leading "Day N"', () => {
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
