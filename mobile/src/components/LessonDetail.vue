<script setup>
import {ref, computed, onUnmounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import BaseButton from './base/BaseButton.vue';
import {useSpeechAudio, SPEEDS, splitIntoSentences} from '../composables/useSpeechAudio.js';
import {usePronunciationEvaluator} from '../composables/usePronunciationEvaluator.js';
import {useProgress} from '../composables/useProgress.js';
import {useMasteryPoints, XP_REWARDS} from '../composables/useMasteryPoints.js';

const props = defineProps({
  lesson: {type: Object, required: true},
  isComplete: {type: Boolean, required: true},
});

const emit = defineEmits(['mark-complete', 'exam-passed']);
const router = useRouter();

const {saveExamResult} = useProgress();
const {addXp} = useMasteryPoints();

// Topics for English Learning, Communication, Daily Speaking, and Career
const SPOKEN_TOPIC_SLUGS = [
  'topic-1-introduce-yourself',
  'topic-2-system-architecture',
  'topic-3-technical-deep-dive',
  'topic-4-trade-offs-decisions',
  'topic-5-incident-postmortem',
  'topic-6-code-review-debate',
  'topic-7-behavioral-leadership',
  'topic-8-live-coding-thought',
  'topic-9-system-design-interview',
  'topic-10-cross-cultural-collaboration',
  'topic-11-daily-with-kids',
  'pronunciation-guide',
  'topic-12-negotiation-influence',
  'topic-13-remote-async-mastery',
  'topic-14-tech-talk-podcast',
  'topic-15-en-reading-lab',
  'topic-16-en-technical-writing',
  'topic-17-finance-career',
];

const isSpokenTopic = computed(() => {
  if (!props.lesson) return false;
  return SPOKEN_TOPIC_SLUGS.includes(props.lesson.topicSlug);
});

// Tabs: 'shadowing' | 'reading' | 'skills' | 'practice' | 'exam' | 'references'
const activeTab = ref('shadowing');
const showCelebration = ref(false);
const showIpa = ref(false);
const showViTranslation = ref(true);
const showOverviewDetails = ref(true);
const activePlayingWord = ref('');
const earnedXpNotification = ref(0);

// Audio Player
const speechAudio = useSpeechAudio();
const targetSentences = computed(() => {
  return splitIntoSentences(props.lesson.shadowingPassage || '');
});

// Pronunciation Evaluator
const evaluator = usePronunciationEvaluator();
const speakingTargetSentence = ref('');

watch(
  () => props.lesson,
  (newLesson) => {
    speechAudio.stop();
    evaluator.reset();
    if (newLesson) {
      if (SPOKEN_TOPIC_SLUGS.includes(newLesson.topicSlug)) {
        activeTab.value = 'shadowing';
        speechAudio.initPassage(newLesson.shadowingPassage || '');
        const sentences = splitIntoSentences(newLesson.shadowingPassage || '');
        speakingTargetSentence.value = sentences[0] || newLesson.shadowingPassage || '';
      } else {
        activeTab.value = 'reading';
      }
    }
  },
  {immediate: true},
);

// Exam State
const userAnswers = ref({});
const examSubmitted = ref(false);
const examResult = ref(null);

function handleSelectAnswer(questionIndex, optionKey) {
  if (examSubmitted.value) return;
  userAnswers.value[questionIndex] = optionKey;
}

function handleStartSpeaking() {
  evaluator.startListening(speakingTargetSentence.value || props.lesson.shadowingPassage);
}

function handleStopSpeaking() {
  evaluator.stopListening(speakingTargetSentence.value || props.lesson.shadowingPassage);
  if (evaluator.evaluationResult.value?.passed) {
    addXp(XP_REWARDS.SPEAKING_PASSED, `Luyện phát âm: ${props.lesson.shortTitle}`);
  }
}

function handleSingleWordAudio(word) {
  activePlayingWord.value = word;
  speechAudio.playSingleText(word, 0.85);
  setTimeout(() => {
    if (activePlayingWord.value === word) {
      activePlayingWord.value = '';
    }
  }, 2000);
}

function submitExam() {
  const questions = props.lesson.examQuestions || [];
  let correctCount = 0;

  for (let i = 0; i < questions.length; i++) {
    if (userAnswers.value[i] === questions[i].correctAnswer) {
      correctCount++;
    }
  }

  const quizScore = questions.length > 0
    ? Math.round((correctCount / questions.length) * 100)
    : 100;

  const speakingScore = isSpokenTopic.value ? (evaluator.evaluationResult.value?.score || 0) : 100;

  const isQuizPassed = quizScore >= 70;
  const isSpeakingPassed = !isSpokenTopic.value || speakingScore >= 70;
  const isOverallPassed = isQuizPassed && isSpeakingPassed;

  examSubmitted.value = true;
  examResult.value = {
    quizScore,
    speakingScore,
    isQuizPassed,
    isSpeakingPassed,
    passed: isOverallPassed,
  };

  saveExamResult(props.lesson, {
    quizScore,
    speakingScore,
    passed: isOverallPassed,
  });

  if (isOverallPassed) {
    earnedXpNotification.value = XP_REWARDS.EXAM_PASSED;
    addXp(XP_REWARDS.EXAM_PASSED, `Vượt qua bài kiểm tra Ngày ${props.lesson.day}`);
    showCelebration.value = true;
    emit('exam-passed', {quizScore, speakingScore});
    emit('mark-complete');
    setTimeout(() => {
      showCelebration.value = false;
    }, 4500);
  }
}

function resetExam() {
  userAnswers.value = {};
  examSubmitted.value = false;
  examResult.value = null;
}

onUnmounted(() => {
  speechAudio.stop();
  evaluator.reset();
});
</script>

<template>
  <section class="lesson-detail">
    <!-- Single Minimalist Clean Header -->
    <header class="lesson-header">
      <div class="lesson-header__top">
        <span class="lesson-header__eyebrow">{{ lesson.topicTitle }}</span>
        <div class="lesson-header__badges">
          <span class="lesson-header__day">Ngày {{ lesson.day }}</span>
          <span v-if="isComplete" class="lesson-header__done">Đã hoàn thành ✓</span>
        </div>
      </div>
      <h1 class="lesson-header__title">{{ lesson.shortTitle }}</h1>
      <p v-if="lesson.description" class="lesson-header__desc">{{ lesson.description }}</p>
    </header>

    <!-- LESSON OVERVIEW CARD: Objectives, Core Takeaways, Mastery Questions -->
    <section v-if="lesson.overview" class="overview-card" :class="{'overview-card--collapsed': !showOverviewDetails}" aria-label="Tổng quan bài học">
      <div class="overview-header" @click="showOverviewDetails = !showOverviewDetails">
        <div class="overview-header__left">
          <span class="overview-badge">🎯 TỔNG QUAN BÀI HỌC</span>
          <h2 class="overview-title">Mục tiêu & Khái niệm cần đạt</h2>
        </div>
        <button
          type="button"
          class="overview-toggle-btn"
          :class="{'overview-toggle-btn--collapsed': !showOverviewDetails}"
          :aria-expanded="showOverviewDetails"
          :title="showOverviewDetails ? 'Thu gọn tổng quan' : 'Mở rộng tổng quan'"
          :aria-label="showOverviewDetails ? 'Thu gọn tổng quan' : 'Mở rộng tổng quan'"
          @click.stop="showOverviewDetails = !showOverviewDetails"
        >
          <svg class="overview-chevron" :class="{'overview-chevron--open': showOverviewDetails}" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      <!-- Overview Content -->
      <div v-show="showOverviewDetails" class="overview-content">
        <!-- 1. Objectives (Mục tiêu) -->
        <div v-if="lesson.overview.objectives?.length" class="overview-block overview-block--goal">
          <div class="overview-block__title-wrap">
            <span class="overview-icon" aria-hidden="true">🎯</span>
            <h3 class="overview-block__title">Mục tiêu bài học</h3>
          </div>
          <ul class="overview-list">
            <li v-for="(obj, i) in lesson.overview.objectives" :key="i" class="overview-item">
              <span class="overview-bullet"></span>
              <span class="overview-text">{{ obj }}</span>
            </li>
          </ul>
        </div>

        <!-- 2. Core Concepts / Key Takeaways (Nội dung chính cần nắm vững) -->
        <div v-if="lesson.overview.keyTakeaways?.length" class="overview-block overview-block--takeaway">
          <div class="overview-block__title-wrap">
            <span class="overview-icon" aria-hidden="true">💡</span>
            <h3 class="overview-block__title">Nội dung cốt lõi</h3>
          </div>
          <ul class="overview-list">
            <li v-for="(item, i) in lesson.overview.keyTakeaways" :key="i" class="overview-item">
              <span class="overview-bullet"></span>
              <span class="overview-text">{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- 3. Core Questions to Answer (Câu hỏi phải trả lời được) -->
        <div v-if="lesson.overview.coreQuestions?.length" class="overview-block overview-block--questions">
          <div class="overview-block__title-wrap">
            <span class="overview-icon" aria-hidden="true">❓</span>
            <h3 class="overview-block__title">Câu hỏi tự đánh giá</h3>
          </div>
          <ul class="overview-questions-list">
            <li v-for="(q, i) in lesson.overview.coreQuestions" :key="i" class="overview-question-item">
              <span class="overview-q-tag">Q{{ i + 1 }}</span>
              <span class="overview-q-text">{{ q }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Sleek Segmented Tab Bar -->
    <nav class="lesson-tabs" role="tablist" aria-label="Nội dung bài học">
      <!-- For English / Spoken / Career / Daily communication topics -->
      <template v-if="isSpokenTopic">
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'shadowing'"
          class="lesson-tab"
          :class="{'lesson-tab--active': activeTab === 'shadowing'}"
          title="Luyện nghe & đọc Shadowing"
          @click="activeTab = 'shadowing'"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
          <span>Shadowing</span>
        </button>

        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'skills'"
          class="lesson-tab"
          :class="{'lesson-tab--active': activeTab === 'skills'}"
          title="Ngữ pháp & Từ vựng"
          @click="activeTab = 'skills'"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Ngữ pháp</span>
        </button>

        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'practice'"
          class="lesson-tab"
          :class="{'lesson-tab--active': activeTab === 'practice'}"
          title="Luyện phát âm"
          @click="activeTab = 'practice'"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          </svg>
          <span>Phát âm</span>
        </button>
      </template>

      <!-- For Pure Technical Reading / Notes Topics -->
      <template v-else>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'reading'"
          class="lesson-tab"
          :class="{'lesson-tab--active': activeTab === 'reading'}"
          title="Bài đọc & Ghi chú kiến thức"
          @click="activeTab = 'reading'"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Bài đọc</span>
        </button>

        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'skills'"
          class="lesson-tab"
          :class="{'lesson-tab--active': activeTab === 'skills'}"
          title="Kiến thức & Thuật ngữ"
          @click="activeTab = 'skills'"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>Kiến thức</span>
        </button>
      </template>

      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'exam'"
        class="lesson-tab"
        :class="{'lesson-tab--active': activeTab === 'exam'}"
        title="Kiểm tra kiến thức"
        @click="activeTab = 'exam'"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span>Kiểm tra</span>
      </button>

      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 'references'"
        class="lesson-tab"
        :class="{'lesson-tab--active': activeTab === 'references'}"
        title="Tài liệu tham khảo"
        @click="activeTab = 'references'"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span>Tài liệu</span>
      </button>
    </nav>

    <!-- TAB 1 (Spoken Topics): Shadowing & Audio Player -->
    <div v-show="activeTab === 'shadowing' && isSpokenTopic" class="tab-pane">
      <div class="shadowing-card">
        <!-- Compact Audio Action Bar -->
        <div class="audio-bar">
          <div class="audio-bar__left">
            <!-- Icon Play/Stop Button -->
            <button
              type="button"
              class="audio-play-btn"
              :class="{'audio-play-btn--active': speechAudio.isPlaying.value}"
              :title="speechAudio.isPlaying.value ? 'Dừng phát' : 'Phát toàn bài'"
              :aria-label="speechAudio.isPlaying.value ? 'Dừng phát' : 'Phát toàn bài'"
              @click="speechAudio.isPlaying.value ? speechAudio.stop() : speechAudio.playPassage(lesson.shadowingPassage)"
            >
              <svg v-if="!speechAudio.isPlaying.value" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            </button>

            <!-- Speed Pills -->
            <div class="speed-group">
              <button
                v-for="spd in Object.values(SPEEDS)"
                :key="spd.key"
                type="button"
                class="speed-btn"
                :class="{'speed-btn--active': speechAudio.currentSpeed.value === spd.key}"
                @click="speechAudio.setSpeed(spd.key)"
              >
                {{ spd.rate }}x
              </button>
            </div>
          </div>

          <div class="audio-bar__right">
            <!-- Sentence Navigation -->
            <div class="stepper">
              <button
                type="button"
                class="stepper-btn"
                title="Câu trước"
                aria-label="Câu trước"
                @click="speechAudio.prevSentence()"
              >
                ‹
              </button>
              <span class="stepper-count">
                {{ speechAudio.currentSentenceIndex.value >= 0 ? speechAudio.currentSentenceIndex.value + 1 : 1 }}/{{ targetSentences.length }}
              </span>
              <button
                type="button"
                class="stepper-btn"
                title="Câu sau"
                aria-label="Câu sau"
                @click="speechAudio.nextSentence()"
              >
                ›
              </button>
            </div>

            <!-- Translate Toggle Icon Button -->
            <button
              type="button"
              class="toggle-pill"
              :class="{'toggle-pill--active': showViTranslation}"
              :title="showViTranslation ? 'Ẩn bản dịch' : 'Hiện bản dịch tiếng Việt'"
              :aria-label="showViTranslation ? 'Ẩn bản dịch' : 'Hiện bản dịch tiếng Việt'"
              @click="showViTranslation = !showViTranslation"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Dịch</span>
            </button>
          </div>
        </div>

        <!-- Reading Passage with Tap-to-Speak Sentences -->
        <div class="sentences-flow">
          <div
            v-for="(sentence, idx) in targetSentences"
            :key="idx"
            class="sentence-row"
            :class="{'sentence-row--active': speechAudio.currentSentenceIndex.value === idx}"
            @click="speechAudio.playSentence(idx, lesson.shadowingPassage)"
          >
            <div class="sentence-main">
              <span class="sentence-num">{{ idx + 1 }}</span>
              <p class="sentence-text">{{ sentence }}</p>

              <!-- Animated sound waves when this sentence is playing -->
              <div
                v-if="speechAudio.currentSentenceIndex.value === idx && speechAudio.isPlaying.value"
                class="sound-wave-bars"
                aria-label="Đang phát"
              >
                <span></span><span></span><span></span><span></span>
              </div>

              <button
                type="button"
                class="sentence-loop-btn"
                :class="{'sentence-loop-btn--active': speechAudio.currentSentenceIndex.value === idx && speechAudio.isLoopingSentence.value}"
                title="Lặp lại câu này"
                @click.stop="speechAudio.loopSentence(idx, lesson.shadowingPassage)"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="17 1 21 5 17 9" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <polyline points="7 23 3 19 7 15" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Vietnamese Translation -->
        <div v-if="lesson.shadowingVi && showViTranslation" class="translation-block">
          <span class="translation-label">Bản dịch tiếng Việt:</span>
          <p class="translation-text">{{ lesson.shadowingVi }}</p>
        </div>
      </div>
    </div>

    <!-- TAB 1 (Non-Spoken Technical Topics): Reading & Notes -->
    <div v-show="activeTab === 'reading' && !isSpokenTopic" class="tab-pane">
      <div class="reading-card">
        <div class="reading-card__header">
          <span class="reading-card__badge">📖 BÀI ĐỌC CHUYÊN SÂU & GHI CHÚ</span>
        </div>

        <div class="reading-card__content">
          <p class="reading-passage-text">{{ lesson.shadowingPassage }}</p>
        </div>

        <!-- Vietnamese Translation & Notes -->
        <div v-if="lesson.shadowingVi" class="reading-vi-card">
          <div class="reading-vi-head">
            <span class="reading-vi-flag">🇻🇳</span>
            <h4 class="reading-vi-title">Ghi chú & Tóm lược nội dung:</h4>
          </div>
          <p class="reading-vi-body">{{ lesson.shadowingVi }}</p>
        </div>
      </div>
    </div>

    <!-- TAB 2: Grammar & Vocabulary / Key Concepts -->
    <div v-show="activeTab === 'skills'" class="tab-pane">
      <!-- Grammar Section -->
      <section class="section-card">
        <h3 class="section-heading">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>Ngữ pháp trọng tâm</span>
        </h3>
        <div v-if="lesson.grammar && lesson.grammar.length" class="grammar-list">
          <div v-for="(g, i) in lesson.grammar" :key="i" class="grammar-item">
            <h4 class="grammar-title">{{ g.title }}</h4>
            <div class="grammar-body flow" v-html="g.body"></div>
          </div>
        </div>
      </section>

      <!-- Key Vocabulary Section -->
      <section class="section-card">
        <h3 class="section-heading">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Từ vựng & Thuật ngữ</span>
        </h3>
        <div v-if="lesson.vocabulary && lesson.vocabulary.length" class="vocab-list">
          <div v-for="(v, i) in lesson.vocabulary" :key="i" class="vocab-row">
            <div class="vocab-left">
              <span class="vocab-word">{{ v.word }}</span>
              <span v-if="v.ipa" class="vocab-ipa">{{ v.ipa }}</span>
              <p class="vocab-note">{{ v.note }}</p>
            </div>
            <button
              type="button"
              class="vocab-speaker-btn"
              :class="{'vocab-speaker-btn--playing': activePlayingWord === v.word && speechAudio.isPlaying.value}"
              title="Nghe phát âm từ này"
              @click="handleSingleWordAudio(v.word)"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- Sentence Patterns -->
      <section v-if="lesson.sentencePatterns && lesson.sentencePatterns.length" class="section-card">
        <h3 class="section-heading">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Mẫu câu thực chiến</span>
        </h3>
        <div class="patterns-list">
          <div v-for="(p, i) in lesson.sentencePatterns" :key="i" class="pattern-item">
            <h4 class="pattern-title">{{ p.title }}</h4>
            <code class="pattern-formula">{{ p.formula }}</code>
            <ul v-if="p.examples.length" class="pattern-examples">
              <li v-for="(ex, j) in p.examples" :key="j">“{{ ex }}”</li>
            </ul>
          </div>
        </div>
      </section>
    </div>

    <!-- TAB 3: Pronunciation Recording & Live Evaluation -->
    <div v-show="activeTab === 'practice'" class="tab-pane">
      <div class="practice-card">
        <div class="practice-target">
          <span class="practice-target__label">Câu văn cần đọc:</span>
          <p class="practice-target__text">“{{ speakingTargetSentence }}”</p>
        </div>

        <div class="mic-container">
          <button
            type="button"
            class="mic-btn"
            :class="{'mic-btn--recording': evaluator.isListening.value}"
            @pointerdown="handleStartSpeaking"
            @pointerup="handleStopSpeaking"
          >
            <svg v-if="evaluator.isListening.value" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
          </button>
          <span class="mic-hint">
            {{ evaluator.isListening.value ? 'Đang lắng nghe... Thả tay để nhận kết quả' : 'Nhấn giữ nút mic để đọc câu' }}
          </span>
        </div>

        <div v-if="evaluator.recognizedText.value" class="recognized-box">
          <span class="recognized-label">Lời bạn vừa đọc:</span>
          <p class="recognized-text">“{{ evaluator.recognizedText.value }}”</p>
        </div>

        <!-- Evaluation Results Breakdown -->
        <div v-if="evaluator.evaluationResult.value" class="evaluation-result">
          <div class="evaluation-header">
            <div class="score-circle" :class="{'score-circle--pass': evaluator.evaluationResult.value.passed}">
              <span class="score-number">{{ evaluator.evaluationResult.value.score }}%</span>
              <span class="score-label">{{ evaluator.evaluationResult.value.passed ? 'ĐẠT' : 'CHƯA ĐẠT' }}</span>
            </div>
            <div class="score-details">
              <h4 class="score-feedback">{{ evaluator.evaluationResult.value.feedback }}</h4>
              <p class="score-stats">
                Đúng: {{ evaluator.evaluationResult.value.stats.correct }} · Gần đúng: {{ evaluator.evaluationResult.value.stats.close }} · Thiếu: {{ evaluator.evaluationResult.value.stats.missed }}
              </p>
            </div>
          </div>

          <!-- Color-coded Word Diff -->
          <div class="word-diff">
            <span
              v-for="(w, idx) in evaluator.evaluationResult.value.breakdown"
              :key="idx"
              class="word-diff__item"
              :class="`word-diff__item--${w.status}`"
            >
              {{ w.word }}
            </span>
          </div>

          <div v-if="evaluator.evaluationResult.value.phoneticTips.length" class="phonetic-tips">
            <span class="phonetic-tips__title">Gợi ý phát âm:</span>
            <ul class="phonetic-tips__list">
              <li v-for="(tip, i) in evaluator.evaluationResult.value.phoneticTips" :key="i">{{ tip }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: Exam & Passing Assessment -->
    <div v-show="activeTab === 'exam'" class="tab-pane">
      <div class="exam-card">
        <div class="exam-header">
          <h3 class="exam-title">Bài kiểm tra đánh giá bài học</h3>
          <p class="exam-sub">Đạt điểm trắc nghiệm & điểm phát âm >= 70% để vượt qua bài học (+50 XP)</p>
        </div>

        <!-- Quiz Questions -->
        <div class="exam-questions">
          <div
            v-for="(q, qIdx) in lesson.examQuestions"
            :key="qIdx"
            class="exam-question"
          >
            <h4 class="exam-q-title">Câu {{ qIdx + 1 }}: {{ q.question }}</h4>
            <div class="exam-options">
              <button
                v-for="opt in q.options"
                :key="opt.key"
                type="button"
                class="exam-opt-btn"
                :class="{
                  'exam-opt-btn--selected': userAnswers[qIdx] === opt.key,
                  'exam-opt-btn--correct': examSubmitted && opt.key === q.correctAnswer,
                  'exam-opt-btn--wrong': examSubmitted && userAnswers[qIdx] === opt.key && opt.key !== q.correctAnswer,
                }"
                @click="handleSelectAnswer(qIdx, opt.key)"
              >
                <span class="opt-key">{{ opt.key }}</span>
                <span class="opt-text">{{ opt.text }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="exam-speaking-status">
          <span>Điểm phát âm Shadowing:</span>
          <strong :class="{'text-pass': (evaluator.evaluationResult.value?.score || 0) >= 70}">
            {{ evaluator.evaluationResult.value ? `${evaluator.evaluationResult.value.score}%` : 'Chưa thu âm' }}
          </strong>
        </div>

        <div class="exam-footer">
          <BaseButton
            v-if="!examSubmitted"
            variant="solid"
            tone="accent"
            class="w-full"
            @click="submitExam"
          >
            Nộp bài & Đánh giá
          </BaseButton>

          <div v-else class="exam-result-box">
            <div class="exam-banner" :class="examResult?.passed ? 'exam-banner--pass' : 'exam-banner--fail'">
              <h4>{{ examResult?.passed ? 'Chúc mừng! Bạn đã VƯỢT QUA bài học (+50 XP)' : 'Chưa đạt yêu cầu vượt qua' }}</h4>
              <p>Điểm trắc nghiệm: {{ examResult?.quizScore }}% · Điểm nói: {{ examResult?.speakingScore }}%</p>
            </div>
            <BaseButton
              v-if="!examResult?.passed"
              variant="outline"
              @click="resetExam"
            >
              Thử làm lại
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: References -->
    <div v-show="activeTab === 'references'" class="tab-pane">
      <div class="section-card">
        <h3 class="section-heading">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>Tài liệu tham khảo</span>
        </h3>
        <div v-if="lesson.references && lesson.references.length" class="refs-list">
          <a
            v-for="(r, i) in lesson.references"
            :key="i"
            :href="r.url"
            target="_blank"
            rel="noopener noreferrer"
            class="ref-item"
          >
            <div class="ref-info">
              <span class="ref-title">{{ r.title }}</span>
              <span class="ref-url">{{ r.url }}</span>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Celebration Banner -->
    <Transition name="fade-pop">
      <div v-if="showCelebration" class="celebration-banner" role="status">
        <div class="celebration-content">
          <h4>XUẤT SẮC! BÀI HỌC ĐÃ HOÀN THÀNH</h4>
          <p>Hệ thống đã ghi nhận +{{ earnedXpNotification }} XP và mở khóa bài học tiếp theo.</p>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.lesson-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg) calc(6.5rem + env(safe-area-inset-bottom));
  max-width: 68ch;
  margin: 0 auto;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

/* Header */
.lesson-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--color-hairline);
}

.lesson-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.lesson-header__eyebrow {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lesson-header__badges {
  display: flex;
  align-items: center;
  gap: 4px;
}

.lesson-header__day {
  font-size: var(--text-2xs);
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-ink);
  color: #fff;
}

.lesson-header__done {
  font-size: var(--text-2xs);
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent-2);
  color: #fff;
}

