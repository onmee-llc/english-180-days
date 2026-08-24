# Daily Mastery Mobile — Android Build Guide & Cross-Platform Architecture

**Application ID:** `vn.onmee.dailymastery`  
**Framework:** Vue 3 + Vite + Capacitor 6  
**Target OS:** Android (Primary Build Focus) & iOS (Scaffolded & Ready-to-Build)  
**Status:** Build & Architecture Guide v2.0  

---

## 1. Android Build & Deployment Pipeline

### 1.1 Yêu cầu Môi trường (Prerequisites)
- **Node.js**: v20.x hoặc v22.x
- **Java JDK**: OpenJDK 17 hoặc 21 (khuyến nghị temurin-17)
- **Android SDK**: API Level 34 (Android 14) hoặc API Level 33

### 1.2 Lệnh Build Android Từng Bước

```bash
# Bước 1: Di chuyển vào thư mục mobile
cd mobile

# Bước 2: Cài đặt dependencies (nếu chưa có)
npm install

# Bước 3: Biên dịch toàn bộ tài nguyên Web (HTML/JS/CSS/Lessons)
npm run build

# Bước 4: Đồng bộ tài nguyên Web và Native Plugins vào thư mục Android
npx cap sync android

# Bước 5: Biên dịch gói APK Debug
cd android
./gradlew assembleDebug

# File APK tạo ra tại:
# mobile/android/app/build/outputs/apk/debug/app-debug.apk
```

### 1.3 Tạo Gói Release Cho Google Play Store (AAB / Signed APK)

```bash
# Biên dịch Android App Bundle (AAB) cho Google Play Console
./gradlew bundleRelease

# File AAB tạo ra tại:
# mobile/android/app/build/outputs/bundle/release/app-release.aab
```

### 1.4 Quyền Truy Cập (Android Permissions)
Đã được thiết lập sẵn trong `mobile/android/app/src/main/AndroidManifest.xml`:
- `android.permission.INTERNET`: Kết nối Cloud LLMs và các máy chủ MCP.
- `android.permission.RECORD_AUDIO`: Thu âm giọng nói để đàm thoại với Alex và luyện phát âm.
- `android.permission.MODIFY_AUDIO_SETTINGS`: Điều chỉnh âm lượng và cấu hình loa đàm thoại.

---

## 2. Chuẩn Hóa Kiến Trúc Sẵn Sàng Cho iOS (Ready-to-Build Scaffolding)

Dành cho khi bạn chuyển sang máy có quyền quản trị (Admin/Xcode) hoặc hệ thống CI/CD (GitHub Actions / Cloud Build):

```text
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE UNIFIED CODEBASE                  │
│   src/ (Vue 3, Agent Core, MemoryStore, Master Brand Kit)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ npx cap sync
                ┌──────────────┴──────────────┐
                ▼                             ▼
       ┌─────────────────┐           ┌─────────────────┐
       │     ANDROID     │           │       iOS       │
       │ (android/app)   │           │   (ios/App)     │
       │ Gradle 8.2      │           │ Xcode Workspace │
       │ NDK / Kotlin    │           │ Swift 5.9       │
       └─────────────────┘           └─────────────────┘
```

### 2.1 Cấu Hình iOS Đã Được Chuẩn Hóa Sẵn:
1. **Thư mục iOS**: Toàn bộ dự án iOS đã được tạo và đồng bộ tại `mobile/ios/App/App.xcworkspace`.
2. **Quyền riêng tư (Privacy Permissions trong `Info.plist`)**:
   - `NSMicrophoneUsageDescription`: *"Daily Mastery uses the microphone to enable natural voice conversations with your AI Co-pilot Alex and for pronunciation practice."*
   - `NSSpeechRecognitionUsageDescription`: *"Daily Mastery uses speech recognition to transcribe your voice notes and conversational English practice."*
3. **Lệnh build iOS khi có Xcode**:
   ```bash
   cd mobile
   npm run build
   npx cap sync ios
   npx cap open ios  # Mở trực tiếp trong Xcode để Archive hoặc chạy Simulator
   ```

---

## 3. Kiến Trúc Native SLM Plugin Mở Rộng Cho Cả Android & iOS

Khi cần kích hoạt mô hình On-Device SLM (Gemma 2B / LLaMA 3.2 1B–3B) tăng tốc NPU 100%:

```text
┌─────────────────────────────────────────────────────────────┐
│               JAVASCRIPT AGENT CORE (UNIVERSAL)             │
│   mobile/src/agent-core/LLMClient.js                        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Capacitor Plugin Call
┌──────────────────────────────┴──────────────────────────────┐
│             NATIVE SLM BRIDGE (CAPACITOR PLUGIN)            │
├──────────────────────────────┬──────────────────────────────┤
│      ANDROID RUNTIME         │          iOS RUNTIME         │
│  • ExecuTorch Android / C++  │  • ExecuTorch iOS / Swift    │
│  • Qualcomm NPU / Hexagon    │  • Apple Neural Engine (ANE) │
│  • MediaPipe GenAI Tasks     │  • CoreML Metal Acceleration │
└──────────────────────────────┴──────────────────────────────┘
```

Mọi thay đổi tăng tốc Native chỉ diễn ra ở tầng Plugin; toàn bộ não bộ của Alex, quy tắc giao tiếp, và các bài học trong Daily Mastery đều được bảo toàn 100%.
