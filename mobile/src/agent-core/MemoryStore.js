/**
 * Hierarchical Memory System for Personal AI Agent.
 * Stores Short-term / Working memory, Episodic conversation threads,
 * and Long-term user profile & preferences.
 */

const STORAGE_KEY_PROFILE = 'dm_agent_profile';
const STORAGE_KEY_THREADS = 'dm_agent_threads';
const STORAGE_KEY_TASKS = 'dm_agent_tasks';
const STORAGE_KEY_NOTES = 'dm_agent_notes';

export const DEFAULT_CHANNELS = [
  {
    id: 'companion',
    title: 'Daily Companion',
    icon: 'spark',
    persona: 'companion',
    unreadCount: 0,
    description: 'Trợ lý điều phối công việc & người bạn đồng hành',
  },
  {
    id: 'engineering',
    title: 'AI & Engineering',
    icon: 'code',
    persona: 'engineer',
    unreadCount: 0,
    description: 'Co-pilot kỹ thuật, system design & machine learning',
  },
  {
    id: 'english',
    title: 'English Coach',
    icon: 'voice',
    persona: 'english_coach',
    unreadCount: 0,
    description: 'Luyện giao tiếp, ngữ điệu & từ vựng công sở',
  },
  {
    id: 'finance',
    title: 'Finance & Strategy',
    icon: 'chart',
    persona: 'strategist',
    unreadCount: 0,
    description: 'Tư vấn chiến lược tài chính & phát triển sự nghiệp',
  },
  {
    id: 'inbox',
    title: 'Quick Inbox',
    icon: 'inbox',
    persona: 'inbox',
    unreadCount: 0,
    description: 'Thu thập nhanh ý tưởng, voice memo & ghi chú',
  },
];