.lesson-header__title {
  margin: 0.15rem 0 0;
  font-size: var(--text-lg);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--color-ink);
  line-height: 1.3;
}

.lesson-header__desc {
  margin: 0.15rem 0 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
  line-height: 1.4;
}

/* ==========================================================================
   LESSON OVERVIEW CARD (Mục tiêu, Khái niệm, Câu hỏi tự đánh giá)
   ========================================================================== */
.overview-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-card);
  background: #fdfdfe;
  border: 1px solid rgba(61, 78, 232, 0.2);
  box-shadow: 0 4px 16px -2px rgba(61, 78, 232, 0.08);
}

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  cursor: pointer;
  padding: 0.2rem 0;
  user-select: none;
}

.overview-header__left {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.overview-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--color-accent);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.overview-title {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-ink);
}

.overview-toggle-btn {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(61, 78, 232, 0.25);
  background: rgba(61, 78, 232, 0.08);
  color: var(--color-accent);
  display: grid;
  place-items: center;
  cursor: pointer;
  flex: none;
  transition: all var(--dur-fast) var(--ease-out);
}

.overview-toggle-btn:hover {
  background: rgba(61, 78, 232, 0.2);
  color: #15112b;
}

.overview-toggle-btn--collapsed {
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  border-color: var(--color-hairline);
}

