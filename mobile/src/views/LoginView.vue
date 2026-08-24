<script setup>
import {ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
import iconUrl from '../../brand/icon.svg';

const router = useRouter();
const {authError, isSignedIn, signIn} = useProgress();

const isSigningIn = ref(false);
const signInError = ref('');

watch(isSignedIn, (signedIn) => {
  if (signedIn) router.push({name: 'today'});
});

async function handleSignIn() {
  signInError.value = '';
  isSigningIn.value = true;
  try {
    await signIn();
  } catch (err) {
    signInError.value = 'Đăng nhập bị hủy hoặc thất bại. Vui lòng thử lại.';
  } finally {
    isSigningIn.value = false;
  }
}
</script>

<template>
  <section class="login">
    <div class="login__card">
      <div class="login__logo-wrap">
        <img :src="iconUrl" alt="Daily Mastery" class="login__logo" />
      </div>

      <ScreenHeader
        eyebrow="CHÀO MỪNG BẠN"
        title="Daily Mastery"
        subtitle="Học tiếng Anh giao tiếp mỗi ngày cùng con một cách tự nhiên & hiệu quả."
      />

      <!-- Benefits Highlights -->
      <div class="login__benefits">
        <div class="login__benefit-item">
          <svg class="login__benefit-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Lộ trình thông minh 5–15 phút mỗi ngày</span>
        </div>
        <div class="login__benefit-item">
          <svg class="login__benefit-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          </svg>
          <span>Luyện Shadowing & chấm điểm phát âm trực tiếp</span>
        </div>
        <div class="login__benefit-item">
          <svg class="login__benefit-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <span>Tích lũy điểm XP, nâng hạng & duy trì chuỗi học</span>
        </div>
      </div>

      <BaseButton
        :loading="isSigningIn"
        loading-label="Đang đăng nhập…"
        class="login__button"
        @click="handleSignIn"
      >
        <template #icon>
          <svg
            class="login__google-icon"
            viewBox="0 0 18 18"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
            />
          </svg>
        </template>
        Đăng nhập với Google
      </BaseButton>

      <p v-if="authError || signInError" class="login__error" role="alert">
        {{ authError || signInError }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.login {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.login__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  max-width: 26rem;
  padding: var(--space-xl) var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  border: 1px solid var(--color-hairline);
  box-shadow: var(--color-shadow-card);
  text-align: center;
}

.login__logo-wrap {
  width: 4rem;
  height: 4rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px -4px rgba(61, 78, 232, 0.35);
  margin-bottom: var(--space-2xs);
}

.login__logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login__benefits {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: 100%;
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-paper);
  border-radius: var(--radius-input);
  margin: var(--space-2xs) 0;
}

.login__benefit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-ink-2);
}

.login__benefit-icon {
  font-size: 1.1rem;
}

.login__button {
  width: 100%;
  margin-top: var(--space-xs);
}

.login__google-icon {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 3px;
  background: var(--color-on-accent);
  padding: 2px;
}

.login__error {
  margin: 0;
  color: var(--color-accent-3-deep);
  font-size: var(--text-sm);
  font-weight: 500;
}
</style>

