# Kiến Trúc Điều Hành Alex: Lịch 6:00 Sáng, Context Vault, Quyền Hạn & Chiến Lược Dataset/LLM Training

Tài liệu này cung cấp bản thiết kế kỹ thuật hoàn chỉnh và hướng dẫn chi tiết về cách Alex tự động điều hành lúc **06:00 sáng mỗi ngày**, cách bạn cung cấp thông tin cá nhân/dự án, các quyền hạn cần thiết trên thiết bị Android, cùng chiến lược mô hình ngôn ngữ lớn (LLM) và bộ dataset huấn luyện để Alex trở thành trợ lý cá nhân thông minh nhất của Robert.

---

## 1. Cơ Chế Báo Cáo Tổng Hợp Theo Yêu Cầu (On-Demand Intelligence & Briefing)

> **Cập nhật quy tắc theo yêu cầu của Robert:** Tính năng tự động đẩy thông báo lúc 06:00 sáng **đã được tắt tạm thời** để tránh làm phiền khi khối lượng công việc chưa cần thiết. Hệ thống chuyển sang cơ chế **Hoàn Toàn Theo Yêu Cầu (On-Demand)**: Khi Robert mở app hoặc gọi Alex yêu cầu báo cáo, Alex sẽ kết nối dữ liệu thời gian thực và trình bày các quyết định quan trọng.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ KHI ROBERT MỞ APP HOẶC GỌI ALEX: "Alex, báo cáo tình hình hôm nay"           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ KẾT NỐI VÀ TỔNG HỢP 4 TRỤ CỘT THEO THỜI GIAN THỰC (DailyBriefingEngine.js)   │
│                                                                             │
│ 1. Work & DevOps:                                                           │
│    • Quét GitHub repos: PRs chờ review/merge, build CI, Task tồn đọng.      │
│                                                                             │
│ 2. Tài Chính & Dòng Tiền:                                                   │
│    • Đối soát lịch trả nợ ngân hàng (Shinhan, TPBank) theo mô hình Avalanche.│
│    • Cảnh báo hạn mức chi tiêu và dòng tiền cần giữ an toàn.                 │
│                                                                             │
│ 3. Cuộc Sống & Gia Đình:                                                    │
│    • Quét ngày sinh nhật / ngày kỷ niệm gia đình trong 7 ngày tới.          │
│    • Nhắc nhịp sinh học Deep Work (09:00 - 11:30 & 14:30 - 16:30).          │
│                                                                             │
│ 4. Thị Trường & Daily Mastery:                                              │
│    • Cập nhật chỉ số BTC/ETH, xu hướng công nghệ & bài học ngày mới.        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ TỔNG HỢP RA: "TOP 3 QUYẾT ĐỊNH CẦN ROBERT XỬ LÝ"                            │
│                                                                             │
│ • Alex phản hồi giọng nói & giao diện:                                       │
│   "Chào Robert! Alex đã kết nối dữ liệu và tổng hợp các thông tin quan      │
│    trọng. Hiện tại có 3 quyết định cần bạn xử lý: 1. ..., 2. ..., 3. ..."   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cách Cung Cấp Context & Dữ Liệu Cá Nhân Cho Alex

Alex cần hiểu toàn diện về bạn nhưng vẫn đảm bảo **100% bảo mật cục bộ (Local-First Vault)**. Dưới đây là 2 cách bạn cung cấp context cho Alex:

### Cách A: Nhập Trực Tiếp Trên Ứng Dụng (Vault UI)
1. Mở màn hình Alex (`/agent`), bấm vào biểu tượng **Ngôi sao / Vault (`Robert's Context Vault`)** ở góc trên.
2. Cập nhật các tab:
   - **Tài chính & Nợ (Financial & Debt Paydown)**: Nhập thu nhập, chi phí hàng tháng, các khoản vay (Ngân hàng, Lãi suất, Ngày đến hạn, Số tiền thanh toán tối thiểu).
   - **Dự án & Tech Stack**: Nhập danh sách dự án (Daily Mastery, SaaS, Core Engines), Repo URLs, Branch chính.
   - **Gia đình & Cuộc sống**: Nhập sinh nhật người thân, các sự kiện quan trọng, sở thích cá nhân.
   - **Tính cách & Nhịp sinh học**: MBTI (INTJ/ENTJ), khung giờ tập trung cao độ (Chronotype).
   - **Decisions Table**: Bấm thêm các quyết định bạn vừa chốt để Alex học.