.overview-chevron {
  transition: transform var(--dur-fast) var(--ease-out);
}

.overview-chevron--open {
  transform: rotate(0deg);
}

.overview-card--collapsed .overview-chevron {
  transform: rotate(180deg);
}

.overview-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-top: var(--space-xs);
  border-top: 1px dashed var(--color-hairline);
}

/* Reading Card for Technical Non-Spoken Topics */
.reading-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
  box-shadow: 0 2px 12px -2px rgba(0, 0, 0, 0.04);
}

.reading-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--color-hairline);
}

.reading-card__badge {
  font-size: var(--text-2xs);
  font-weight: 800;
  color: var(--color-accent);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.reading-card__content {
  line-height: 1.7;
}

.reading-passage-text {
  font-size: var(--text-base);
  color: var(--color-ink);
  white-space: pre-line;
  line-height: 1.7;
  letter-spacing: -0.005em;
}

.reading-vi-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-input);
  background: rgba(61, 78, 232, 0.05);
  border-left: 3px solid var(--color-accent);
}

.reading-vi-head {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.reading-vi-flag {
  font-size: 0.9rem;
}

.reading-vi-title {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink);
}

.reading-vi-body {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-ink);
  line-height: 1.6;
  white-space: pre-line;
}

.overview-block {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-input);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.overview-block--goal {
  background: rgba(61, 78, 232, 0.06);
  border-left: 3px solid var(--color-accent);
}

