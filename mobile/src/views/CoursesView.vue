<script setup>
import {ref, computed} from 'vue';
import ScreenHeader from '../components/base/ScreenHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
import {useProgress} from '../composables/useProgress.js';
import content from '../content/lessons.json';

const {isComplete, hasPassedLesson} = useProgress();
const searchQuery = ref('');
const selectedTrack = ref('all');
const activeRefModalTopic = ref(null);

const TRACKS = [
  {key: 'all', label: 'Tất cả', icon: 'grid'},
  {key: 'ai_security', label: 'AI & Security', icon: 'shield'},
  {key: 'backend', label: 'Backend & Kiến trúc', icon: 'server'},
  {key: 'career', label: 'Phỏng vấn & Sự nghiệp', icon: 'briefcase'},
  {key: 'daily', label: 'Giao tiếp & Phát âm', icon: 'users'},
];

const TOPIC_TRACK_MAP = {
  'topic-19-ai-ml-security': 'ai_security',
  'topic-5-ai-ml-pipelines': 'ai_security',
  'topic-12-llm-system-architecture': 'ai_security',
  'topic-13-prompt-engineering': 'ai_security',
  'topic-14-ai-tech-talks': 'ai_security',
  'topic-18-ai-ml-roadmap': 'ai_security',
  'certification-prep': 'ai_security',

  'topic-2-system-design': 'backend',
  'topic-3-api-microservices': 'backend',
  'topic-4-cloud-infrastructure': 'backend',
  'topic-6-automation-workflow': 'backend',

  'topic-1-introduce-yourself': 'career',
  'topic-7-project-storytelling': 'career',
  'topic-8-problem-solving': 'career',
  'topic-9-team-communication': 'career',
  'topic-10-salary-negotiation': 'career',
  'topic-15-en-reading-lab': 'career',
  'topic-16-en-technical-writing': 'career',
  'topic-17-finance-career': 'career',

  'topic-11-daily-with-kids': 'daily',
  'pronunciation-guide': 'daily',
};

const HIGHLIGHT_ALIASES = {
  amber: '#f59e0b',
  emerald: '#10b981',
  blue: '#3d4ee8',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#4f46e5',
  coral: '#ef4444',
  red: '#dc2626',
};

function topicDotColor(highlight) {
  return HIGHLIGHT_ALIASES[highlight] || highlight || 'var(--color-accent)';
}

const topics = computed(() => {
  const byTopic = {};
  for (const lesson of content.lessons) {
    const t = (byTopic[lesson.topicSlug] ||= {
      topicSlug: lesson.topicSlug,
      topicTitle: lesson.topicTitle,
      topicDescription: lesson.topicDescription || '',
      topicHighlight: lesson.topicHighlight,
      track: TOPIC_TRACK_MAP[lesson.topicSlug] || 'backend',
      lessons: [],
      references: [],
    });
    t.lessons.push(lesson);
    if (lesson.references && lesson.references.length) {
      for (const r of lesson.references) {
        if (!t.references.some((existing) => existing.url === r.url)) {
          t.references.push(r);
        }
      }
    }
  }

  const query = searchQuery.value.trim().toLowerCase();
  let allTopics = Object.values(byTopic);

  // Filter by track
  if (selectedTrack.value !== 'all') {
    allTopics = allTopics.filter((t) => t.track === selectedTrack.value);
  }

  if (!query) return allTopics;

  return allTopics
    .map((topic) => {
      const filtered = topic.lessons.filter(
        (l) =>
          l.shortTitle.toLowerCase().includes(query) ||
          topic.topicTitle.toLowerCase().includes(query) ||
          String(l.day).includes(query),
      );
      return {...topic, lessons: filtered};
    })
    .filter((topic) => topic.lessons.length > 0);
});

function getTopicProgress(topic) {
  const total = topic.lessons.length;
  const completed = topic.lessons.filter((l) => isComplete(l) || hasPassedLesson(l)).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return {completed, total, percent};
}

function openRefModal(topic) {
  activeRefModalTopic.value = topic;
}

function closeRefModal() {
  activeRefModalTopic.value = null;
}
</script>