export class MemoryStore {
  constructor(storageAdapter = null) {
    this._memoryFallback = new Map();
    this._storage = storageAdapter || (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function' ? localStorage : null);

    this.profile = this._loadJson(STORAGE_KEY_PROFILE, {
      name: 'Robert',
      title: 'Senior Principal / AI & Backend Engineer',
      goals: [
        'Hoàn thành 180 ngày Daily Mastery',
        'Xây dựng Personal AI Agent Architecture',
        'Nâng cao Technical English Fluency',
        'Tối ưu dòng tiền và tự do tài chính',
      ],
      preferences: {
        language: 'vi',
        tone: 'professional_friendly',
        autoSummarize: true,
        communicationStyle: 'concise_direct',
      },
      financialProfile: {
        monthlyCashflow: {
          primaryIncome: 'Thu nhập Kỹ sư AI / Lãnh đạo kỹ thuật',
          essentialBurnRate: 'Chi phí sinh hoạt tối thiểu',
        },
        debts: [
          {id: 'd_1', name: 'Kế hoạch trả nợ ưu tiên', totalAmount: 100000000, monthlyPayment: 5000000, strategy: 'Avalanche'},
        ],
        emergencyFundMonths: 6,
        investmentPortfolio: ['Crypto (BTC/ETH)', 'Tech Equities', 'Tiết kiệm thanh khoản'],
      },
      familyProfile: {
        importantPeople: [
          {relationship: 'Bố Mẹ', notes: 'Nhắc nhở sức khỏe, sinh nhật và thăm hỏi'},
          {relationship: 'Người thân yêu', notes: 'Ngày kỷ niệm, kế hoạch du lịch và chăm sóc'},
        ],
        coreValues: ['Gia đình', 'Tự do tài chính', 'Tinh thông nghề nghiệp', 'Sức khỏe'],
      },
      projectsProfile: [
        {name: 'Daily Mastery & Alex AI', repoUrl: 'https://github.com/onmee-llc/daily-mastery', role: 'Lead Architect'},
        {name: 'Rivyn Automation Scenarios', role: 'Core Engine'},
      ],
    });

    this.threads = this._loadJson(STORAGE_KEY_THREADS, this._createInitialThreads());
    this.tasks = this._loadJson(STORAGE_KEY_TASKS, [
      {id: 't_1', title: 'Audit Shopify Messaging UI/UX', category: 'work', completed: true, priority: 'high'},
      {id: 't_2', title: 'Xây dựng Agent Core Engine & Streaming', category: 'ai', completed: true, priority: 'high'},
      {id: 't_3', title: 'Luyện nói 5 phút: System Scalability', category: 'english', completed: false, priority: 'medium'},
    ]);
    this.notes = this._loadJson(STORAGE_KEY_NOTES, []);
  }

  _loadJson(key, defaultValue) {
    try {
      if (this._storage) {
        const raw = this._storage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
      }
      return this._memoryFallback.has(key) ? this._memoryFallback.get(key) : defaultValue;
    } catch (_) {
      return defaultValue;
    }
  }

  _saveJson(key, value) {
    try {
      if (this._storage) {
        this._storage.setItem(key, JSON.stringify(value));
      } else {
        this._memoryFallback.set(key, value);
      }
    } catch (_) {}
  }

  clear() {
    this._memoryFallback.clear();
    if (this._storage && typeof this._storage.clear === 'function') {
      try {
        this._storage.clear();
      } catch (_) {}
    }
  }

  _createInitialThreads() {
    const initial = {};
    DEFAULT_CHANNELS.forEach((ch) => {
      initial[ch.id] = {
        channelId: ch.id,
        messages: [
          {
            id: 'm_welcome_' + ch.id,
            role: 'model',
            content: `Xin chào! Tôi là **Alex (${ch.title})** của bạn trong Daily Mastery. Hôm nay chúng ta sẽ cùng giải quyết những mục tiêu nào?`,
            timestamp: new Date().toISOString(),
            telemetry: {tokensPerSec: 120, firstTokenMs: 45},
          },
        ],
      };
    });
    return initial;
  }

  // --- Profile Methods ---
  getProfile() {
    return this.profile;
  }

  updateProfile(updates) {
    this.profile = {...this.profile, ...updates};
    this._saveJson(STORAGE_KEY_PROFILE, this.profile);
    return this.profile;
  }

  getFinancialProfile() {
    return this.profile.financialProfile || {};
  }

  updateFinancialProfile(updates) {
    this.profile.financialProfile = {...(this.profile.financialProfile || {}), ...updates};
    this._saveJson(STORAGE_KEY_PROFILE, this.profile);
    return this.profile.financialProfile;
  }

  getFamilyProfile() {
    return this.profile.familyProfile || {};
  }

  updateFamilyProfile(updates) {
    this.profile.familyProfile = {...(this.profile.familyProfile || {}), ...updates};
    this._saveJson(STORAGE_KEY_PROFILE, this.profile);
    return this.profile.familyProfile;
  }

  getProjectsProfile() {
    return this.profile.projectsProfile || [];
  }

  updateProjectsProfile(updates) {
    this.profile.projectsProfile = updates;
    this._saveJson(STORAGE_KEY_PROFILE, this.profile);
    return this.profile.projectsProfile;
  }

  // --- Thread & Message Methods ---
  getThreadMessages(channelId) {
    if (!this.threads[channelId]) {
      this.threads[channelId] = {channelId, messages: []};
    }
    return this.threads[channelId].messages;
  }

  /**
   * Returns only messages created TODAY (same calendar day).
   * If it is a new day with no messages yet, returns a fresh single greeting message.
   */
  getTodayThreadMessages(channelId, todayISO = new Date().toISOString().slice(0, 10)) {
    const all = this.getThreadMessages(channelId);
    const todayMsgs = all.filter((m) => m.timestamp && m.timestamp.slice(0, 10) === todayISO);

    if (todayMsgs.length === 0) {
      return [
        {
          id: `m_today_${channelId}_${todayISO}`,
          role: 'model',
          content: `Xin chào Robert! Hôm nay (${todayISO}) chúng ta cần giải quyết những việc gì?`,
          timestamp: new Date().toISOString(),
          telemetry: {tokensPerSec: 120, firstTokenMs: 40},
        },
      ];
    }
    return todayMsgs;
  }

  /**
   * Returns messages created before TODAY.
   */
  getArchivedMessages(channelId, todayISO = new Date().toISOString().slice(0, 10)) {
    const all = this.getThreadMessages(channelId);
    return all.filter((m) => m.timestamp && m.timestamp.slice(0, 10) < todayISO);
  }

  hasPastArchivedMessages(channelId, todayISO = new Date().toISOString().slice(0, 10)) {
    return this.getArchivedMessages(channelId, todayISO).length > 0;
  }

  addMessage(channelId, message) {
    if (!this.threads[channelId]) {
      this.threads[channelId] = {channelId, messages: []};
    }
    const msg = {
      id: message.id || 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      role: message.role || 'user',
      content: message.content || '',
      thinking: message.thinking || null,
      toolsExecuted: message.toolsExecuted || [],
      actionCards: message.actionCards || [],
      telemetry: message.telemetry || null,
      timestamp: message.timestamp || new Date().toISOString(),
    };

    this.threads[channelId].messages.push(msg);
    this._saveJson(STORAGE_KEY_THREADS, this.threads);
    return msg;
  }

  updateMessage(channelId, messageId, updates) {
    const thread = this.threads[channelId];
    if (!thread) return null;
    const msg = thread.messages.find((m) => m.id === messageId);
    if (!msg) return null;
    Object.assign(msg, updates);
    this._saveJson(STORAGE_KEY_THREADS, this.threads);
    return msg;
  }

  clearThread(channelId) {
    if (this.threads[channelId]) {
      this.threads[channelId].messages = [];
      this._saveJson(STORAGE_KEY_THREADS, this.threads);
    }
  }

  // --- Task Store Methods ---
  getTasks() {
    return this.tasks;
  }

  addTask(task) {
    this.tasks.push(task);
    this._saveJson(STORAGE_KEY_TASKS, this.tasks);
    return task;
  }

  toggleTask(taskId) {
    const t = this.tasks.find((x) => x.id === taskId);
    if (t) {
      t.completed = !t.completed;
      this._saveJson(STORAGE_KEY_TASKS, this.tasks);
    }
    return t;
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((x) => x.id !== taskId);
    this._saveJson(STORAGE_KEY_TASKS, this.tasks);
  }

  // --- Notes / Scratchpad ---
  getNotes() {
    return this.notes;
  }

  addNote(text) {
    const note = {
      id: 'note_' + Date.now(),
      text,
      createdAt: new Date().toISOString(),
    };
    this.notes.unshift(note);
    this._saveJson(STORAGE_KEY_NOTES, this.notes);
    return note;
  }

  deleteNote(noteId) {
    this.notes = this.notes.filter((n) => n.id !== noteId);
    this._saveJson(STORAGE_KEY_NOTES, this.notes);
  }
}