.overview-block--takeaway {
  background: rgba(16, 185, 129, 0.07);
  border-left: 3px solid var(--color-accent-2);
}

.overview-block--questions {
  background: rgba(245, 158, 11, 0.08);
  border-left: 3px solid var(--color-gold);
}

.overview-block__title-wrap {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.overview-icon {
  font-size: 0.9rem;
}

.overview-block__title {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink);
}

.overview-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.overview-item {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: var(--text-xs);
  color: var(--color-ink);
  line-height: 1.45;
}

.overview-bullet {
  width: 5px;
  height: 5px;
  border-radius: var(--radius-pill);
  background: var(--color-ink-2);
  margin-top: 0.45rem;
  flex: none;
}

.overview-questions-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.overview-question-item {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-size: var(--text-xs);
  color: var(--color-ink);
  line-height: 1.45;
}

.overview-q-tag {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--color-gold-deep);
  background: #fff;
  border: 1px solid var(--color-gold);
  border-radius: 4px;
  padding: 0.05rem 0.3rem;
  flex: none;
}

.overview-q-text {
  flex: 1;
}

/* Tabs */
.lesson-tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding: 2px 0;
  scrollbar-width: none;
  border-bottom: 1px solid var(--color-hairline);
}
.lesson-tabs::-webkit-scrollbar {
  display: none;
}

