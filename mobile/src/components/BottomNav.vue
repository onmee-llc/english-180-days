<script setup>
import {useRouter} from 'vue-router';
import {useSpeakSession} from '../composables/useSpeakSession.js';
import {createPressGesture} from '../composables/useLongPress.js';

const router = useRouter();
const {status, handlePressStart, handlePressEnd} = useSpeakSession();

// Long-press the Speak tab from any screen to start recording immediately,
// without navigating there first. A quick tap still navigates normally.
// Rendered via router-link's `custom` slot (not a plain @click on
// router-link) so we own the click entirely — no relying on event-listener
// ordering between our handler and router-link's internal navigate-on-click.
const LONG_PRESS_MS = 250;
let suppressNextClick = false;
const gesture = createPressGesture({
  thresholdMs: LONG_PRESS_MS,
  onLongPress: handlePressStart,
});

function onPressStart() {
  gesture.start();
}

function onPressEnd() {
  suppressNextClick = gesture.end();
  if (!suppressNextClick) return; // plain tap — let the click navigate
  handlePressEnd().then(() => router.push({name: 'speak'}));
}

function onClick(event, navigate) {
  event.preventDefault(); // we always decide navigation ourselves below
  if (suppressNextClick) {
    suppressNextClick = false;
    return; // long press already navigated once handlePressEnd() finished
  }
  // Called with no args on purpose: navigate()'s own internal guard bails
  // out when the event it's passed already has defaultPrevented set — which
  // we just did above — so passing `event` here would silently no-op.
  navigate();
}
</script>

<template>
  <nav class="bottom-nav">
    <router-link to="/" class="bottom-nav__link">
      <svg class="bottom-nav__icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <span class="bottom-nav__label">Today</span>
    </router-link>
    <router-link to="/calendar" class="bottom-nav__link">
      <svg class="bottom-nav__icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4.5" width="18" height="16" rx="3" />
        <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      </svg>
      <span class="bottom-nav__label">Calendar</span>
    </router-link>
    <router-link to="/courses" class="bottom-nav__link">
      <svg class="bottom-nav__icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 4.5c2.5-1 5.5-1 8 0v15c-2.5-1-5.5-1-8 0z" />
        <path d="M20 4.5c-2.5-1-5.5-1-8 0v15c2.5-1 5.5-1 8 0z" />
      </svg>
      <span class="bottom-nav__label">Courses</span>
    </router-link>
    <router-link to="/settings" class="bottom-nav__link">
      <svg class="bottom-nav__icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 13a7.97 7.97 0 0 0 0-2l1.9-1.5-2-3.4-2.2.9a7.96 7.96 0 0 0-1.7-1L15 3.6h-4l-.4 2.4a7.96 7.96 0 0 0-1.7 1l-2.2-.9-2 3.4L6.6 11a7.97 7.97 0 0 0 0 2l-1.9 1.5 2 3.4 2.2-.9c.5.4 1.1.7 1.7 1l.4 2.4h4l.4-2.4c.6-.3 1.2-.6 1.7-1l2.2.9 2-3.4z" />
      </svg>
      <span class="bottom-nav__label">Settings</span>
    </router-link>
    <router-link to="/speak" custom v-slot="{navigate, isActive, href}">
      <a
        :href="href"
        class="bottom-nav__link"
        :class="{
          'router-link-exact-active': isActive,
          'bottom-nav__link--recording': status === 'recording',
        }"
        @mousedown="onPressStart"
        @mouseup="onPressEnd"
        @touchstart="onPressStart"
        @touchend="onPressEnd"
        @touchcancel="gesture.cancel()"
        @click="onClick($event, navigate)"
      >
        <svg class="bottom-nav__icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
          <path d="M19 11a7 7 0 0 1-14 0" />
          <line x1="12" y1="18" x2="12" y2="22" />
        </svg>
        <span class="bottom-nav__label">Speak</span>
      </a>
    </router-link>
  </nav>
</template>

<style scoped>
/* Hallmark · component: bottom nav bar · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: link — default · hover(pointer) · focus-visible · active-route
 */

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  gap: var(--space-2xs);
  padding: var(--space-xs) var(--space-xs) calc(var(--space-xs) + env(safe-area-inset-bottom));
  background: var(--color-paper);
  border-top: 1px solid oklch(20% 0.012 250 / 0.1);
  box-shadow: 0 -8px 24px -16px oklch(20% 0.012 250 / 0.25);
}

.bottom-nav__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
  min-height: 44px;
  padding: 0.3rem 0.25rem;
  border-radius: 14px;
  color: var(--color-ink-3);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out);
}

@media (hover: hover) {
  .bottom-nav__link:hover {
    color: var(--color-ink-2);
    background: var(--color-paper-2);
  }
}

.bottom-nav__link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.bottom-nav__icon {
  transition: transform var(--dur-fast) var(--ease-out);
}

.bottom-nav__label {
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.bottom-nav__link.router-link-exact-active {
  color: var(--color-on-accent);
  background: var(--color-accent);
}

.bottom-nav__link.router-link-exact-active .bottom-nav__icon {
  transform: translateY(-1px);
}

.bottom-nav__link.router-link-exact-active .bottom-nav__label {
  font-weight: 700;
}

/* recording via long-press, from any screen — mirrors SpeakView's own
 * recording state (--color-accent-3) so the two read as the same mode. */
.bottom-nav__link--recording {
  color: var(--color-on-accent);
  background: var(--color-accent-3);
  animation: bottom-nav-pulse 1s var(--ease-out) infinite;
}

@keyframes bottom-nav-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bottom-nav__link,
  .bottom-nav__icon {
    transition: color var(--dur-fast) linear;
    transform: none !important;
  }
  .bottom-nav__link--recording {
    animation: none;
  }
}
</style>
