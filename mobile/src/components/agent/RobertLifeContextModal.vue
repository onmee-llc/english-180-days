<script setup>
import {ref, computed, onMounted} from 'vue';
import SvgIcon from '../base/SvgIcon.vue';
import {DecisionJournalStore, DECISION_CATEGORIES} from '../../agent-core/decisions/DecisionJournalStore.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  memoryStore: {
    type: Object,
    required: true,
  },
  decisionJournal: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'ask-alex']);

const activeTab = ref('decisions'); // 'decisions' | 'finance' | 'personality' | 'projects' | 'family' | 'vision'
const isSaved = ref(false);
const decisionStore = ref(null);
const decisionsList = ref([]);
const isAddingDecision = ref(false);

const newDecisionDraft = ref({
  situation: '',
  decisionMade: '',
  rationale: '',
  tradeoffsAccepted: '',
  category: DECISION_CATEGORIES.ENGINEERING,
});

// Local state initialized from memory
const profileData = ref({
  name: 'Robert',
  title: 'Senior Principal / AI & Backend Engineer',
  mbti: 'INTJ / ENTJ',
  deepWorkPeak: '09:00 - 11:30, 14:30 - 16:30',
  communicationPreference: 'Súc tích, trực diện, đi thẳng vào giải pháp thực tế, không dùng emoji thô',
  monthlyIncome: '120.000.000 ₫',
  essentialBurnRate: '35.000.000 ₫',
  emergencyFundMonths: 6,
  debtStrategy: 'Avalanche (Ưu tiên khoản lãi suất cao)',
  debts: [
    {id: 'd1', name: 'Khoản nợ trả góp ưu tiên A', amount: '85.000.000 ₫', rate: '9.2%', payment: '7.500.000 ₫/tháng', status: 'active'},
    {id: 'd2', name: 'Khoản nợ kinh doanh B', amount: '120.000.000 ₫', rate: '7.5%', payment: '10.000.000 ₫/tháng', status: 'active'},
  ],
  investments: 'Crypto (BTC/ETH), Cổ phiếu công nghệ, Tiết kiệm thanh khoản',
  family: [
    {id: 'f1', relation: 'Bố Mẹ', notes: 'Nhắc nhở sức khỏe, kiểm tra huyết áp và gửi quà sinh nhật'},
    {id: 'f2', relation: 'Người thương yêu', notes: 'Ngày kỷ niệm 15/10, kế hoạch du lịch và chăm sóc'},
  ],
  projects: [
    {id: 'p1', name: 'Daily Mastery & Alex AI', role: 'Lead Architect & Creator', status: 'Active Development'},
    {id: 'p2', name: 'Rivyn Automation Engine', role: 'Core Engine Developer', status: 'Scaling'},
  ],
  vision180: 'Hoàn thành 180 ngày Daily Mastery, tối ưu dòng tiền, trả sạch nợ và đạt tự do tài chính.',
});

function loadFromMemory() {
  if (!props.memoryStore) return;
  const p = props.memoryStore.getProfile();
  if (p) {
    profileData.value.name = p.name || profileData.value.name;
    profileData.value.title = p.title || profileData.value.title;
    if (p.financialProfile) {
      if (p.financialProfile.monthlyCashflow) {
        profileData.value.monthlyIncome = p.financialProfile.monthlyCashflow.primaryIncome || profileData.value.monthlyIncome;
        profileData.value.essentialBurnRate = p.financialProfile.monthlyCashflow.essentialBurnRate || profileData.value.essentialBurnRate;
      }
    }
  }

  // Load decision journal
  decisionStore.value = props.decisionJournal || new DecisionJournalStore();
  decisionsList.value = decisionStore.value.getDecisions();
}