.lesson-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  background: var(--color-paper-2);
  color: var(--color-ink-2);
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

/* High contrast active tab: Dark Black ink text on distinct light fill */
.lesson-tab--active {
  background: rgba(61, 78, 232, 0.14);
  color: #15112b;
  border-color: rgba(61, 78, 232, 0.4);
  font-weight: 700;
}

.lesson-tab--active svg {
  stroke: #15112b;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Shadowing Card */
.shadowing-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
}

.audio-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  flex-wrap: wrap;
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--color-hairline);
}

.audio-bar__left {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.audio-play-btn {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: var(--radius-pill);
  border: 0;
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 2px 8px -1px rgba(61, 78, 232, 0.35);
  transition: all var(--dur-fast) var(--ease-out);
}

.audio-play-btn:hover {
  background: var(--color-accent-deep, #2f3ec4);
  transform: scale(1.05);
}

.audio-play-btn--active {
  background: var(--color-accent-3);
  box-shadow: 0 2px 8px -1px rgba(239, 68, 68, 0.35);
}

.speed-group {
  display: flex;
  gap: 2px;
}

.speed-btn {
  padding: 0.2rem 0.45rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper);
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-ink-2);
  cursor: pointer;
}

.speed-btn--active {
  background: rgba(61, 78, 232, 0.16);
  color: #15112b;
  border-color: rgba(61, 78, 232, 0.4);
  font-weight: 800;
}