### Cách B: Cấu Hình Bằng File JSON / Markdown (Đồng bộ nhanh)
Alex hỗ trợ đọc file cấu hình cá nhân `robert-vault.json` đặt trong thư mục mã hóa của ứng dụng:
```json
{
  "profile": {
    "name": "Robert",
    "mbti": "INTJ-A",
    "chronotype": "Morning Lark (Deep Work: 09:00 - 11:30 & 14:30 - 16:30)",
    "financialProfile": {
      "monthlyIncome": 85000000,
      "fixedExpenses": 35000000,
      "strategy": "Debt Avalanche (Ưu tiên nợ lãi suất cao nhất)",
      "debtSchedule": [
        {
          "lender": "Shinhan Bank Consumer Loan",
          "rate": 14.5,
          "balance": 120000000,
          "minPayment": 12500000,
          "dueDay": 25
        }
      ]
    },
    "projectsProfile": {
      "activeProjects": [
        {
          "name": "Daily Mastery Mobile & AI Agent",
          "repo": "onmee-llc/daily-mastery",
          "priority": "P0"
        }
      ]
    },
    "familyProfile": {
      "importantDates": [
        {"label": "Sinh nhật Vợ", "date": "10-15"},
        {"label": "Kỷ niệm ngày cưới", "date": "11-20"}
      ]
    }
  }
}
```

---

## 3. Các Quyền Cần Cung Cấp Cho Alex (Permissions & API Keys)

### 3.1 Quyền Trên Thiết Bị Android (Đã khai báo trong AndroidManifest.xml)
1. **`POST_NOTIFICATIONS`**: Cho phép Alex gửi thông báo tổng hợp báo cáo lúc 06:00 sáng.
2. **`SCHEDULE_EXACT_ALARM` & `RECEIVE_BOOT_COMPLETED`**: Cho phép lịch 06:00 AM chạy chính xác từng giây ngay cả khi tắt màn hình hoặc sau khi máy khởi động lại.
3. **`RECORD_AUDIO` & `MODIFY_AUDIO_SETTINGS`**: Cho phép Alex nhận diện giọng nói khi bạn gọi và giao tiếp thoại.
4. **`INTERNET` & `ACCESS_NETWORK_STATE`**: Cho phép Alex kết nối API Git, LLM và dữ liệu thị trường.

### 3.2 Quyền & API Key Dịch Vụ Ngoài (Cài đặt trong mục Settings của App)
1. **`Gemini API Key` (Google AI Studio - Khuyên Dùng)**: 
   - Cung cấp miễn phí hoặc siêu rẻ (~0.05$/tháng).
   - Hỗ trợ model `gemini-2.5-flash` và `gemini-2.5-pro` với cửa sổ ngữ cảnh 1.000.000 tokens và function calling siêu tốc.
2. **`GitHub Personal Access Token (PAT)`** *(Tùy chọn cho dự án Git)*:
   - Tạo tại `GitHub -> Settings -> Developer Settings -> Personal access tokens`.
   - Chọn scope: `repo` (đọc PRs, issues, commits) và `read:user`.
3. **`Google Calendar / Obsidian Sync Token`** *(Tùy chọn)*: Để Alex đọc lịch cá nhân và ghi chú.

---

## 4. Kiến Trúc Mô Hình LLM, Bộ Dataset & Phương Pháp Huấn Luyện

### 4.1 Vì Sao KHÔNG CẦN Chi Hàng Chục Nghìn USD Để Pre-Train Model Từ Đầu?
Trong kỹ thuật AI hiện đại, **Pre-training** một mô hình nền tảng (Foundation Model) tốn từ \$50.000 - \$1.000.000 cho GPU cluster và dễ làm mất khả năng suy luận logic chung.

