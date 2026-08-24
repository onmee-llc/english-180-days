/**
 * AdaptiveLearningEngine: Continuous self-adaptation and style personalization engine.
 * Ingests user interactions, feedback, and corrections to automatically update the
 * user persona profile and dynamically mutate system prompt instructions.
 */

export const STYLE_TRAITS = {
  CONCISE: 'concise_direct',
  CODE_FIRST: 'code_first',
  EXECUTIVE: 'executive_summary',
  TECHNICAL: 'high_technical_depth',
};

export class AdaptiveLearningEngine {
  /**
   * @param {Object} options
   * @param {Object} options.memoryStore
   */
  constructor(options = {}) {
    this.memory = options.memoryStore || null;
    this.learnedTraits = new Set([
      STYLE_TRAITS.CONCISE,
      STYLE_TRAITS.TECHNICAL,
    ]);
    this.techStackKeywords = new Set([
      'Vue 3', 'Node.js', 'PostgreSQL', 'Docker', 'Clean Architecture', 'LLM Streaming', 'MCP',
    ]);
    this.lastAdaptedAt = new Date().toISOString();
  }

  /**
   * Analyzes an incoming user turn to extract preferences, corrections, and habits.
   * @param {string} prompt
   * @returns {Object} Extracted insights
   */
  ingestInteraction(prompt) {
    if (!prompt) return {adapted: false};

    const p = prompt.toLowerCase();
    let adapted = false;
    const updates = {};

    // 1. Detect brevity / style corrections
    if (p.includes('ngắn gọn') || p.includes('súc tích') || p.includes('bỏ bớt') || p.includes('ngắn thôi') || p.includes('bullet point')) {
      this.learnedTraits.add(STYLE_TRAITS.CONCISE);
      adapted = true;
    }

    // 2. Detect technical depth preference
    if (p.includes('kiến trúc') || p.includes('system design') || p.includes('benchmark') || p.includes('concurrency') || p.includes('mcp')) {
      this.learnedTraits.add(STYLE_TRAITS.TECHNICAL);
      adapted = true;
    }

    // 3. Detect technology mentions
    const knownTechs = ['go', 'golang', 'rust', 'python', 'kubernetes', 'graphql', 'vitest', 'sqlite'];
    knownTechs.forEach((tech) => {
      if (p.includes(tech)) {
        this.techStackKeywords.add(tech.toUpperCase());
        adapted = true;
      }
    });

    if (adapted) {
      this.lastAdaptedAt = new Date().toISOString();
      if (this.memory && typeof this.memory.updateProfile === 'function') {
        const currentProfile = this.memory.getProfile();
        this.memory.updateProfile({
          preferences: {
            ...currentProfile.preferences,
            learnedTraits: Array.from(this.learnedTraits),
            favoriteTechs: Array.from(this.techStackKeywords),
            lastAdaptedAt: this.lastAdaptedAt,
          },
        });
      }
    }

    return {
      adapted,
      traits: Array.from(this.learnedTraits),
      techs: Array.from(this.techStackKeywords),
    };
  }

  /**
   * Generates dynamic system prompt augmentations representing Robert's learned style.
   * @returns {string}
   */
  generateStyleAugmentation() {
    const traitsList = Array.from(this.learnedTraits).join(', ');
    const techsList = Array.from(this.techStackKeywords).slice(0, 8).join(', ');

    return `\n[ADAPTIVE USER STYLE & PERSONALIZATION]\n` +
      `- User Persona: Robert (Senior Principal / AI Engineer)\n` +
      `- Learned Communication Traits: [${traitsList}]\n` +
      `- Tech Stack Context: [${techsList}]\n` +
      `- Interaction Rule: Luôn trả lời cực kỳ súc tích, đi thẳng vào giải pháp và code/action items thực tế. Tuyệt đối không dùng emoji thô.`;
  }

  getMetrics() {
    return {
      traitsCount: this.learnedTraits.size,
      techKeywordsCount: this.techStackKeywords.size,
      lastAdaptedAt: this.lastAdaptedAt,
      traits: Array.from(this.learnedTraits),
    };
  }
}