.audio-bar__right {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.stepper {
  display: flex;
  align-items: center;
  gap: 2px;
}

.stepper-btn {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper);
  font-size: var(--text-xs);
  font-weight: 700;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.stepper-count {
  font-size: var(--text-2xs);
  font-weight: 700;
  padding: 0 0.25rem;
}

.toggle-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.55rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper);
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-ink-2);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.toggle-pill--active {
  background: rgba(61, 78, 232, 0.14);
  color: #15112b;
  border-color: rgba(61, 78, 232, 0.4);
}

.sentences-flow {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.sentence-row {
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius-input);
  background: var(--color-paper);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.sentence-row:hover {
  background: #fff;
  border-color: var(--color-hairline);
}

.sentence-row--active {
  background: rgba(61, 78, 232, 0.08);
  border-color: var(--color-accent);
}

.sentence-main {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
}

.sentence-num {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink-3);
  min-width: 1.1rem;
}

.sentence-text {
  margin: 0;
  flex: 1;
  font-size: var(--text-base);
  line-height: 1.6;
  font-weight: 500;
}

.sentence-loop-btn {
  border: 0;
  background: transparent;
  color: var(--color-ink-3);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: var(--radius-pill);
  transition: all var(--dur-fast) var(--ease-out);
}

.sentence-loop-btn:hover {
  color: var(--color-accent);
}

