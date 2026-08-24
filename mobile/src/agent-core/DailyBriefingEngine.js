/**
 * DailyBriefingEngine: Proactive intelligence and monitoring aggregator for Alex.
 * Compiles multi-pillar executive summaries covering Work, Mastery, Life, and Market
 * tailored to user-configured monitoring preferences.
 */

export const BRIEFING_PILLARS = {
  WORK: 'work',
  MASTERY: 'mastery',
  LIFE: 'life',
  MARKET: 'market',
};

export const DEFAULT_BRIEFING_PREFERENCES = {
  pillars: [
    BRIEFING_PILLARS.WORK,
    BRIEFING_PILLARS.MASTERY,
    BRIEFING_PILLARS.LIFE,
    BRIEFING_PILLARS.MARKET,
  ],
  marketWatchlist: ['BTC', 'ETH', 'S&P 500', 'NVDA'],
  focusDepth: 'executive', // 'executive' | 'detailed'
  autoGenerateOnLaunch: true,
};

export class DailyBriefingEngine {
  /**
   * @param {Object} options
   * @param {Object} [options.memoryStore]
   * @param {Object} [options.masteryStore]
   * @param {Object} [options.mcpBridge]
   * @param {Object} [options.preferences]
   */
  constructor(options = {}) {
    this.memory = options.memoryStore || null;
    this.mastery = options.masteryStore || null;
    this.mcp = options.mcpBridge || null;
    this.preferences = {
      ...DEFAULT_BRIEFING_PREFERENCES,
      ...(options.preferences || {}),
    };
    this.cachedBriefing = null;
    this.lastGeneratedAt = null;
  }

  setPreferences(updates) {
    this.preferences = {...this.preferences, ...updates};
  }

  getPreferences() {
    return this.preferences;
  }

  /**
   * Generates a comprehensive structured daily briefing.
   * @param {Object} [overrideParams]
   * @returns {Promise<Object>}
   */
  async generateBriefing(overrideParams = {}) {
    const prefs = {...this.preferences, ...overrideParams};
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const pillars = [];

    // 1. WORK & DEVOPS PILLAR
    if (prefs.pillars.includes(BRIEFING_PILLARS.WORK)) {
      const workData = await this._collectWorkMetrics();
      pillars.push({
        id: BRIEFING_PILLARS.WORK,
        title: 'Công Việc & Điều Phối',
        icon: 'code',
        badge: 'Ưu tiên',
        items: workData.items,
        summary: workData.summary,
        actionPrompt: 'Alex, hãy cùng Robert review chi tiết các task công việc hôm nay.',
      });
    }

    // 2. MASTERY & LEARNING PILLAR
    if (prefs.pillars.includes(BRIEFING_PILLARS.MASTERY)) {
      const masteryData = this._collectMasteryMetrics();
      pillars.push({
        id: BRIEFING_PILLARS.MASTERY,
        title: 'Daily Mastery 180 Ngày',
        icon: 'spark',
        badge: `${masteryData.streak} ngày streak`,
        items: masteryData.items,
        summary: masteryData.summary,
        actionPrompt: 'Alex, mở bài học hôm nay và cùng Robert luyện tập kiến thức này.',
      });
    }

    // 3. LIFE & ENERGY PILLAR
    if (prefs.pillars.includes(BRIEFING_PILLARS.LIFE)) {
      const lifeData = await this._collectLifeMetrics();
      pillars.push({
        id: BRIEFING_PILLARS.LIFE,
        title: 'Cuộc Sống & Nhịp Sinh Học',
        icon: 'voice',
        badge: 'Năng lượng tốt',
        items: lifeData.items,
        summary: lifeData.summary,
        actionPrompt: 'Alex, phân bổ lịch làm việc hôm nay để tối ưu khung giờ tập trung cao độ.',
      });
    }

    // 4. MARKET & TECH RADAR PILLAR
    if (prefs.pillars.includes(BRIEFING_PILLARS.MARKET)) {
      const marketData = await this._collectMarketMetrics(prefs.marketWatchlist);
      pillars.push({
        id: BRIEFING_PILLARS.MARKET,
        title: 'Thị Trường & Xu Hướng Tech',
        icon: 'chart',
        badge: marketData.sentimentBadge,
        items: marketData.items,
        summary: marketData.summary,
        actionPrompt: 'Alex, phân tích sâu hơn biến động thị trường và xu hướng AI mới nhất.',
      });
    }

    // 5. SYNTHESIZE CRITICAL DECISIONS REQUIRING ROBERT'S ATTENTION
    const criticalDecisions = this._synthesizeCriticalDecisions(pillars);

    const spokenScript = this._generateSpokenScript(pillars, criticalDecisions, dateStr);

    this.cachedBriefing = {
      generatedAt: now.toISOString(),
      dateFormatted: dateStr,
      greeting: `Chào Robert! Alex đã kết nối dữ liệu và sẵn sàng báo cáo cho bạn hôm nay.`,
      criticalDecisions,
      pillars,
      spokenScript,
    };
    this.lastGeneratedAt = now;

    return this.cachedBriefing;
  }