Thay vào đó, phương pháp chuẩn thế giới (State-of-the-Art) cho Trợ lý cá nhân chuyên sâu gồm **3 Tầng (3-Tier Architecture)**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ TẦNG 1: FOUNDATION REASONING MODEL (Lõi Suy Luận Đỉnh Cao)                  │
│                                                                             │
│ • Cloud / Heavy Tasks: Gemini 2.5 Flash / Pro (Google AI Studio).           │
│ • Local On-Device (Chạy Offline trên điện thoại): Gemma 2B / Llama 3.2 3B. │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ TẦNG 2: DECISIONS TABLE TRAINING SIGNAL (In-Context Learning - Đã Xây Dựng) │
│                                                                             │
│ • Bảng quyết định bất biến (DecisionJournalStore.js) lưu toàn bộ mental     │
│   models của Robert theo cấu trúc: (Tình huống -> Các phương án ->          │
│   Quyết định của Robert -> Lý do chốt -> Kết quả).                          │
│ • Khi gặp vấn đề mới: Alex tự động tìm 3-5 quyết định quá khứ tương tự      │
│   và đưa vào Prompt làm Training Signal tức thì (Zero-latency training).    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ TẦNG 3: SFT & LoRA FINE-TUNING PIPELINE (Khi Có 500 - 1,000 Quyết Định)     │
│                                                                             │
│ • Sau 3-6 tháng sử dụng, toàn bộ nhật ký quyết định và hội thoại được xuất   │
│   thành bộ Dataset chuẩn `robert_sft_dataset.jsonl`.                        │
│ • Chạy LoRA Fine-Tuning trên Gemma 2 (9B) hoặc Llama 3 (8B) bằng Unsloth.   │
│ • Xuất ra file GGUF / ONNX để chạy riêng tư 100% trên máy tính / thiết bị.   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Cấu Trúc Bộ Dataset Chuẩn Để Fine-Tune Alex

Bộ dataset của bạn được tổ chức theo chuẩn **Supervised Fine-Tuning (SFT) & DPO (Direct Preference Optimization)**:

```jsonl
{"instruction": "Review PR tách kiến trúc Agent và Streaming trên mobile", "context": "Robert đang quản lý repo daily-mastery, mobile chạy Vue 3 + Capacitor, cần tối ưu latency voice", "chosen_response": "Đồng ý tách Agent Core thành submodule độc lập, dùng WebSocket/SSE streaming. Tránh phụ thuộc chặt vào UI framework để sau này port sang React Native/Flutter không cần sửa logic.", "rejected_response": "Viết gộp tất cả logic streaming trực tiếp vào Vue component để code nhanh hơn.", "mental_model": "Architecture Decoupling & Future-Proofing"}
{"instruction": "Tháng này có khoản dư 25,000,000 VNĐ, nên phân bổ thế nào?", "context": "Khoản vay Shinhan lãi suất 14.5%, khoản vay xe máy 8.0%, quỹ khẩn cấp đã đủ 3 tháng", "chosen_response": "Áp dụng phương pháp Debt Avalanche: Dồn toàn bộ 25 triệu trả trước vào khoản vay Shinhan lãi suất 14.5% để giảm ngay chi phí lãi suất kép.", "rejected_response": "Chia đều 25 triệu cho 2 khoản vay hoặc để vào tài khoản tiết kiệm 5%.", "mental_model": "Debt Avalanche Financial Optimization"}
```

### Cách Xuất Dataset Và Chạy Fine-Tune:
1. Alex tích hợp sẵn lệnh xuất dataset từ Decisions Table: `alex export-sft-dataset`.
2. Chạy Fine-tuning miễn phí bằng Google Colab T4 GPU với thư viện `unsloth`:
```python
from unsloth import FastLanguageModel
import torch

# 1. Load Base Model (Gemma-2-9b hoặc Llama-3-8b)
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="google/gemma-2-9b-it",
    max_seq_length=4096,
    load_in_4bit=True,
)

# 2. Add LoRA Adapters theo phong cách của Robert
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
)

# 3. Train với dataset robert_sft_dataset.jsonl và export GGUF cho Mobile/Local
```

---

## 6. Tóm Tắt Kế Hoạch Vận Hành Cho Bạn

| Hạng mục | Bạn cần làm | Alex sẽ tự động làm |
| :--- | :--- | :--- |
| **06:00 Sáng** | Mở app hoặc nghe thông báo | Tự động quét Git, Nợ, Nhịp sinh học, và đọc Top 3 Quyết định quan trọng. |
| **Context Cá nhân** | Nhập thông tin vào Vault hoặc sửa `robert-vault.json` | Tự động ghi nhớ, mã hóa và tra cứu mỗi khi bạn hỏi hoặc ra quyết định. |
| **Quyền hạn** | Cấp quyền Audio, Notification và nhập Gemini API Key | Tự động điều phối công việc và gửi nhắc nhở thông minh. |
| **Học Phong cách** | Chốt quyết định bình thường trong công việc | Tự lưu vào Decisions Table và áp dụng làm Training Signal cho các lần sau. |