function handleAppendDecision() {
  if (!newDecisionDraft.value.situation.trim() || !newDecisionDraft.value.decisionMade.trim()) return;
  if (!decisionStore.value) {
    decisionStore.value = props.decisionJournal || new DecisionJournalStore();
  }

  decisionStore.value.addDecision({
    situation: newDecisionDraft.value.situation,
    decisionMade: newDecisionDraft.value.decisionMade,
    rationale: newDecisionDraft.value.rationale,
    tradeoffsAccepted: newDecisionDraft.value.tradeoffsAccepted,
    category: newDecisionDraft.value.category,
    tags: [newDecisionDraft.value.category, 'user_logged'],
  });

  decisionsList.value = decisionStore.value.getDecisions();
  newDecisionDraft.value = {
    situation: '',
    decisionMade: '',
    rationale: '',
    tradeoffsAccepted: '',
    category: DECISION_CATEGORIES.ENGINEERING,
  };
  isAddingDecision.value = false;
  isSaved.value = true;
  setTimeout(() => (isSaved.value = false), 2500);
}

function handleSaveProfile() {
  if (props.memoryStore && typeof props.memoryStore.updateProfile === 'function') {
    props.memoryStore.updateProfile({
      name: profileData.value.name,
      title: profileData.value.title,
      financialProfile: {
        monthlyCashflow: {
          primaryIncome: profileData.value.monthlyIncome,
          essentialBurnRate: profileData.value.essentialBurnRate,
        },
        debts: profileData.value.debts,
        emergencyFundMonths: profileData.value.emergencyFundMonths,
        investmentPortfolio: [profileData.value.investments],
      },
    });
    isSaved.value = true;
    setTimeout(() => (isSaved.value = false), 2500);
  }
}

function handleQuickAsk(prompt) {
  emit('close');
  emit('ask-alex', prompt);
}

loadFromMemory();
onMounted(loadFromMemory);
</script>