.sentence-loop-btn--active {
  color: var(--color-accent) !important;
  background: rgba(61, 78, 232, 0.15);
}

/* Animated Equalizer Sound Wave Bars */
.sound-wave-bars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 14px;
  margin-left: 0.25rem;
  margin-top: 0.25rem;
}

.sound-wave-bars span {
  display: block;
  width: 3px;
  background: var(--color-accent);
  border-radius: 2px;
  animation: soundwave 1s ease-in-out infinite;
}

.sound-wave-bars span:nth-child(1) {
  height: 6px;
  animation-delay: 0s;
}
.sound-wave-bars span:nth-child(2) {
  height: 14px;
  animation-delay: 0.2s;
}
.sound-wave-bars span:nth-child(3) {
  height: 10px;
  animation-delay: 0.4s;
}
.sound-wave-bars span:nth-child(4) {
  height: 8px;
  animation-delay: 0.1s;
}

@keyframes soundwave {
  0%, 100% {
    transform: scaleY(0.4);
  }
  50% {
    transform: scaleY(1);
  }
}

.translation-block {
  padding: var(--space-sm);
  border-radius: var(--radius-input);
  background: var(--color-paper);
  border-left: 3px solid var(--color-accent-2);
}

.translation-label {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-accent-2);
}

.translation-text {
  margin: 0.15rem 0 0;
  font-size: var(--text-xs);
  line-height: 1.5;
}

/* Sections */
.section-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 700;
}

.grammar-list, .vocab-list, .patterns-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.grammar-item, .vocab-row, .pattern-item {
  padding: var(--space-sm);
  border-radius: var(--radius-input);
  background: var(--color-paper);
  border: 1px solid var(--color-hairline);
}

.grammar-title, .pattern-title {
  margin: 0 0 0.2rem;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-accent);
}

