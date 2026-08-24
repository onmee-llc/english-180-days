/**
 * DecisionJournalStore: Append-Only Decision Log & In-Context Training Signal Engine.
 * Records how Robert makes trade-offs and decisions in real-world scenarios,
 * allowing Alex to learn and mirror Robert's mental models and decision-making style.
 */

const STORAGE_KEY_DECISIONS = 'dm_agent_decisions_log';

export const DECISION_CATEGORIES = {
  ENGINEERING: 'engineering',
  ARCHITECTURE: 'architecture',
  FINANCE: 'finance',
  PRODUCTIVITY: 'productivity',
  LIFESTYLE: 'lifestyle',
};

export const INITIAL_SEEDED_DECISIONS = [
  {
    id: 'dec_init_001',
    timestamp: '2026-08-15T09:00:00.000Z',
    category: DECISION_CATEGORIES.ARCHITECTURE,
    situation: 'Thiết kế tầng Agent Core: Gắn chặt vào Vue Pinia/Composable hay tách thành Decoupled ES Module độc lập?',
    optionsConsidered: [
      'Gắn trực tiếp vào Vue Composables / Pinia Store (dễ viết UI nhanh)',
      'Tách thành Decoupled Vanilla JS/TS Engine độc lập hoàn toàn với UI layer',
    ],
    decisionMade: 'Tách thành Decoupled Vanilla JS Engine (AgentRuntime, MemoryStore, ToolRegistry)',
    rationale: 'Đảm bảo khả năng tái sử dụng 100% mã nguồn khi chuyển đổi nền tảng (Web, Mobile, Node.js, CLI, Native), dễ viết unit test độc lập và không phụ thuộc vào vòng đời của UI framework.',
    tradeoffsAccepted: 'Phải viết thêm tầng Bridge/Event subscription để sync state vào Vue reactive UI.',
    outcome: 'Đạt 35 test files pass hoàn hảo, build siêu nhẹ 3.9s, sẵn sàng tích hợp native mà không cần sửa core.',
    tags: ['architecture', 'decoupling', 'maintainability', 'testing'],
  },
  {
    id: 'dec_init_002',
    timestamp: '2026-08-18T14:30:00.000Z',
    category: DECISION_CATEGORIES.FINANCE,
    situation: 'Lựa chọn chiến lược trả nợ tối ưu dòng tiền: Phương pháp Debt Snowball hay Debt Avalanche?',
    optionsConsidered: [
      'Snowball: Trả khoản nhỏ nhất trước để tạo cảm giác chiến thắng tâm lý',
      'Avalanche: Ưu tiên trả toàn lực khoản có lãi suất cao nhất trước',
    ],
    decisionMade: 'Áp dụng Debt Avalanche (ưu tiên dứt điểm khoản lãi suất cao nhất)',
    rationale: 'Về mặt toán học và tài chính định lượng, Avalanche tiết kiệm tối đa chi phí tiền lãi theo thời gian, giải phóng dòng tiền thực tế nhanh hơn cho tái đầu tư.',
    tradeoffsAccepted: 'Cần kỷ luật thép và sự kiên nhẫn trong giai đoạn đầu khi khoản nợ lớn cần thời gian để dứt điểm.',
    outcome: 'Dòng tiền kiểm soát chặt chẽ, tối ưu chi phí lãi vay hàng tháng.',
    tags: ['finance', 'debt_paydown', 'avalanche', 'cashflow'],
  },
  {
    id: 'dec_init_003',
    timestamp: '2026-08-20T10:15:00.000Z',
    category: DECISION_CATEGORIES.ENGINEERING,
    situation: 'Chiến lược bảo mật dữ liệu cá nhân & tài chính: Cloud-First Sync hay Local-First Encrypted Vault?',
    optionsConsidered: [
      'Đẩy toàn bộ profile và dữ liệu nợ nần lên Cloud Database để sync tiện lợi',
      'Local-First Encrypted Storage (AES-256 / Device Keystore), xử lý on-device',
    ],
    decisionMade: 'Local-First Encrypted Storage, dữ liệu nhạy cảm chỉ nằm trên máy Robert',
    rationale: 'Bảo mật tuyệt đối thông tin tài chính, gia đình và nợ nần. Không phụ thuộc vào server bên thứ ba, 0ms độ trễ truy xuất.',
    tradeoffsAccepted: 'Phải tự quản lý backup mã hóa khi đổi thiết bị.',
    outcome: 'Bảo mật an toàn, dữ liệu private không bị rò rỉ ra ngoài internet.',
    tags: ['security', 'local_first', 'encryption', 'privacy'],
  },
  {
    id: 'dec_init_004',
    timestamp: '2026-08-22T08:00:00.000Z',
    category: DECISION_CATEGORIES.PRODUCTIVITY,
    situation: 'Trải nghiệm âm thanh mặc định khi mở app: Tự động phát âm thanh hay Tắt âm mặc định (Muted)?',
    optionsConsidered: [
      'Tự động đọc to báo cáo ngay khi mở app',
      'Tắt âm mặc định (Muted), chỉ phát khi người dùng bấm nút bật loa hoặc bấm nghe',
    ],
    decisionMade: 'Mặc định Tắt Âm (Muted by default), có nút chuyển đổi rõ ràng',
    rationale: 'Tôn trọng không gian yên tĩnh và riêng tư của người dùng ở nơi công cộng hoặc phòng họp, tránh phát âm bất ngờ.',
    tradeoffsAccepted: 'Người dùng cần thêm 1 thao tác chạm nếu muốn nghe giọng nói.',
    outcome: 'Trải nghiệm người dùng văn minh, không gây phiền toái.',
    tags: ['ux', 'audio_ergonomics', 'privacy', 'mobile_first'],
  },
];