<template>
  <div v-if="isOpen" class="vault-modal" role="dialog" aria-modal="true">
    <div class="vault-modal__backdrop" @click="$emit('close')"></div>

    <div class="vault-modal__sheet">
      <!-- Header -->
      <div class="vault-modal__header">
        <div class="vault-modal__title-row">
          <div class="vault-modal__badge">
            <SvgIcon name="spark" :size="16" color="#ffffff" />
          </div>
          <div>
            <h2 class="vault-modal__title">Hồ Sơ Cuộc Sống Cá Nhân Của Robert</h2>
            <p class="vault-modal__sub">Mã hóa an toàn cục bộ · Giúp Alex hiểu và đồng hành cùng bạn</p>
          </div>
        </div>

        <button type="button" class="vault-modal__close-btn" aria-label="Đóng" @click="$emit('close')">
          <SvgIcon name="close" :size="18" />
        </button>
      </div>

      <!-- Navigation Tabs -->
      <nav class="vault-modal__tabs">
        <button
          type="button"
          class="vault-modal__tab"
          :class="{'vault-modal__tab--active': activeTab === 'decisions'}"
          @click="activeTab = 'decisions'"
        >
          <SvgIcon name="code" :size="14" />
          <span>Decisions Table (Training Signal)</span>
        </button>
        <button
          type="button"
          class="vault-modal__tab"
          :class="{'vault-modal__tab--active': activeTab === 'finance'}"
          @click="activeTab = 'finance'"
        >
          <SvgIcon name="chart" :size="14" />
          <span>Tài Chính & Nợ</span>
        </button>
        <button
          type="button"
          class="vault-modal__tab"
          :class="{'vault-modal__tab--active': activeTab === 'personality'}"
          @click="activeTab = 'personality'"
        >
          <SvgIcon name="voice" :size="14" />
          <span>Tính Cách & Nhịp Sinh Học</span>
        </button>
        <button
          type="button"
          class="vault-modal__tab"
          :class="{'vault-modal__tab--active': activeTab === 'projects'}"
          @click="activeTab = 'projects'"
        >
          <SvgIcon name="code" :size="14" />
          <span>Dự Án & Tech</span>
        </button>
        <button
          type="button"
          class="vault-modal__tab"
          :class="{'vault-modal__tab--active': activeTab === 'family'}"
          @click="activeTab = 'family'"
        >
          <SvgIcon name="star" :size="14" />
          <span>Gia Đình & Người Thân</span>
        </button>
        <button
          type="button"
          class="vault-modal__tab"
          :class="{'vault-modal__tab--active': activeTab === 'vision'}"
          @click="activeTab = 'vision'"
        >
          <SvgIcon name="flame" :size="14" />
          <span>Tầm Nhìn 180 Ngày</span>
        </button>
      </nav>

      <!-- Content Area -->
      <div class="vault-modal__body">
        <!-- 0. Decisions Table (Training Signal Tab) -->
        <section v-if="activeTab === 'decisions'" class="vault-tab-pane">
          <div class="decisions-header">
            <div>
              <h3 class="vault-section-title">Nhật Ký Quyết Định (Decisions Table - Append-Only)</h3>
              <p class="vault-section-sub">Alex học từ các tình huống bạn từng chốt quyết định để áp dụng đúng tư duy của bạn.</p>
            </div>
            <button
              type="button"
              class="vault-add-btn"
              @click="isAddingDecision = !isAddingDecision"
            >
              <span>{{ isAddingDecision ? 'Đóng' : '+ Thêm Quyết Định' }}</span>
            </button>
          </div>

          <!-- New Decision Form -->
          <div v-if="isAddingDecision" class="new-decision-form">
            <div class="vault-field-group">
              <label class="vault-label">Tình huống / Vấn đề phải lựa chọn:</label>
              <input v-model="newDecisionDraft.situation" type="text" placeholder="Ví dụ: Thiết kế hệ thống cache hay query trực tiếp..." class="vault-input" />
            </div>

            <div class="vault-field-group">
              <label class="vault-label">Quyết định Robert đã chốt:</label>
              <input v-model="newDecisionDraft.decisionMade" type="text" placeholder="Phương án đã chọn..." class="vault-input" />
            </div>

            <div class="vault-field-group">
              <label class="vault-label">Lý do & Rationale:</label>
              <textarea v-model="newDecisionDraft.rationale" rows="2" placeholder="Tại sao chọn phương án này..." class="vault-textarea"></textarea>
            </div>

            <div class="vault-field-group">
              <label class="vault-label">Trade-off chấp nhận:</label>
              <input v-model="newDecisionDraft.tradeoffsAccepted" type="text" placeholder="Chấp nhận đánh đổi điều gì..." class="vault-input" />
            </div>

            <button type="button" class="vault-save-btn" @click="handleAppendDecision">
              + Ghi Nhận Quyết Định (Append-Only)
            </button>
          </div>

          <!-- Decisions List -->
          <div class="decisions-list">
            <div v-for="dec in decisionsList" :key="dec.id" class="decision-card">
              <div class="decision-card__top">
                <span class="decision-card__category">{{ dec.category?.toUpperCase() }}</span>
                <span class="decision-card__time">{{ new Date(dec.timestamp).toLocaleDateString('vi-VN') }}</span>
              </div>
              <h4 class="decision-card__situation">{{ dec.situation }}</h4>
              <div class="decision-card__choice">
                <span class="decision-tag">Đã chốt:</span>
                <strong>{{ dec.decisionMade }}</strong>
              </div>
              <p v-if="dec.rationale" class="decision-card__rationale"><strong>Lý do:</strong> {{ dec.rationale }}</p>
              <p v-if="dec.tradeoffsAccepted" class="decision-card__tradeoff"><strong>Trade-off:</strong> {{ dec.tradeoffsAccepted }}</p>
            </div>
          </div>

          <div class="vault-quick-actions">
            <button
              type="button"
              class="vault-ask-btn"
              @click="handleQuickAsk('Alex, hãy phân tích vấn đề hiện tại dựa trên các quyết định tương tự trong Decisions Table của Robert.')"
            >
              <span>Alex, tư vấn theo Decision Signals →</span>
            </button>
          </div>
        </section>
        <!-- 1. Finance & Debt Tab -->
        <section v-if="activeTab === 'finance'" class="vault-tab-pane">
          <div class="vault-field-group">
            <label class="vault-label">Thu nhập hàng tháng (Dòng tiền vào):</label>
            <input v-model="profileData.monthlyIncome" type="text" class="vault-input" />
          </div>

          <div class="vault-field-group">
            <label class="vault-label">Chi phí sinh hoạt tối thiểu (Burn Rate):</label>
            <input v-model="profileData.essentialBurnRate" type="text" class="vault-input" />
          </div>

          <div class="vault-field-group">
            <label class="vault-label">Danh sách các khoản nợ cần thanh toán (Debt Paydown):</label>
            <div v-for="debt in profileData.debts" :key="debt.id" class="debt-card">
              <div class="debt-card__top">
                <span class="debt-card__title">{{ debt.name }}</span>
                <span class="debt-card__rate">Lãi suất: {{ debt.rate }}</span>
              </div>
              <div class="debt-card__info">
                <span>Tổng nợ: <strong>{{ debt.amount }}</strong></span>
                <span>Hàng tháng: <strong>{{ debt.payment }}</strong></span>
              </div>
            </div>
          </div>

          <div class="vault-quick-actions">
            <button
              type="button"
              class="vault-ask-btn"
              @click="handleQuickAsk('Alex, hãy phân tích dòng tiền và tối ưu kế hoạch trả nợ theo chiến lược Avalanche cho Robert.')"
            >
              <span>Alex, tối ưu kế hoạch trả nợ →</span>
            </button>
          </div>
        </section>

        <!-- 2. Personality & Rhythm Tab -->
        <section v-else-if="activeTab === 'personality'" class="vault-tab-pane">
          <div class="vault-field-group">
            <label class="vault-label">Tính cách & Phong cách tư duy (MBTI):</label>
            <input v-model="profileData.mbti" type="text" class="vault-input" />
          </div>

          <div class="vault-field-group">
            <label class="vault-label">Khung giờ tập trung đỉnh cao (Deep Work Peak):</label>
            <input v-model="profileData.deepWorkPeak" type="text" class="vault-input" />
          </div>

          <div class="vault-field-group">
            <label class="vault-label">Nguyên tắc giao tiếp ưu tiên cùng Alex:</label>
            <textarea v-model="profileData.communicationPreference" rows="3" class="vault-textarea"></textarea>
          </div>
        </section>

        <!-- 3. Projects Tab -->
        <section v-else-if="activeTab === 'projects'" class="vault-tab-pane">
          <div v-for="proj in profileData.projects" :key="proj.id" class="project-item-card">
            <div class="project-item-card__title">{{ proj.name }}</div>
            <div class="project-item-card__role">Vai trò: {{ proj.role }} · Trạng thái: {{ proj.status }}</div>
          </div>
          <button
            type="button"
            class="vault-ask-btn"
            @click="handleQuickAsk('Alex, hãy review tiến độ các dự án và đề xuất 3 việc cần giải quyết hôm nay.')"
          >
            <span>Review các dự án cùng Alex →</span>
          </button>
        </section>

        <!-- 4. Family & Key People Tab -->
        <section v-else-if="activeTab === 'family'" class="vault-tab-pane">
          <div v-for="f in profileData.family" :key="f.id" class="family-card">
            <span class="family-card__rel">{{ f.relation }}</span>
            <p class="family-card__notes">{{ f.notes }}</p>
          </div>
        </section>

        <!-- 5. 180 Days Vision Tab -->
        <section v-else-if="activeTab === 'vision'" class="vault-tab-pane">
          <div class="vault-field-group">
            <label class="vault-label">Mục tiêu 180 Ngày & Tầm nhìn 5 Năm:</label>
            <textarea v-model="profileData.vision180" rows="4" class="vault-textarea"></textarea>
          </div>
        </section>
      </div>

      <!-- Footer Actions -->
      <div class="vault-modal__footer">
        <span v-if="isSaved" class="vault-saved-indicator">✓ Đã lưu mã hóa an toàn</span>
        <button type="button" class="vault-save-btn" @click="handleSaveProfile">
          Lưu hồ sơ cá nhân
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vault-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.vault-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
}

