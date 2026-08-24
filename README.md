# Daily Mastery

A personal **180-day self-upgrade program** for a senior backend / AI engineer, featuring the **Alex AI Personal Co-pilot & Voice Engine**, built with a dual architecture:
- **Web App**: Static course publisher (Eleventy + Gulp + Rollup + SCSS) deployed to Firebase Hosting.
- **Mobile App**: Real-time cross-platform client (Vue 3 + Vite + Capacitor 6) for Android & iOS.

Three parallel tracks, taught **bilingually (English + Tiếng Việt)** and tracked day by day:
- **English** — high-level professional communication & daily fluency.
- **AI / LLM / ML** — hands-on engineering roadmap with cost-tagged resources.
- **Finance & Career** — strategic personal-finance and Staff/Principal trajectory.

The program runs for 180 days. Sign in (Google) to track your streak, XP, and completed lessons across all devices.

---

## 🎙️ Alex AI & Real-Time Voice Engine (0 VNĐ Operating Cost)

The mobile client includes an on-device conversational AI voice stack engineered for **sub-400ms latency** with **$0 VNĐ operating cost**:

### 1. Dual-Persona Voice Separation
- **Alex AI Co-Pilot (Live Call / Talk)**:
  - **Persona**: Energetic, articulate, and friendly young American male AI tech co-pilot & mentor.
  - **Spoken Language**: Natural American English (`en-US`).
  - **Voice Profile**: Youthful American male (`en-US male`, Pitch `1.08`, Rate `1.02` — *Guy, Aaron, Daniel, David, sfg*).
  - **Output Format**: Clean conversational dialogue (1–2 sentences, under 25 words, zero raw markdown).
- **English Learning Coach (Speak Screen & Shadowing)**:
  - **Persona**: Pedagogical English pronunciation & translation coach.
  - **Voice Profile**: Standard American female voice (`en-US female` — *Samantha, Google Female, Victoria*).

### 2. Web Audio API VAD (Voice Activity Detection)
- Real-time RMS volume sampling on the microphone `MediaStream`.
- Automatically detects speech completion and auto-submits after **1.2 seconds of silence**, enabling hands-free conversation without manual stop buttons.

### 3. Gemini 2.5 Flash Direct Audio Transcription
- High-fidelity verbatim speech recognition in **< 300ms** supporting both Vietnamese and English audio input.

### 4. Sentence-Pipelined TTS & Instant Barge-In
- **`SentenceAudioQueue`**: Enqueues and begins speaking the first sentence within **< 400ms** while subsequent LLM tokens stream in the background.
- **Instant Barge-In**: Interrupts and stops ongoing speech in **< 20ms** when the user speaks or taps the Living Voice Orb.

### 5. Multi-Tier Resilient API Key Storage
- Synchronizes credentials across 4 fallback layers: `Capacitor SecureStorage` (Android Keystore / iOS Keychain) ➔ `Capacitor Preferences` ➔ `localStorage` ➔ `Vite Env`.

---

## 📱 Mobile App (Android & iOS)

The mobile codebase lives under `mobile/`:

```bash
cd mobile

# 1. Install dependencies
npm install

# 2. Run unit & integration tests (149 tests across 39 suites)
npm test

# 3. Build mobile web assets
npm run build

# 4. Sync to native platforms
npx cap sync android
npx cap sync ios

# 5. Build Android Debug APK
cd android
JAVA_HOME=/path/to/jdk ./gradlew assembleDebug
```

The compiled Android APK is output to `mobile/android/app/build/outputs/apk/debug/app-debug.apk` (and mirrored to `daily-mastery-alex-v1.0.apk` at root).

---

## 🏗️ Web Publishing Pipeline

Requires [Node](https://nodejs.org/) v14 (LTS) or higher (`node -v`):

```bash
# Local development server
npm ci
npm run dev
```

Open `http://localhost:8080/` to preview locally.

### Production Build & Deployment

```bash
# Build production web bundle
ELEVENTY_ENV=prod npm run build

# Deploy to Firebase Hosting & Firestore Security Rules
firebase deploy --only hosting,firestore:rules
```

---

## 🧪 Testing & Verification

```bash
# Run mobile unit test suite
cd mobile && npm test

# Run build verification
cd mobile && npm run build
```

---

## 📚 Key Architectural Documentation

- [`docs/voice-and-tts-operating-cost-and-spec.md`](file:///Users/hoangminh.ho/Works/goal/daily-mastery/docs/voice-and-tts-operating-cost-and-spec.md) — Authoritative Voice & 0 VNĐ TTS Specification.
- [`docs/alex-personal-agent-architecture.md`](file:///Users/hoangminh.ho/Works/goal/daily-mastery/docs/alex-personal-agent-architecture.md) — 4-Tier Memory & MCP Tool Orchestration.
- [`docs/alex-decision-learning-and-rules.md`](file:///Users/hoangminh.ho/Works/goal/daily-mastery/docs/alex-decision-learning-and-rules.md) — Decision Journaling & DOs/DON'Ts.
- [`docs/mobile-build-and-cross-platform-architecture.md`](file:///Users/hoangminh.ho/Works/goal/daily-mastery/docs/mobile-build-and-cross-platform-architecture.md) — Cross-platform Capacitor Architecture.
