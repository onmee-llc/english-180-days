<script setup>
import {onMounted, ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';
import {useApiKey} from '../composables/useApiKey.js';
import {useMasteryPoints} from '../composables/useMasteryPoints.js';
import {getBadges} from '../composables/useBadges.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
import Card from '../components/base/Card.vue';
import TextField from '../components/base/TextField.vue';
import content from '../content/lessons.json';
import {version as appVersion} from '../../package.json';

const {
  user,
  progress,
  signOut,
  setDailyGoal,
  setWeeklyGoalDays,
} = useProgress();

const router = useRouter();
const {time, init: initReminder, setTime} = useReminder();
const {apiKey, init: initApiKey, setApiKey} = useApiKey();
const {totalXp, currentLevel, nextLevel, levelProgressPercent, history} = useMasteryPoints();

const totalLessonsCount = computed(() => content.lessons?.length || 242);
const completedCount = computed(() => progress.value.completed?.length || 0);
const completionPercentage = computed(() =>
  Math.min(100, Math.round((completedCount.value / (totalLessonsCount.value || 1)) * 100)),
);

const streakCount = computed(() => Object.keys(progress.value.streak || {}).length);
const speakCount = computed(() => progress.value.speakCount || 0);
const dailyGoal = computed(() => progress.value.dailyGoal || 1);
const weeklyGoalDays = computed(() => progress.value.weeklyGoalDays || 5);

// Check today's progress toward daily goal
const todayISO = new Date().toISOString().slice(0, 10);
const isTodayCompleted = computed(() => !!progress.value.streak?.[todayISO]);
const todayProgressCount = computed(() => (isTodayCompleted.value ? 1 : 0));

const badges = computed(() =>
  getBadges({
    streakCount: streakCount.value,
    completedCount: completedCount.value,
    speakCount: speakCount.value,
  }),
);

// Generate 7-day activity strip
const last7Days = computed(() => {
  const days = [];
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const dayLabel = dayNames[d.getDay()];
    const dateNum = d.getDate();
    const isDone = !!progress.value.streak?.[iso];
    const isToday = iso === todayISO;
    days.push({iso, dayLabel, dateNum, isDone, isToday});
  }
  return days;
});