.vault-modal__sheet {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  background: var(--color-paper-2);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
  z-index: 10;
  overflow: hidden;
}

.vault-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.vault-modal__title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vault-modal__badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-accent);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.vault-modal__title {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-ink);
}

.vault-modal__sub {
  margin: 2px 0 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
}

.vault-modal__close-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper-3);
  color: var(--color-ink-2);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.vault-modal__tabs {
  display: flex;
  gap: 6px;
  padding: 10px 16px;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-hairline);
  background: var(--color-paper);
  scrollbar-width: none;
}

.vault-modal__tabs::-webkit-scrollbar {
  display: none;
}

.vault-modal__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper-2);
  color: var(--color-ink-2);
  font-size: var(--text-2xs);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.vault-modal__tab--active {
  background: var(--color-paper-dark);
  color: #ffffff;
  border-color: var(--color-paper-dark);
}

.vault-modal__body {
  padding: 16px 20px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.vault-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vault-label {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink);
}

.vault-input,
.vault-textarea {
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius-input);
  border: 1px solid var(--color-border-strong);
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: inherit;
  font-size: var(--text-xs);
  outline: none;
}

.vault-input:focus,
.vault-textarea:focus {
  border-color: var(--color-accent);
}

.debt-card,
.project-item-card,
.family-card {
  padding: 10px 12px;
  border-radius: var(--radius-card);
  background: var(--color-paper-3);
  border: 1px solid var(--color-border);
  margin-bottom: 8px;
}

