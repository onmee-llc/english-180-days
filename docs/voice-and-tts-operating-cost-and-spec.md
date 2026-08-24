# Voice & Text-To-Speech Operating Cost Analysis & Authoritative Specification

**User:** Robert  
**AI Agent Co-Pilot:** Alex  
**Status:** Authoritative Architectural & Operating Cost Specification v2.0  
**Repository:** `daily-mastery`  

---

## 1. Phân Tích Chi Phí Vận Hành (Operating Cost Analysis)

Hệ thống âm thanh của `daily-mastery` được thiết kế theo triết lý **On-Device Native-First Architecture**, giúp tối ưu hóa chi phí vận hành xuống mức **0 VNĐ (Hoàn toàn MIỄN PHÍ)** và triệt tiêu độ trễ mạng (0ms latency).

### 1.1 Bảng So Sánh Chi Phí Thực Tế (Monthly Cost Breakdown)

| Thành phần | Công nghệ sử dụng trong App | Chi phí vận hành (Thực tế) | So sánh nếu dùng Cloud API (OpenAI / ElevenLabs) |
| :--- | :--- | :--- | :--- |
| **Voice Output (TTS) - Alex Assistant** | Android Native TTS (`@capacitor-community/text-to-speech`) + Web Speech API | **$0.00 / tháng (0 VNĐ)** | **$15 - $30 / tháng** (ElevenLabs / Google Cloud Neural2: ~$15-$30 / 1M ký tự) |
| **Voice Output (TTS) - Học Tiếng Anh** | Native English TTS (`en-US`, Samantha / Google US English) | **$0.00 / tháng (0 VNĐ)** | **$10 - $20 / tháng** (Amazon Polly / Azure Neural TTS) |
| **Voice Input (STT) - Thu âm & Nhận diện** | Web SpeechRecognition API + On-Device MediaRecorder | **$0.00 / tháng (0 VNĐ)** | **$0.006 / phút** (~$9.00/tháng nếu dùng OpenAI Whisper Cloud API) |
| **AI LLM Reasoning (Tư duy & Đàm thoại)** | Gemini 2.0 Flash / Flash-Lite *(hoặc On-Device Gemma 2B)* | **$0.00 / tháng** *(Free Tier: 1,500 req/ngày)* <br> *(Vượt Free Tier: ~$0.15/tháng)* | **$10 - $20 / tháng** (GPT-4o Realtime Voice API: $0.06/phút input, $0.24/phút output) |
| **Tổng Chi Phí Vận Hành Hàng Tháng** | **Kiến trúc On-Device Native-First** | **0 VNĐ / tháng** | **~$35 - $80 / tháng** (Nếu dùng toàn bộ Cloud Voice Stack) |

### 1.2 Tại sao Kiến trúc On-Device đạt chi phí $0 và Độ trễ 0ms?
1. **Tận dụng Engine có sẵn của Hệ điều hành Android**: 
   Mọi thiết bị Android đều được cài sẵn *Google Speech Services* và *Google Text-to-Speech Engine*. Ứng dụng kích hoạt trực tiếp phần cứng và engine này qua Capacitor Bridge mà không phát sinh bất kỳ traffic mạng nào lên cloud.
2. **Bảo mật dữ liệu tuyệt đối (Zero Data Leakage)**:
   Giọng nói tiếng Việt của Robert khi nói chuyện riêng tư với Alex được xử lý nội bộ trên thiết bị, không bị gửi lên các server âm thanh trung gian của bên thứ ba.
3. **Hoạt động Offline 100% khi không có mạng**:
   Engine TTS và bài học tiếng Anh vẫn phát âm chuẩn xác ngay cả khi điện thoại ở chế độ máy bay (Airplane Mode).

---