export class DecisionJournalStore {
  /**
   * @param {Object} [options]
   * @param {Object} [options.storageAdapter]
   */
  constructor(options = {}) {
    this._memoryFallback = new Map();
    this._storage = options.storageAdapter || (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function' ? localStorage : null);
    this.decisions = this._loadDecisions();
  }

  _loadDecisions() {
    try {
      if (this._storage) {
        const raw = this._storage.getItem(STORAGE_KEY_DECISIONS);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } else if (this._memoryFallback.has(STORAGE_KEY_DECISIONS)) {
        return this._memoryFallback.get(STORAGE_KEY_DECISIONS);
      }
    } catch (_) {}

    // Save initial seeded decisions if empty
    this._saveDecisions(INITIAL_SEEDED_DECISIONS);
    return [...INITIAL_SEEDED_DECISIONS];
  }

  _saveDecisions(list) {
    try {
      if (this._storage) {
        this._storage.setItem(STORAGE_KEY_DECISIONS, JSON.stringify(list));
      } else {
        this._memoryFallback.set(STORAGE_KEY_DECISIONS, list);
      }
    } catch (_) {}
  }

  /**
   * APPEND-ONLY: Add a new decision record to the immutable journal.
   * @param {Object} record
   * @returns {Object} Created decision record
   */
  addDecision({
    situation,
    optionsConsidered = [],
    decisionMade,
    rationale,
    tradeoffsAccepted = '',
    outcome = '',
    category = DECISION_CATEGORIES.ENGINEERING,
    tags = [],
  }) {
    if (!situation || !decisionMade) {
      throw new Error('Decision record requires situation and decisionMade.');
    }

    const newRecord = {
      id: `dec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      category,
      situation: situation.trim(),
      optionsConsidered: Array.isArray(optionsConsidered) ? optionsConsidered : [optionsConsidered],
      decisionMade: decisionMade.trim(),
      rationale: (rationale || '').trim(),
      tradeoffsAccepted: (tradeoffsAccepted || '').trim(),
      outcome: (outcome || '').trim(),
      tags: Array.isArray(tags) ? tags.map((t) => t.toLowerCase().trim()) : [],
    };

    this.decisions.unshift(newRecord); // Prepend so latest is first
    this._saveDecisions(this.decisions);
    return newRecord;
  }

  /**
   * Update outcome/reflection of a past decision without altering the historical rationale.
   * @param {string} decisionId
   * @param {Object} updates
   * @returns {Object|null}
   */
  recordOutcome(decisionId, {outcome, learnings}) {
    const decision = this.decisions.find((d) => d.id === decisionId);
    if (!decision) return null;

    if (outcome) decision.outcome = outcome;
    if (learnings) decision.learnings = learnings;
    decision.outcomeUpdatedAt = new Date().toISOString();

    this._saveDecisions(this.decisions);
    return decision;
  }

  /**
   * Retrieve decisions with optional category filter and pagination limit.
   */
  getDecisions({category, tag, limit = 50} = {}) {
    let result = this.decisions;

    if (category) {
      result = result.filter((d) => d.category === category);
    }
    if (tag) {
      const searchTag = tag.toLowerCase().trim();
      result = result.filter((d) => d.tags && d.tags.includes(searchTag));
    }

    return result.slice(0, limit);
  }

  /**
   * Search relevant decisions using term matching and tag relevance.
   * Used by Alex for in-context decision learning.
   * @param {string} query
   * @param {number} [limit=3]
   * @returns {Array<Object>}
   */
  searchRelevantDecisions(query, limit = 3) {
    if (!query || !query.trim()) return this.decisions.slice(0, limit);

    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter((w) => w.length > 2);

    const scored = this.decisions.map((dec) => {
      let score = 0;
      const sit = (dec.situation || '').toLowerCase();
      const rat = (dec.rationale || '').toLowerCase();
      const decStr = (dec.decisionMade || '').toLowerCase();
      const tags = (dec.tags || []).join(' ').toLowerCase();

      // Direct exact phrase match
      if (sit.includes(q)) score += 10;
      if (decStr.includes(q)) score += 8;
      if (rat.includes(q)) score += 6;

      // Word match scoring
      words.forEach((w) => {
        if (sit.includes(w)) score += 3;
        if (decStr.includes(w)) score += 2;
        if (rat.includes(w)) score += 2;
        if (tags.includes(w)) score += 4;
      });

      return {decision: dec, score};
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.decision);
  }

  /**
   * Format relevant decisions into prompt context for Alex's LLM reasoning.
   */
  formatDecisionsForContext(query, limit = 3) {
    const relevant = this.searchRelevantDecisions(query, limit);
    if (relevant.length === 0) return '';

    const lines = [
      `\n[ROBERT'S HISTORICAL DECISIONS & MENTAL MODELS (TRAINING SIGNAL)]`,
      `Alex hãy tham khảo cách Robert đã từng giải quyết các tình huống tương tự trong quá khứ để đưa ra đề xuất mang đúng phong cách tư duy của Robert:`,
    ];

    relevant.forEach((d, idx) => {
      lines.push(`\n# Quyết định ${idx + 1} (${d.category}):`);
      lines.push(`- Tình huống: "${d.situation}"`);
      lines.push(`- Quyết định Robert đã chọn: "${d.decisionMade}"`);
      if (d.rationale) lines.push(`- Lý do & Logic: "${d.rationale}"`);
      if (d.tradeoffsAccepted) lines.push(`- Trade-off chấp nhận: "${d.tradeoffsAccepted}"`);
    });

    return lines.join('\n');
  }
}