.debt-card__top {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: var(--text-xs);
  color: var(--color-ink);
}

.debt-card__rate {
  color: var(--color-danger);
  font-size: var(--text-2xs);
}

.debt-card__info {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
}

.project-item-card__title,
.family-card__rel {
  font-weight: 700;
  font-size: var(--text-xs);
  color: var(--color-ink);
}

.project-item-card__role,
.family-card__notes {
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
  margin-top: 2px;
}

.vault-quick-actions {
  margin-top: 8px;
}

.decisions-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.vault-section-title {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink);
}

.vault-section-sub {
  margin: 2px 0 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-3);
}

.vault-add-btn {
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-paper-3);
  color: var(--color-ink);
  font-size: var(--text-2xs);
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.new-decision-form {
  padding: 12px;
  border-radius: var(--radius-card);
  background: var(--color-paper-3);
  border: 1px solid var(--color-border-strong);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.decisions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.decision-card {
  padding: 12px;
  border-radius: var(--radius-card);
  background: var(--color-paper-3);
  border: 1px solid var(--color-border);
}

.decision-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.decision-card__category {
  font-size: var(--text-3xs, 9px);
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--color-paper-dark);
  color: #ffffff;
}

.decision-card__time {
  font-size: var(--text-3xs, 9px);
  color: var(--color-ink-3);
}

.decision-card__situation {
  margin: 4px 0 6px;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1.4;
}

.decision-card__choice {
  font-size: var(--text-2xs);
  color: var(--color-ink);
  margin-bottom: 4px;
}

.decision-tag {
  color: var(--color-ember);
  font-weight: 700;
  margin-right: 4px;
}

.decision-card__rationale,
.decision-card__tradeoff {
  margin: 3px 0 0;
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
  line-height: 1.35;
}

.vault-ask-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-input);
  background: var(--color-accent);
  color: #ffffff;
  border: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  cursor: pointer;
}

.vault-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid var(--color-border);
  background: var(--color-paper-2);
}

.vault-saved-indicator {
  font-size: var(--text-2xs);
  color: var(--color-success);
  font-weight: 700;
}

.vault-save-btn {
  padding: 8px 16px;
  border-radius: var(--radius-input);
  background: var(--color-paper-dark);
  color: #ffffff;
  border: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  cursor: pointer;
}
</style>