## 2. Quy Chuẩn Voice Profiles (Authoritative Voice Specification)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. ALEX TRỢ LÝ AI (VOICE TALK & EXECUTIVE BRIEFING)                        │
│                                                                             │
│ • Ngôn ngữ: Tiếng Việt (vi-VN).                                             │
│ • Giới tính: GIỌNG NAM (Male Baritone Voice).                               │
│ • Cấu hình Pitch: 0.88 (Độ trầm tự nhiên, điềm tĩnh, ấm áp, chuyên nghiệp).│
│ • Tốc độ đọc (Rate): 0.95 - 1.0 (Nhịp điệu đàm thoại trôi chảy).           │
│ • Bộ chuyển đổi thoại: convertTextToNaturalSpokenVietnamese()               │
│   -> Bóc tách 100% raw markdown, gạch đầu dòng, số thứ tự, code block.     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. CHƯƠNG TRÌNH HỌC TIẾNG ANH (DAILY MASTERY, SHADOWING & SPEAK ROOM)       │
│                                                                             │
│ • Ngôn ngữ: Chuẩn Anh - Mỹ (en-US).                                         │
│ • Giới tính: GIỌNG NỮ (Female Native Voice).                                │
│ • Profile Giọng: Samantha, Google US English, Victoria.                     │
│ • Cấu hình Pitch: 1.02 (Trong trẻo, chuẩn xác từng âm vị IPA).             │
│ • Chế độ đọc: Đọc chính xác từng câu văn bản để học viên luyện phát âm.    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Quy Chuẩn Đàm Thoại & Ngắt Lời Tức Thì (Instant Barge-In Protocol)

### 3.1 Chuyển đổi Văn bản sang Thoại Tự Nhiên (Conversational Transformation)
Alex **TUYỆT ĐỐI KHÔNG ĐƯỢC** đọc văn bản như máy scan tài liệu. Mọi phản hồi đều phải đi qua bộ lọc `convertTextToNaturalSpokenVietnamese()`:
- ❌ **Không đọc**: `### 3 việc quan trọng: - **Ưu tiên 1**: Làm task A`
-  **Chuyển thành**: `3 việc quan trọng hôm nay. Ưu tiên 1 là Làm task A.`

### 3.2 Cơ chế Ngắt Lời (Barge-In / Instant Stop)
- Khi Alex đang nói (`callState === 'speaking'`), hệ thống hiển thị nút dừng màu đỏ và quả cầu âm thanh chuyển sang trạng thái tương tác.
- **Hành động ngắt lời**:
  - Chạm vào Quả Cầu Âm Thanh (Center Orb).
  - Bấm nút Mic trung tâm.
  - Bấm nút `"Dừng nói"`.
  - Robert bắt đầu phát âm nói câu mới.
- **Hành vi xử lý**: Ngay lập tức gọi `stopTtsAudio()` (hủy `TextToSpeech.stop()` và `speechSynthesis.cancel()`), chuyển trạng thái về `idle`/`listening` trong **< 50ms**, không phát thêm bất kỳ âm thanh dư thừa nào.

---

## 4. Quy Chuẩn Giao Diện & Safe Area Trên Điện Thoại Android

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ MÀN HÌNH ĐIỆN THOẠI ANDROID                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Alex Live Topbar] (Trạng thái, Tắt/Bật âm, Thu nhỏ)                      │
│                                                                             │
│                        (   )                                                │
│                      ((     ))   Living Voice Orb                           │
│                        (   )                                                │
│                                                                             │
│               "Phụ đề đàm thoại tự nhiên..."                                │
│                                                                             │
│                                                                             │
│          [Bàn phím]         ( MIC LỚN )         [Mở Drawer Tính Năng]      │
│ ─────────────────────────────────────────────────────────────────────────── │
│  ↑ Khoảng đệm an toàn: padding-bottom: calc(36px + env(safe-area-bottom))   │
├─────────────────────────────────────────────────────────────────────────────┤
│  [  ◄ Back  ]          [  ● Home  ]          [  ■ Recent Apps  ]            │
│  (Thanh điều hướng 3 nút của Android không bao giờ bị đè lên phím app)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Thanh điều hướng Android (3-Button Navigation Bar)**:
   - Các nút Mic, Soạn tin nhắn, BottomNav luôn có khoảng đệm tối thiểu `36px - 48px` phía trên thanh điều hướng hệ thống.
2. **Tab "Alex AI" trên BottomNav**:
   - Khi bấm vào tab "Alex AI", ứng dụng mở trực tiếp màn hình Live Voice Talk Full-Screen (`openFullScreenCall()`), không bao giờ điều hướng sang trang rỗng/màn hình trắng.
3. **Quy tắc Báo cáo 06:00 sáng (Rule DON'T 6)**:
   - Tắt hoàn toàn thông báo push định kỳ 06:00 AM.
   - Alex chỉ tổng hợp báo cáo thời gian thực **On-Demand** khi Robert chủ động yêu cầu.