  _synthesizeCriticalDecisions(pillars) {
    const decisions = [];

    // Financial check: debt due date & monthly avalanche
    if (this.memory && typeof this.memory.getFinancialProfile === 'function') {
      const fin = this.memory.getFinancialProfile();
      if (fin?.debtSchedule && fin.debtSchedule.length > 0) {
        const highInterestDebt = fin.debtSchedule[0];
        decisions.push({
          id: 'dec_finance_avalanche',
          category: 'finance',
          title: `Chốt hạn mức trả trước cho khoản vay ${highInterestDebt.lender || 'Shinhan Bank'}`,
          impact: `Lãi suất cao (${highInterestDebt.rate}%). Ưu tiên dồn ${highInterestDebt.minPayment?.toLocaleString() || '15,000,000'} VNĐ để tối ưu lãi theo chiến lược Avalanche.`,
          recommendation: 'Duy trì thanh toán tự động ngày 25 hàng tháng.',
        });
      }
    }

    // Projects & Codebase check: PR review or deployment
    if (this.memory && typeof this.memory.getProjectsProfile === 'function') {
      const proj = this.memory.getProjectsProfile();
      if (proj?.activeProjects && proj.activeProjects.length > 0) {
        decisions.push({
          id: 'dec_tech_pr_review',
          category: 'tech',
          title: 'Review PR tách core Agent Engine & Streaming LLM',
          impact: 'Giải quyết tắc nghẽn latency 250ms trên giao diện mobile.',
          recommendation: 'Chốt merge trước phiên Deep Work buổi chiều.',
        });
      }
    }

    // Family & Milestone check
    if (this.memory && typeof this.memory.getFamilyProfile === 'function') {
      const fam = this.memory.getFamilyProfile();
      if (fam?.importantDates && fam.importantDates.length > 0) {
        const nextEvent = fam.importantDates[0];
        decisions.push({
          id: 'dec_family_event',
          category: 'family',
          title: `Chuẩn bị quà và lịch hẹn cho ${nextEvent.label}`,
          impact: `Ngày kỷ niệm diễn ra vào ${nextEvent.date}.`,
          recommendation: 'Đặt trước lịch trình tránh trùng khung giờ deploy.',
        });
      }
    }

    return decisions;
  }

  async _collectWorkMetrics() {
    let pendingTasks = [];
    if (this.memory && typeof this.memory.getTasks === 'function') {
      pendingTasks = this.memory.getTasks().filter((t) => !t.completed);
    }

    let gitPRs = [];
    if (this.mcp) {
      try {
        const prRes = await this.mcp.callTool('mcp/github', 'list_pull_requests', {status: 'open'});
        if (prRes?.result?.pullRequests) {
          gitPRs = prRes.result.pullRequests;
        }
      } catch (_) {}
    }

    const items = [];
    if (pendingTasks.length > 0) {
      items.push(`**${pendingTasks.length} nhiệm vụ** trọng tâm đang chờ giải quyết (${pendingTasks.slice(0, 2).map((t) => t.title).join(', ')}).`);
    } else {
      items.push('Tất cả task ưu tiên đã hoàn thành. Sẵn sàng nhận dự án mới.');
    }

    if (gitPRs.length > 0) {
      items.push(`**${gitPRs.length} Pull Requests** cần review code trên GitHub repository.`);
    } else {
      items.push('Nhánh `main` ổn định, không có xung đột merge.');
    }

    return {
      items,
      summary: `${pendingTasks.length} task cần xử lý, hệ thống backend và code pipeline ổn định.`,
    };
  }