<template>
  <section class="courses">
    <ScreenHeader
      eyebrow="COURSES · LỘ TRÌNH CHUYÊN SÂU"
      title="Khóa học & Lộ trình Mastery"
      subtitle="Danh sách các chủ đề kiến trúc hệ thống, AI Security, kỹ năng phỏng vấn và giao tiếp hàng ngày."
    />

    <!-- Search Input with Clean SVG -->
    <div class="courses__search-wrap">
      <svg class="courses__search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        v-model="searchQuery"
        type="search"
        class="courses__search"
        placeholder="Tìm kiếm chủ đề, AI Security, bài học..."
        aria-label="Tìm kiếm bài học"
      />
      <button
        v-if="searchQuery"
        type="button"
        class="courses__search-clear"
        aria-label="Xóa tìm kiếm"
        @click="searchQuery = ''"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Track Filter Tabs with SVG Icons -->
    <div class="courses__tracks-bar">
      <button
        v-for="track in TRACKS"
        :key="track.key"
        type="button"
        class="courses__track-chip"
        :class="{'courses__track-chip--active': selectedTrack === track.key}"
        @click="selectedTrack = track.key"
      >
        <svg v-if="track.icon === 'grid'" class="track-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <svg v-else-if="track.icon === 'shield'" class="track-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <svg v-else-if="track.icon === 'server'" class="track-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
        <svg v-else-if="track.icon === 'briefcase'" class="track-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
        <svg v-else-if="track.icon === 'users'" class="track-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>{{ track.label }}</span>
      </button>
    </div>

    <!-- Topics Group List -->
    <div class="courses__topics-container">
      <article
        v-for="topic in topics"
        :key="topic.topicSlug"
        class="courses__topic-card"
      >
        <div class="courses__topic-header">
          <div class="courses__topic-title-wrap">
            <span
              class="courses__topic-dot"
              :style="{background: topicDotColor(topic.topicHighlight)}"
              aria-hidden="true"
            ></span>
            <div class="courses__topic-name-wrap">
              <h2 class="courses__topic-title">{{ topic.topicTitle }}</h2>
              <p v-if="topic.topicDescription" class="courses__topic-desc">
                {{ topic.topicDescription }}
              </p>
            </div>
          </div>

          <div class="courses__topic-actions">
            <button
              v-if="topic.references && topic.references.length"
              type="button"
              class="courses__topic-ref-btn"
              title="Xem tài liệu tham khảo của chủ đề"
              @click="openRefModal(topic)"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Tài liệu</span>
            </button>
            <span class="courses__topic-counter">
              {{ getTopicProgress(topic).completed }}/{{ getTopicProgress(topic).total }} bài
            </span>
          </div>
        </div>

        <!-- Topic Progress Mini Bar -->
        <div class="courses__topic-bar">
          <div
            class="courses__topic-bar-fill"
            :style="{
              width: `${getTopicProgress(topic).percent}%`,
              background: topicDotColor(topic.topicHighlight),
            }"
          ></div>
        </div>

        <!-- Lessons List -->
        <ul class="courses__list">
          <li
            v-for="lesson in topic.lessons"
            :key="lesson.lessonNum"
            class="courses__item"
          >
            <router-link
              class="courses__link"
              :class="{'courses__link--done': isComplete(lesson) || hasPassedLesson(lesson)}"
              :to="{
                name: 'lesson',
                params: {topicSlug: topic.topicSlug, lessonNum: lesson.lessonNum},
              }"
            >
              <span class="courses__link-mark">
                <svg v-if="isComplete(lesson) || hasPassedLesson(lesson)" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span v-else class="courses__link-day">D{{ lesson.day }}</span>
              </span>
              <div class="courses__link-content">
                <span class="courses__link-title">{{ lesson.shortTitle }}</span>
                <span v-if="lesson.description" class="courses__link-sub">{{ lesson.description }}</span>
              </div>
              <svg class="courses__link-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </router-link>
          </li>
        </ul>
      </article>
    </div>

    <!-- Empty State -->
    <p v-if="topics.length === 0" class="courses__empty">
      Không tìm thấy bài học nào phù hợp với bộ lọc hiện tại.
    </p>

    <!-- References Modal Dialog -->
    <div
      v-if="activeRefModalTopic"
      class="ref-modal-overlay"
      @click.self="closeRefModal"
    >
      <div class="ref-modal" role="dialog" aria-modal="true">
        <div class="ref-modal__header">
          <div class="ref-modal__title-wrap">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <h3 class="ref-modal__title">Tài liệu tham khảo: {{ activeRefModalTopic.topicTitle }}</h3>
          </div>
          <button
            type="button"
            class="ref-modal__close"
            aria-label="Đóng"
            @click="closeRefModal"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="ref-modal__body">
          <p class="ref-modal__intro">
            Các tài liệu chính thống, sách chuyên ngành, RFCs, báo cáo nghiên cứu và công cụ mã nguồn mở được tuyển chọn cho chủ đề này:
          </p>
          <div class="ref-modal__list">
            <a
              v-for="(r, idx) in activeRefModalTopic.references"
              :key="idx"
              :href="r.url"
              target="_blank"
              rel="noopener noreferrer"
              class="ref-modal__link-card"
            >
              <span class="ref-modal__link-title">{{ r.title }}</span>
              <span class="ref-modal__link-url">{{ r.url }}</span>
            </a>
          </div>
        </div>

        <div class="ref-modal__footer">
          <BaseButton variant="outline" @click="closeRefModal">Đóng</BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.courses {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg) calc(6.5rem + env(safe-area-inset-bottom));
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