.vocab-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.vocab-left {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.vocab-word {
  font-size: var(--text-xs);
  font-weight: 700;
}

.vocab-ipa {
  font-size: var(--text-2xs);
  color: var(--color-accent);
}

.vocab-note {
  margin: 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

.vocab-speaker-btn {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.vocab-speaker-btn:hover {
  background: var(--color-paper-2);
  border-color: var(--color-accent);
}

.vocab-speaker-btn--playing {
  background: rgba(61, 78, 232, 0.15) !important;
  border-color: var(--color-accent) !important;
  color: var(--color-accent) !important;
  transform: scale(1.1);
}

.pattern-formula {
  background: var(--color-paper-3);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  font-size: var(--text-2xs);
}

.pattern-examples {
  margin: 0.2rem 0 0;
  padding-left: 1.2rem;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

/* Practice Card */
.practice-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
}

.practice-target {
  padding: var(--space-sm);
  border-radius: var(--radius-input);
  background: var(--color-paper);
  border-left: 3px solid var(--color-accent);
}

.practice-target__label {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-accent);
}

.practice-target__text {
  margin: 0.15rem 0 0;
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.5;
}

.mic-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.mic-btn {
  width: 4.8rem;
  height: 4.8rem;
  border-radius: var(--radius-pill);
  border: 0;
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 6px 18px -4px rgba(61, 78, 232, 0.4);
}

.mic-btn--recording {
  background: var(--color-accent-3);
  transform: scale(1.05);
}

.mic-hint {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-ink-2);
}

.recognized-box {
  padding: var(--space-sm);
  border-radius: var(--radius-input);
  background: var(--color-paper);
  text-align: center;
}

.recognized-label {
  font-size: var(--text-2xs);
  font-weight: 700;
  color: var(--color-accent);
}

.recognized-text {
  margin: 0.1rem 0 0;
  font-size: var(--text-xs);
}

.evaluation-result {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-sm);
  border-radius: var(--radius-input);
  background: var(--color-paper);
}

.evaluation-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.score-circle {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: var(--radius-pill);
  background: #fef2f2;
  border: 2px solid var(--color-accent-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: none;
}

.score-circle--pass {
  background: #ecfdf5;
  border-color: var(--color-accent-2);
}

.score-number {
  font-size: var(--text-sm);
  font-weight: 800;
}

.score-label {
  font-size: 0.6rem;
  font-weight: 700;
}

.score-feedback {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
}

.score-stats {
  margin: 0.1rem 0 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

.word-diff {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.word-diff__item {
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-pill);
  font-size: var(--text-2xs);
  font-weight: 600;
}

.word-diff__item--correct {
  background: #d1fae5;
  color: #065f46;
}

.word-diff__item--close {
  background: #fef3c7;
  color: #92400e;
}

.word-diff__item--missed {
  background: #fee2e2;
  color: #991b1b;
}

.phonetic-tips {
  padding: var(--space-xs);
  border-radius: var(--radius-input);
  background: var(--color-paper-2);
}

.phonetic-tips__title {
  font-size: var(--text-2xs);
  font-weight: 700;
}

.phonetic-tips__list {
  margin: 0.1rem 0 0;
  padding-left: 1.2rem;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

/* Exam Card */
.exam-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
}

.exam-title {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 700;
}

.exam-sub {
  margin: 0.1rem 0 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

.exam-questions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.exam-q-title {
  margin: 0 0 var(--space-xs);
  font-size: var(--text-xs);
  font-weight: 700;
}

.exam-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.exam-opt-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-border);
  background: var(--color-paper);
  font-size: var(--text-xs);
  text-align: left;
  cursor: pointer;
}

.exam-opt-btn--selected {
  border-color: var(--color-accent);
  background: rgba(61, 78, 232, 0.08);
}

.exam-opt-btn--correct {
  border-color: var(--color-accent-2);
  background: #ecfdf5;
}

.exam-opt-btn--wrong {
  border-color: var(--color-accent-3);
  background: #fef2f2;
}

.opt-key {
  font-weight: 700;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  background: var(--color-paper-3);
}

.exam-speaking-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-input);
  background: var(--color-paper);
  font-size: var(--text-xs);
}

.text-pass {
  color: var(--color-accent-2);
}

.w-full {
  width: 100%;
}

.exam-banner {
  padding: var(--space-sm);
  border-radius: var(--radius-input);
  font-size: var(--text-xs);
}

.exam-banner--pass {
  background: #ecfdf5;
  border: 1px solid var(--color-accent-2);
}

.exam-banner--fail {
  background: #fef2f2;
  border: 1px solid var(--color-accent-3);
}

.exam-banner h4 {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
}

.exam-banner p {
  margin: 0.1rem 0 0;
  font-size: var(--text-2xs);
}

.refs-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.ref-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-input);
  background: var(--color-paper);
  border: 1px solid var(--color-hairline);
  text-decoration: none;
  color: var(--color-ink);
}

.ref-title {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-accent);
}

.ref-url {
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
  display: block;
}

.celebration-banner {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-card);
  background: #ecfdf5;
  border: 1px solid var(--color-accent-2);
}

.celebration-banner h4 {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 800;
  color: #065f46;
}

.celebration-banner p {
  margin: 0.1rem 0 0;
  font-size: var(--text-xs);
  color: #047857;
}

.fade-pop-enter-active,
.fade-pop-leave-active {
  transition: all var(--dur-med) var(--ease-out);
}
.fade-pop-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