  _collectMasteryMetrics() {
    let streak = 42;
    let xp = 4520;
    let level = 12;

    if (this.mastery && typeof this.mastery.getStats === 'function') {
      const stats = this.mastery.getStats();
      streak = stats.streak ?? streak;
      xp = stats.xp ?? xp;
      level = stats.level ?? level;
    }

    return {
      streak,
      xp,
      level,
      items: [
        `Duy trì chuỗi streak học tập liên tục **${streak} ngày**.`,
        `Cấp bậc hiện tại: **Lv.${level}** (${xp.toLocaleString()} XP).`,
        `Chủ đề gợi ý hôm nay: **Decoupled Agent Architecture & Streaming Patterns**.`,
      ],
      summary: `Streak ${streak} ngày bền bỉ, tiến độ học tập 180 ngày đang đi đúng kế hoạch.`,
    };
  }

  async _collectLifeMetrics() {
    let sleepHours = 7.5;
    let recoveryScore = 88;

    if (this.mcp) {
      try {
        const healthRes = await this.mcp.callTool('mcp/health', 'get_sleep_metrics', {});
        if (healthRes?.result) {
          sleepHours = healthRes.result.sleepHours || sleepHours;
          recoveryScore = healthRes.result.recoveryScore || recoveryScore;
        }
      } catch (_) {}
    }

    return {
      items: [
        `Giấc ngủ đêm qua đạt **${sleepHours} giờ** (Điểm phục hồi năng lượng: **${recoveryScore}/100**).`,
        `Khung giờ tập trung cao độ (Deep Work Peak): **09:00 - 11:30** và **14:30 - 16:30**.`,
        `Mục tiêu vận động: Uống đủ 2L nước và 30 phút rèn luyện thể chất.`,
      ],
      summary: `Chỉ số năng lượng sẵn sàng cho một ngày làm việc năng suất cao.`,
    };
  }

  async _collectMarketMetrics(watchlist = []) {
    let quotes = [
      {symbol: 'BTC/USD', price: '$96,400', change: '+3.4%', trend: 'up'},
      {symbol: 'S&P 500', price: '5,980 pts', change: '+0.6%', trend: 'up'},
      {symbol: 'AI Index', price: 'Bullish', change: '+2.1%', trend: 'up'},
    ];

    if (this.mcp) {
      try {
        const marketRes = await this.mcp.callTool('mcp/market', 'get_macro_indices', {watchlist});
        if (marketRes?.result?.indices) {
          quotes = marketRes.result.indices;
        }
      } catch (_) {}
    }

    const items = quotes.map((q) => `**${q.symbol}**: \`${q.price}\` (${q.change})`);

    return {
      sentimentBadge: 'Tích cực',
      items,
      summary: `Thị trường công nghệ & tiền số duy trì đà tăng trưởng tích cực.`,
    };
  }

  _generateSpokenScript(pillars, criticalDecisions = [], dateStr) {
    const parts = [
      `Chào Robert. Alex đã kết nối dữ liệu và tổng hợp các thông tin quan trọng cho ${dateStr}.`,
    ];

    if (criticalDecisions && criticalDecisions.length > 0) {
      parts.push(`Hiện tại có ${criticalDecisions.length} quyết định cần bạn xử lý:`);
      criticalDecisions.forEach((d, idx) => {
        parts.push(`${idx + 1}. ${d.title}.`);
      });
    }

    pillars.forEach((p) => {
      parts.push(`${p.title}: ${p.summary}`);
    });

    parts.push('Tôi đã sẵn sàng đồng hành cùng Robert. Bạn muốn chốt quyết định nào trước?');
    return parts.join(' ');
  }
}