/* Search Bar */
.courses__search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.courses__search-icon {
  position: absolute;
  left: var(--space-md);
  stroke: var(--color-ink-3);
  pointer-events: none;
}

.courses__search {
  width: 100%;
  height: 2.85rem;
  padding: 0 var(--space-xl) 0 2.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper-2);
  color: var(--color-ink);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  box-shadow: var(--color-shadow-card);
  transition: border-color var(--dur-fast) var(--ease-out);
}

.courses__search:focus {
  outline: 2px solid var(--color-focus);
  border-color: var(--color-accent);
}

.courses__search-clear {
  position: absolute;
  right: var(--space-sm);
  border: 0;
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-pill);
  display: grid;
  place-items: center;
  cursor: pointer;
}

/* Track Filter Chips */
.courses__tracks-bar {
  display: flex;
  gap: var(--space-xs);
  overflow-x: auto;
  padding: 0.2rem 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.courses__tracks-bar::-webkit-scrollbar {
  display: none;
}

.courses__track-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-hairline);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.track-icon {
  stroke: currentColor;
}

.courses__track-chip:hover {
  background: var(--color-paper-3);
}

.courses__track-chip--active {
  background: rgba(61, 78, 232, 0.14);
  color: #15112b;
  border-color: rgba(61, 78, 232, 0.4);
  box-shadow: 0 4px 12px -2px rgba(61, 78, 232, 0.12);
  font-weight: 700;
}

.courses__track-chip--active .track-icon {
  stroke: #15112b;
}

/* Topics List */
.courses__topics-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.courses__topic-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
  box-shadow: var(--color-shadow-card);
}

.courses__topic-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.courses__topic-title-wrap {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
  flex: 1;
  min-width: 0;
}

.courses__topic-dot {
  flex: none;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: var(--radius-pill);
  margin-top: 0.35rem;
}

.courses__topic-name-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.courses__topic-title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-ink);
}

.courses__topic-desc {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
  line-height: 1.4;
}

.courses__topic-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
}

.courses__topic-ref-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid var(--color-border);
  background: var(--color-paper);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  font-weight: 600;
  padding: 0.25rem 0.55rem;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.courses__topic-ref-btn:hover {
  background: var(--color-accent);
  color: var(--color-on-accent);
  border-color: var(--color-accent);
}

.courses__topic-counter {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink-2);
  background: var(--color-paper-3);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-pill);
}

.courses__topic-bar {
  width: 100%;
  height: 4px;
  background: var(--color-paper-3);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.courses__topic-bar-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width var(--dur-slow) var(--ease-out);
}

.courses__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.courses__link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius-input);
  background: var(--color-paper);
  color: var(--color-ink);
  text-decoration: none;
  min-height: 44px;
  transition: all var(--dur-fast) var(--ease-out);
}

.courses__link:hover {
  background: var(--color-paper-3);
  transform: translateX(2px);
}

.courses__link--done {
  background: rgba(16, 185, 129, 0.06);
}

.courses__link-mark {
  display: grid;
  place-items: center;
  flex: none;
  min-width: 2.2em;
  padding: 0.15em 0.45em;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink-2);
}

.courses__link--done .courses__link-mark {
  background: var(--color-accent-2);
  color: var(--color-on-accent);
}

.courses__link-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.courses__link-title {
  font-size: var(--text-sm);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.courses__link-sub {
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.courses__link-chevron {
  flex: none;
  stroke: var(--color-ink-3);
}

.courses__empty {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-ink-2);
  font-size: var(--text-base);
}

/* Modal */
.ref-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(21, 17, 43, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: grid;
  place-items: center;
  padding: var(--space-lg);
}

.ref-modal {
  background: var(--color-paper);
  border-radius: var(--radius-card);
  max-width: 32rem;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 48px -12px rgba(21, 17, 43, 0.35);
  overflow: hidden;
}

.ref-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-hairline);
}

.ref-modal__title-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.ref-modal__title {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 700;
}

.ref-modal__close {
  border: 0;
  background: var(--color-paper-3);
  border-radius: var(--radius-pill);
  width: 1.8rem;
  height: 1.8rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--color-ink);
}

.ref-modal__body {
  padding: var(--space-md) var(--space-lg);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.ref-modal__intro {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}

.ref-modal__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.ref-modal__link-card {
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius-input);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.ref-modal__link-card:hover {
  background: var(--color-paper-3);
}

.ref-modal__link-title {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-accent);
}

.ref-modal__link-url {
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ref-modal__footer {
  padding: var(--space-sm) var(--space-lg);
  border-top: 1px solid var(--color-hairline);
  display: flex;
  justify-content: flex-end;
}
</style>
