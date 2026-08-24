import {ref, computed} from 'vue';

const STORAGE_KEY = 'daily_mastery_xp_v1';

export const MASTERY_LEVELS = [
  {
    level: 1,
    title: 'Học viên Khởi đầu',
    titleEn: 'Junior Communicator',
    minXp: 0,
    maxXp: 250,
    badgeColor: '#3d4ee8',
  },
  {
    level: 2,
    title: 'Kỹ sư Giao tiếp Chuyên nghiệp',
    titleEn: 'Technical Communicator',
    minXp: 250,
    maxXp: 750,
    badgeColor: '#10b981',
  },
  {
    level: 3,
    title: 'Chuyên gia Kiến trúc & AI',
    titleEn: 'Senior AI & Systems Specialist',
    minXp: 750,
    maxXp: 1500,
    badgeColor: '#f59e0b',
  },
  {
    level: 4,
    title: 'Thủ lĩnh Kỹ thuật & Kiến trúc sư',
    titleEn: 'Principal Technical Leader',
    minXp: 1500,
    maxXp: 3000,
    badgeColor: '#8b5cf6',
  },
];

export const XP_REWARDS = {
  EXAM_PASSED: 50,
  SPEAKING_PASSED: 25,
  SPEAK_SESSION: 20,
  SPACED_REPETITION: 10,
};

function loadStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {totalXp: 0, history: []};
    const parsed = JSON.parse(raw);
    return {
      totalXp: typeof parsed.totalXp === 'number' ? parsed.totalXp : 0,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return {totalXp: 0, history: []};
  }
}

function saveStoredData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const state = ref(loadStoredData());

export function useMasteryPoints() {
  const totalXp = computed(() => state.value.totalXp);

  const currentLevel = computed(() => {
    const xp = state.value.totalXp;
    for (let i = MASTERY_LEVELS.length - 1; i >= 0; i--) {
      if (xp >= MASTERY_LEVELS[i].minXp) {
        return MASTERY_LEVELS[i];
      }
    }
    return MASTERY_LEVELS[0];
  });

  const nextLevel = computed(() => {
    const cur = currentLevel.value;
    return MASTERY_LEVELS.find((l) => l.level === cur.level + 1) || null;
  });

  const levelProgressPercent = computed(() => {
    const cur = currentLevel.value;
    const next = nextLevel.value;
    if (!next) return 100;
    const range = next.minXp - cur.minXp;
    const gained = state.value.totalXp - cur.minXp;
    return Math.min(100, Math.max(0, Math.round((gained / range) * 100)));
  });

  function addXp(amount, reason = 'Hoàn thành bài tập') {
    if (typeof amount !== 'number' || amount <= 0) return;
    const newTotal = state.value.totalXp + amount;
    const newHistory = [
      {
        amount,
        reason,
        timestamp: new Date().toISOString(),
      },
      ...state.value.history.slice(0, 49),
    ];

    state.value = {
      totalXp: newTotal,
      history: newHistory,
    };
    saveStoredData(state.value);
  }

  function resetXp() {
    state.value = {totalXp: 0, history: []};
    saveStoredData(state.value);
  }

  return {
    totalXp,
    currentLevel,
    nextLevel,
    levelProgressPercent,
    history: computed(() => state.value.history),
    addXp,
    resetXp,
    XP_REWARDS,
    MASTERY_LEVELS,
  };
}