const userInitials = computed(() => {
  if (!user.value) return 'R';
  const name = user.value.displayName || user.value.email || 'Robert';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

const apiKeyDraft = ref('');
const apiKeySaved = ref(false);
const apiKeyError = ref('');
const isTestingKey = ref(false);
const keyTestResult = ref('');

// Alex AI Preferences
const alexMuteOnLaunch = ref(true);
const alexSelectedModel = ref('hybrid_gemma_gemini');
const alexMonitoredPillars = ref(['work', 'mastery', 'life', 'market']);
const alexLearnedTraits = ref(['Súc tích & Trọng tâm', 'Kỹ thuật chuyên sâu', 'Không dùng emoji']);

function toggleMonitoredPillar(pillarId) {
  if (alexMonitoredPillars.value.includes(pillarId)) {
    if (alexMonitoredPillars.value.length > 1) {
      alexMonitoredPillars.value = alexMonitoredPillars.value.filter((p) => p !== pillarId);
    }
  } else {
    alexMonitoredPillars.value.push(pillarId);
  }
}

async function handleApiKeyBlur() {
  if (apiKeyDraft.value.trim() === apiKey.value) return;
  apiKeyError.value = '';
  keyTestResult.value = '';
  try {
    await setApiKey(apiKeyDraft.value.trim());
    apiKeySaved.value = true;
    setTimeout(() => (apiKeySaved.value = false), 2500);
  } catch (err) {
    apiKeyError.value = 'Không thể lưu API key. Vui lòng thử lại.';
  }
}

async function handleTestApiKey() {
  const keyToTest = (apiKeyDraft.value || apiKey.value || '').trim();
  if (!keyToTest) {
    apiKeyError.value = 'Vui lòng nhập API key trước khi kiểm tra.';
    return;
  }

  isTestingKey.value = true;
  apiKeyError.value = '';
  keyTestResult.value = '';

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(keyToTest)}`,
    );
    if (res.ok) {
      keyTestResult.value = 'Kết nối thành công với Gemini API.';
    } else {
      apiKeyError.value = 'API key không hợp lệ hoặc đã hết hạn.';
    }
  } catch (err) {
    apiKeyError.value = 'Lỗi kết nối mạng khi kiểm tra API key.';
  } finally {
    isTestingKey.value = false;
  }
}

async function handleReminderChange(e) {
  const val = e.target.value;
  await setTime(val);
}

async function handleDailyGoalSelect(count) {
  await setDailyGoal(count);
}

async function handleWeeklyGoalSelect(days) {
  await setWeeklyGoalDays(days);
}

async function handleSignOut() {
  await signOut();
  router.push({name: 'login'});
}

onMounted(async () => {
  initReminder();
  await initApiKey();
  apiKeyDraft.value = apiKey.value;
});
</script>

<template>
  <section class="settings">
    <ScreenHeader
      eyebrow="PROFILE & MASTERY"
      title="Hồ sơ & Tiến trình Mastery"
      subtitle="Theo dõi điểm thưởng XP, cấp bậc năng lực, và quản lý thiết lập học tập."
    />

    <!-- User Profile & Mastery Level Card -->
    <Card class="profile-card">
      <div class="profile-card__header">
        <img
          v-if="user?.photoURL"
          :src="user.photoURL"
          :alt="user.displayName || user.email"
          class="profile-card__avatar"
        />
        <div v-else class="profile-card__avatar-fallback" aria-hidden="true">
          {{ userInitials }}
        </div>
        <div class="profile-card__info">
          <div class="profile-card__name-row">
            <h2 class="profile-card__name">{{ user?.displayName || 'Robert' }}</h2>
            <span class="profile-card__badge" :style="{borderColor: currentLevel.badgeColor, color: currentLevel.badgeColor}">
              Lv.{{ currentLevel.level }} · {{ currentLevel.title }}
            </span>
          </div>
          <p class="profile-card__email">{{ user?.email || 'Tài khoản Local' }}</p>
        </div>
      </div>

      <!-- XP Level Progress Bar -->
      <div class="profile-card__xp-section">
        <div class="profile-card__xp-header">
          <span class="profile-card__xp-title">Điểm tích lũy: <strong>{{ totalXp }} XP</strong></span>
          <span class="profile-card__xp-next">
            {{ levelProgressPercent }}% tới {{ nextLevel ? nextLevel.title : 'Đỉnh cao' }}
          </span>
        </div>
        <div class="profile-card__xp-bar">
          <div
            class="profile-card__xp-bar-fill"
            :style="{width: `${levelProgressPercent}%`, background: currentLevel.badgeColor}"
          ></div>
        </div>
      </div>
    </Card>

    <!-- Learning Progress & Stats Overview -->
    <section class="section-block">
      <h3 class="section-title">
        <svg class="section-title__svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <span>Thống kê quá trình học</span>
      </h3>

      <div class="stats-grid">
        <div class="stat-card">
          <svg class="stat-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <div class="stat-card__content">
            <span class="stat-card__number">{{ streakCount }}</span>
            <span class="stat-card__label">Ngày chuỗi</span>
          </div>
        </div>

        <div class="stat-card">
          <svg class="stat-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <div class="stat-card__content">
            <span class="stat-card__number">{{ completedCount }}/{{ totalLessonsCount }}</span>
            <span class="stat-card__label">Bài hoàn thành</span>
          </div>
        </div>

        <div class="stat-card">
          <svg class="stat-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          </svg>
          <div class="stat-card__content">
            <span class="stat-card__number">{{ speakCount }}</span>
            <span class="stat-card__label">Lượt luyện nói</span>
          </div>
        </div>

        <div class="stat-card">
          <svg class="stat-card__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-accent-3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div class="stat-card__content">
            <span class="stat-card__number">{{ completionPercentage }}%</span>
            <span class="stat-card__label">Tiến độ khóa</span>
          </div>
        </div>
      </div>

      <!-- Course Progress Bar -->
      <Card class="progress-bar-card">
        <div class="progress-bar-card__meta">
          <span class="progress-bar-card__title">Lộ trình Daily Mastery (19 Chủ đề)</span>
          <span class="progress-bar-card__percent">{{ completionPercentage }}%</span>
        </div>
        <div class="progress-bar" role="progressbar" :aria-valuenow="completionPercentage" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar__fill" :style="{width: `${completionPercentage}%`}"></div>
        </div>
        <p class="progress-bar-card__subtext">
          Đã vượt qua {{ completedCount }} trên tổng số {{ totalLessonsCount }} bài học.
        </p>
      </Card>

      <!-- 7-Day Activity Strip -->
      <Card class="activity-card">
        <div class="activity-card__header">
          <span class="activity-card__title">Chuyên cần 7 ngày qua</span>
          <span class="activity-card__status">
            {{ isTodayCompleted ? 'Hôm nay đã học' : 'Chưa học hôm nay' }}
          </span>
        </div>
        <div class="activity-strip">
          <div
            v-for="day in last7Days"
            :key="day.iso"
            class="activity-day"
            :class="{
              'activity-day--done': day.isDone,
              'activity-day--today': day.isToday,
            }"
          >
            <span class="activity-day__name">{{ day.dayLabel }}</span>
            <span class="activity-day__circle">
              <span v-if="day.isDone" class="activity-day__check">✓</span>
              <span v-else class="activity-day__date">{{ day.dateNum }}</span>
            </span>
          </div>
        </div>
      </Card>
    </section>

    <!-- AI Architecture & $0 Cost Transparency Panel -->
    <section class="section-block">
      <h3 class="section-title">
        <svg class="section-title__svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>Mô hình AI & Cơ chế Chi phí $0</span>
      </h3>

      <Card class="ai-transparency-card">
        <div class="ai-transparency-item">
          <div class="ai-transparency-icon-wrap">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <h4 class="ai-transparency-item-title">Khóa học & Bài tập Offline ($0 Chi phí)</h4>
            <p class="ai-transparency-item-desc">
              Toàn bộ bài học, IPA, cấu trúc ngữ pháp, từ vựng và câu hỏi trắc nghiệm đã được audit và tích hợp 100% trong ứng dụng. Robert có thể học không cần mạng và không phát sinh chi phí.
            </p>
          </div>
        </div>

        <div class="ai-transparency-item">
          <div class="ai-transparency-icon-wrap">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </div>
          <div>
            <h4 class="ai-transparency-item-title">Giọng đọc Shadowing & Chấm điểm On-Device ($0)</h4>
            <p class="ai-transparency-item-desc">
              Sử dụng trực tiếp phần cứng thiết bị (Web SpeechSynthesis & Web SpeechRecognition) kết hợp thuật toán so khớp Levenshtein, chấm điểm ngay trên máy với tốc độ tức thì và $0 chi phí server.
            </p>
          </div>
        </div>

        <div class="ai-transparency-item">
          <div class="ai-transparency-icon-wrap">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div>
            <h4 class="ai-transparency-item-title">Luyện nói AI Tự do (Google AI Studio Free Tier)</h4>
            <p class="ai-transparency-item-desc">
              Chức năng Speak tự do kết nối với Gemini 2.0 Flash / Gemma qua Google AI Studio Free Tier với hạn mức 1,500 lượt trò chuyện/ngày hoàn toàn miễn phí.
            </p>
          </div>
        </div>
      </Card>
    </section>

    <!-- Git Repository & AI Coding Orchestration Settings -->
    <section class="section-block">
      <h3 class="section-title">
        <svg class="section-title__svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="6" y1="3" x2="6" y2="15" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
        <span>Kết nối Git & AI Coding Engines</span>
      </h3>

      <Card class="goals-card">
        <div class="goal-item">
          <div class="goal-item__header">
            <div class="goal-item__title-wrap">
              <span class="goal-item__title">Git Repository</span>
              <p class="goal-item__desc">Kho mã nguồn đồng bộ tự động với Alex AI Orchestrator</p>
            </div>
            <span class="p-badge p-badge--success">Connected</span>
          </div>
          <div style="margin-top: 8px; padding: 8px 12px; background: var(--p-surface-subdued, #f7f7f8); border-radius: 6px; font-family: var(--p-font-mono); font-size: 0.75rem; color: var(--p-ink-primary);">
            <code>https://github.com/onmee-llc/daily-mastery</code> (nhánh: <strong>main</strong>)
          </div>
        </div>

        <div class="goal-divider"></div>

        <div class="goal-item">
          <div class="goal-item__header">
            <div class="goal-item__title-wrap">
              <span class="goal-item__title">AI Coding Engines Được Kết Nối</span>
              <p class="goal-item__desc">Alex điều phối và phân rã nhiệm vụ cho các engine này khi Robert cần code hoặc fix bug</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: var(--p-surface-subdued, #f7f7f8); border-radius: 6px;">
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.8125rem; font-weight: 700; color: var(--p-ink-primary);">Google Antigravity (AGY SDK)</span>
                <span style="font-size: 0.7rem; color: var(--p-ink-secondary);">Autonomous Subagents · Terminal Sandbox · Multi-file Refactor</span>
              </div>
              <span class="p-badge p-badge--primary">Default</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: var(--p-surface-subdued, #f7f7f8); border-radius: 6px;">
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.8125rem; font-weight: 700; color: var(--p-ink-primary);">Claude Code (Anthropic)</span>
                <span style="font-size: 0.7rem; color: var(--p-ink-secondary);">Deep Code Reasoning · Architectural Synthesis · Bug Triage</span>
              </div>
              <span class="p-badge p-badge--success">Ready</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: var(--p-surface-subdued, #f7f7f8); border-radius: 6px;">
              <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.8125rem; font-weight: 700; color: var(--p-ink-primary);">OpenAI Codex</span>
                <span style="font-size: 0.7rem; color: var(--p-ink-secondary);">Rapid Function Synthesis · Boilerplate & Unit Tests</span>
              </div>
              <span class="p-badge p-badge--success">Ready</span>
            </div>
          </div>
        </div>
      </Card>
    </section>

    <!-- Learning Goals Target -->
    <section class="section-block">
      <h3 class="section-title">
        <svg class="section-title__svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <span>Mục tiêu rèn luyện</span>
      </h3>

      <Card class="goals-card">
        <div class="goal-item">
          <div class="goal-item__header">
            <div class="goal-item__title-wrap">
              <span class="goal-item__title">Mục tiêu bài học mỗi ngày</span>
              <p class="goal-item__desc">Duy trì việc học hàng ngày giúp bạn nhớ lâu hơn</p>
            </div>
            <span class="goal-item__current-badge" :class="{'goal-item__current-badge--done': isTodayCompleted}">
              {{ isTodayCompleted ? 'Đạt mục tiêu hôm nay' : `Hôm nay: ${todayProgressCount}/${dailyGoal}` }}
            </span>
          </div>

          <div class="goal-options">
            <button
              type="button"
              class="goal-pill"
              :class="{'goal-pill--active': dailyGoal === 1}"
              @click="handleDailyGoalSelect(1)"
            >
              <span class="goal-pill__number">1 bài</span>
              <span class="goal-pill__desc">Nhẹ nhàng (5p)</span>
            </button>
            <button
              type="button"
              class="goal-pill"
              :class="{'goal-pill--active': dailyGoal === 2}"
              @click="handleDailyGoalSelect(2)"
            >
              <span class="goal-pill__number">2 bài</span>
              <span class="goal-pill__desc">Tiêu chuẩn (10p)</span>
            </button>
            <button
              type="button"
              class="goal-pill"
              :class="{'goal-pill--active': dailyGoal === 3}"
              @click="handleDailyGoalSelect(3)"
            >
              <span class="goal-pill__number">3 bài</span>
              <span class="goal-pill__desc">Chăm chỉ (15p)</span>
            </button>
          </div>
        </div>

        <div class="goal-divider"></div>

        <div class="goal-item">
          <div class="goal-item__header">
            <div class="goal-item__title-wrap">
              <span class="goal-item__title">Mục tiêu số ngày học trong tuần</span>
              <p class="goal-item__desc">Số ngày bạn cam kết mở app luyện tập mỗi tuần</p>
            </div>
          </div>

          <div class="goal-options">
            <button
              type="button"
              class="goal-pill"
              :class="{'goal-pill--active': weeklyGoalDays === 3}"
              @click="handleWeeklyGoalSelect(3)"
            >
              <span class="goal-pill__number">3 ngày/tuần</span>
            </button>
            <button
              type="button"
              class="goal-pill"
              :class="{'goal-pill--active': weeklyGoalDays === 5}"
              @click="handleWeeklyGoalSelect(5)"
            >
              <span class="goal-pill__number">5 ngày/tuần</span>
            </button>
            <button
              type="button"
              class="goal-pill"
              :class="{'goal-pill--active': weeklyGoalDays === 7}"
              @click="handleWeeklyGoalSelect(7)"
            >
              <span class="goal-pill__number">7 ngày/tuần</span>
            </button>
          </div>
        </div>
      </Card>
    </section>

    <!-- Achievements & Badges -->
    <section class="section-block">
      <div class="section-header-row">
        <h3 class="section-title">
          <svg class="section-title__svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
          <span>Huy hiệu & Thành tích</span>
        </h3>
        <span class="section-counter">{{ badges.filter(b => b.earned).length }}/{{ badges.length }}</span>
      </div>

      <div class="badges-grid">
        <div
          v-for="badge in badges"
          :key="badge.id"
          class="badge-card"
          :class="{'badge-card--earned': badge.earned}"
        >
          <div class="badge-card__content">
            <div class="badge-card__top">
              <span class="badge-card__label">{{ badge.label }}</span>
              <span v-if="badge.earned" class="badge-card__status badge-card__status--earned">Đã đạt</span>
              <span v-else class="badge-card__status">{{ badge.current }}/{{ badge.threshold }}</span>
            </div>
            <p class="badge-card__desc">{{ badge.description }}</p>
            <div v-if="!badge.earned" class="badge-card__mini-bar">
              <div class="badge-card__mini-bar-fill" :style="{width: `${Math.round(badge.progress * 100)}%`}"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- App Preferences & Utilities -->
    <section class="section-block">
      <h3 class="section-title">
        <svg class="section-title__svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>Cài đặt & Tiện ích</span>
      </h3>

      <!-- Reminder Time -->
      <Card class="setting-card">
        <div class="setting-card__header">
          <div class="setting-card__text">
            <span class="setting-card__title">Giờ nhắc nhở học tập</span>
            <p class="setting-card__desc">Gửi thông báo nhắc giữ vững chuỗi học tập mỗi ngày</p>
          </div>
        </div>
        <TextField
          id="reminder-time"
          type="time"
          label="Thời gian nhắc nhở"
          :model-value="time"
          @change="handleReminderChange"
        />
      </Card>

      <!-- Alex AI Co-pilot & Briefing Preferences -->
      <Card class="setting-card">
        <div class="setting-card__header">
          <div class="setting-card__text">
            <div class="setting-card__title-row">
              <span class="setting-card__title">Alex AI Co-pilot & Báo Cáo Giám Sát</span>
              <span class="key-status-pill key-status-pill--active">Hoạt động</span>
            </div>
            <p class="setting-card__desc">Thiết lập âm thanh mặc định, trụ cột giám sát và mô hình suy luận on-device/cloud cho Alex.</p>
          </div>
        </div>

        <!-- Default Audio Toggle -->
        <div class="alex-pref-row">
          <div class="alex-pref-info">
            <span class="alex-pref-label">Tắt âm mặc định khi mở app</span>
            <span class="alex-pref-sub">Không phát âm thanh tự động cho đến khi bạn chủ động bật</span>
          </div>
          <button
            type="button"
            class="alex-toggle-btn"
            :class="{'alex-toggle-btn--on': alexMuteOnLaunch}"
            :aria-label="alexMuteOnLaunch ? 'Tắt âm đang bật' : 'Tắt âm đang tắt'"
            @click="alexMuteOnLaunch = !alexMuteOnLaunch"
          >
            <span class="alex-toggle-thumb"></span>
          </button>
        </div>

        <!-- Monitoring Pillars -->
        <div class="alex-pillar-group">
          <span class="alex-pref-field-label">Trụ cột giám sát trong Báo Cáo Đầu Ngày:</span>
          <div class="alex-pillar-grid">
            <button
              type="button"
              class="alex-pillar-chip"
              :class="{'alex-pillar-chip--selected': alexMonitoredPillars.includes('work')}"
              @click="toggleMonitoredPillar('work')"
            >
              <span>Công Việc & Git PRs</span>
            </button>
            <button
              type="button"
              class="alex-pillar-chip"
              :class="{'alex-pillar-chip--selected': alexMonitoredPillars.includes('mastery')}"
              @click="toggleMonitoredPillar('mastery')"
            >
              <span>Daily Mastery 180 Ngày</span>
            </button>
            <button
              type="button"
              class="alex-pillar-chip"
              :class="{'alex-pillar-chip--selected': alexMonitoredPillars.includes('life')}"
              @click="toggleMonitoredPillar('life')"
            >
              <span>Cuộc Sống & Năng Lượng</span>
            </button>
            <button
              type="button"
              class="alex-pillar-chip"
              :class="{'alex-pillar-chip--selected': alexMonitoredPillars.includes('market')}"
              @click="toggleMonitoredPillar('market')"
            >
              <span>Thị Trường & Tech Radar</span>
            </button>
          </div>
        </div>

        <!-- AI Model Strategy Selection -->
        <div class="alex-model-group">
          <label class="alex-pref-field-label" for="alex-model-select">Chiến lược Mô hình AI (Model Architecture):</label>
          <select id="alex-model-select" v-model="alexSelectedModel" class="alex-select-box">
            <option value="hybrid_gemma_gemini">Hybrid: Gemma 2B (On-Device) + Gemini 2.5 Flash (Cloud)</option>
            <option value="hybrid_llama_pro">Hybrid: LLaMA 3.2 1B (On-Device) + Gemini 1.5 Pro (Cloud)</option>
            <option value="cloud_only">Cloud Only: Gemini 2.5 Flash / Claude 3.5 Sonnet</option>
            <option value="edge_only">Edge Only: On-Device Small Language Model (Gemma/LLaMA)</option>
          </select>
        </div>

        <!-- Style Self-Tuning & Memory Profile -->
        <div class="alex-memory-box">
          <span class="alex-memory-title">Đặc tính phong cách đã học từ Robert:</span>
          <div class="alex-memory-chips">
            <span v-for="(trait, idx) in alexLearnedTraits" :key="idx" class="alex-trait-badge">
              ✓ {{ trait }}
            </span>
          </div>
        </div>
      </Card>

      <!-- Gemini AI API Key -->
      <Card class="setting-card">
        <div class="setting-card__header">
          <div class="setting-card__text">
            <div class="setting-card__title-row">
              <span class="setting-card__title">Gemini API Key (Tùy chọn cho Speak Tab)</span>
              <span
                class="key-status-pill"
                :class="{'key-status-pill--active': apiKey}"
              >
                {{ apiKey ? 'Đã kết nối' : 'Chưa kết nối' }}
              </span>
            </div>
            <p class="setting-card__desc">Dùng cho tính năng hội thoại âm thanh trực tiếp trong tab Speak.</p>
          </div>
        </div>

        <TextField
          id="gemini-api-key"
          type="password"
          label="Khóa bí mật API"
          v-model="apiKeyDraft"
          placeholder="AIzaSy..."
          autocomplete="off"
          :error="apiKeyError"
          :success="apiKeySaved ? 'Đã lưu API key' : keyTestResult"
          hint="API key được mã hóa và lưu an toàn chỉ trên thiết bị của bạn."
          @blur="handleApiKeyBlur"
        />

        <div class="api-key-actions">
          <BaseButton
            variant="outline"
            :loading="isTestingKey"
            loading-label="Đang kiểm tra…"
            @click="handleTestApiKey"
          >
            Kiểm tra kết nối
          </BaseButton>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            class="get-key-link"
          >
            Lấy key miễn phí tại Google AI Studio ↗
          </a>
        </div>
      </Card>
    </section>

    <!-- Sign Out & Info -->
    <div class="settings__footer-actions">
      <BaseButton variant="outline" tone="coral" class="signout-btn" @click="handleSignOut">
        Đăng xuất tài khoản
      </BaseButton>
      <p class="settings__version">Daily Mastery Mobile · v{{ appVersion }}</p>
    </div>
  </section>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg) calc(6.5rem + env(safe-area-inset-bottom));
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

/* Section Blocks */
.section-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* Alex AI Preferences Styling */
.alex-pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-hairline);
}

.alex-pref-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alex-pref-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink);
}

.alex-pref-sub {
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}

.alex-toggle-btn {
  width: 44px;
  height: 24px;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  border: 1px solid var(--color-border);
  position: relative;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
  padding: 0;
}

.alex-toggle-btn--on {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.alex-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-pill);
  background: #ffffff;
  transition: transform var(--dur-fast) var(--ease-out);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.alex-toggle-btn--on .alex-toggle-thumb {
  transform: translateX(20px);
}

.alex-pillar-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-hairline);
}

.alex-pref-field-label {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink);
}

.alex-pillar-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.alex-pillar-chip {
  padding: 8px 10px;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-border);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all var(--dur-fast) var(--ease-out);
}

.alex-pillar-chip--selected {
  border-color: var(--color-accent);
  background: rgba(61, 78, 232, 0.06);
  color: var(--color-accent);
  font-weight: 700;
}

.alex-model-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-hairline);
}

.alex-select-box {
  padding: 8px 10px;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-border-strong);
  background: var(--color-paper-2);
  color: var(--color-ink);
  font-size: var(--text-xs);
  outline: none;
}

.alex-memory-box {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alex-memory-title {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-ink-3);
  text-transform: uppercase;
}

.alex-memory-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.alex-trait-badge {
  font-size: var(--text-2xs);
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  border: 1px solid var(--color-hairline);
  color: var(--color-ink-2);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
  font-size: var(--text-md);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}

.section-title__svg {
  stroke: var(--color-accent);
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-counter {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
}

/* Profile Card */
.profile-card {
  box-shadow: var(--color-shadow-card);
  border: 1px solid var(--color-hairline);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.profile-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.profile-card__avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-pill);
  object-fit: cover;
  border: 2px solid var(--color-accent);
}

.profile-card__avatar-fallback {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: var(--text-md);
}

.profile-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.profile-card__name-row {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.profile-card__name {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 700;
}

.profile-card__badge {
  font-size: var(--text-2xs);
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid;
  background: var(--color-paper-2);
}

.profile-card__email {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}

.profile-card__xp-section {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-top: var(--space-xs);
  border-top: 1px solid var(--color-hairline);
}

.profile-card__xp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-xs);
}

.profile-card__xp-title {
  color: var(--color-ink);
}

.profile-card__xp-next {
  color: var(--color-ink-3);
  font-size: var(--text-2xs);
}

.profile-card__xp-bar {
  width: 100%;
  height: 6px;
  background: var(--color-paper-3);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.profile-card__xp-bar-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width var(--dur-slow) var(--ease-out);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xs);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
}

.stat-card__icon {
  flex: none;
}

.stat-card__content {
  display: flex;
  flex-direction: column;
}

.stat-card__number {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-ink);
}

.stat-card__label {
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

/* Progress bar */
.progress-bar-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.progress-bar-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-xs);
  font-weight: 700;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--color-paper-3);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: var(--radius-pill);
  transition: width var(--dur-slow) var(--ease-out);
}

.progress-bar-card__subtext {
  margin: 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
}

/* Activity Strip */
.activity-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.activity-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-xs);
}

.activity-card__title {
  font-weight: 700;
}

.activity-card__status {
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

.activity-strip {
  display: flex;
  justify-content: space-between;
  gap: 0.2rem;
}

.activity-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.activity-day__name {
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
}

.activity-day__circle {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  display: grid;
  place-items: center;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink-2);
}

.activity-day--done .activity-day__circle {
  background: var(--color-accent-2);
  color: var(--color-on-accent);
}

.activity-day--today .activity-day__circle {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

/* AI Transparency Card */
.ai-transparency-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
}

.ai-transparency-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
}

.ai-transparency-icon-wrap {
  margin-top: 0.15rem;
  flex: none;
}

.ai-transparency-item-title {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink);
}

.ai-transparency-item-desc {
  margin: 0.2rem 0 0;
  font-size: var(--text-2xs);
  line-height: 1.5;
  color: var(--color-ink-2);
}

/* Goals Card */
.goals-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.goal-item__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.goal-item__title {
  font-size: var(--text-sm);
  font-weight: 700;
}

.goal-item__desc {
  margin: 0.15rem 0 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

.goal-item__current-badge {
  font-size: var(--text-2xs);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  font-weight: 600;
}

.goal-item__current-badge--done {
  background: var(--color-accent-2-tint);
  color: var(--color-accent-2);
}

.goal-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
}

.goal-pill {
  padding: 0.5rem;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-hairline);
  background: var(--color-paper);
  color: var(--color-ink-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.goal-pill--active {
  background: var(--color-accent);
  color: var(--color-on-accent);
  border-color: var(--color-accent);
}

.goal-pill__number {
  font-size: var(--text-xs);
  font-weight: 700;
}

.goal-pill__desc {
  font-size: var(--text-2xs);
  opacity: 0.85;
}

.goal-divider {
  height: 1px;
  background: var(--color-hairline);
}

/* Badges Grid */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xs);
}

.badge-card {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
}

.badge-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge-card__label {
  font-size: var(--text-xs);
  font-weight: 700;
}

.badge-card__status {
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
  font-weight: 600;
}

.badge-card__status--earned {
  color: var(--color-accent-2);
}

.badge-card__desc {
  margin: 0.2rem 0 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

.badge-card__mini-bar {
  width: 100%;
  height: 3px;
  background: var(--color-paper-3);
  border-radius: var(--radius-pill);
  margin-top: 0.35rem;
  overflow: hidden;
}

.badge-card__mini-bar-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: var(--radius-pill);
}

/* Setting card */
.setting-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.setting-card__title {
  font-size: var(--text-sm);
  font-weight: 700;
}

.setting-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
}

.key-status-pill {
  font-size: var(--text-2xs);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  color: var(--color-ink-3);
  font-weight: 600;
}

.key-status-pill--active {
  background: var(--color-accent-2-tint);
  color: var(--color-accent-2);
}

.setting-card__desc {
  margin: 0.15rem 0 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

.api-key-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.get-key-link {
  font-size: var(--text-xs);
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
}

.settings__footer-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  margin-top: var(--space-md);
}

.signout-btn {
  width: 100%;
}

.settings__version {
  margin: 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
}
</style>
