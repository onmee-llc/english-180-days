---
title: "Day 214 — Model Extraction & Privacy Attacks"
description: "Explain model inversion, membership inference, and how to defend proprietary model weights and user privacy."
date: 2026-08-25
---

## Session goal

Explain how adversaries attempt to steal proprietary model capabilities or reconstruct sensitive training records, and present defenses like Differential Privacy and rate limiting.

{% vi %}
**Mục tiêu buổi học:** Giải thích cách kẻ tấn công cố gắng đánh cắp năng lực mô hình độc quyền hoặc tái cấu trúc các bản ghi dữ liệu huấn luyện nhạy cảm, và trình bày các giải pháp phòng thủ như Differential Privacy và giới hạn tần suất gọi API (rate limiting).
{% endvi %}

## Shadowing passage

> Model extraction and privacy attacks target the intellectual property and confidentiality of machine learning systems. In a model extraction attack, an adversary systematically queries your API with crafted inputs and uses the returned predictions and probability distributions to train a local clone model, effectively stealing millions of dollars in training investment. Simultaneously, privacy attacks like membership inference determine whether a specific individual's medical or financial record was part of the training set by analyzing confidence score variances. Even worse, model inversion attacks can mathematically reconstruct identifiable images or private text directly from the model's output embeddings. To protect our proprietary systems, we suppress detailed raw logit arrays, inject differential privacy noise into gradient computations during fine-tuning, and enforce query rate limiting combined with automated behavioral anomaly detection.

{% vi %}
Các cuộc tấn công trích xuất mô hình và xâm phạm quyền riêng tư nhắm vào tài sản trí tuệ và tính bảo mật của hệ thống học máy. Trong một cuộc tấn công trích xuất mô hình (model extraction), kẻ tấn công truy vấn có hệ thống vào API của bạn bằng các input được thiết kế riêng và sử dụng các dự đoán cùng phân phối xác suất trả về để huấn luyện một mô hình bản sao (clone) cục bộ, đánh cắp hiệu quả hàng triệu đô la chi phí đầu tư huấn luyện. Đồng thời, các cuộc tấn công quyền riêng tư như suy luận thành viên (membership inference) xác định xem hồ sơ y tế hoặc tài chính của một cá nhân cụ thể có nằm trong tập dữ liệu huấn luyện hay không bằng cách phân tích sự biến thiên của điểm tin cậy. Tồi tệ hơn, các cuộc tấn công đảo ngược mô hình (model inversion) có thể tái cấu trúc toán học các hình ảnh nhận dạng được hoặc văn bản riêng tư trực tiếp từ output embeddings của mô hình. Để bảo vệ các hệ thống độc quyền, chúng tôi ẩn mảng logit thô chi tiết, đưa nhiễu Differential Privacy vào tính toán gradient khi fine-tuning, và thực thi giới hạn tần suất truy vấn kết hợp phát hiện bất thường về hành vi.
{% endvi %}

---

## 🔤 International Phonetic Alphabet (IPA)

- *Model extraction and privacy attacks target the intellectual property:* /ˈmɑː.dəl ɪkˈstræk.ʃən ænd ˈpraɪ.və.si əˈtæks ˈtɑːr.ɡɪt ðə ˌɪn.t̬əlˈek.tʃuː.əl ˈprɑː.pɚ.t̬i/
- *membership inference determines whether a record was part of the training set:* /ˈmem.bɚ.ʃɪp ˈɪn.fɚ.əns dɪˈtɝː.mɪnz ˈweð.ɚ ə ˈrek.ɚd wɑːz pɑːrt əv ðə ˈtreɪ.nɪŋ set/
- *model inversion attacks can reconstruct identifiable images:* /ˈmɑː.dəl ɪnˈvɝː.ʒən əˈtæks kæn ˌriː.kənˈstrʌkt aɪˌden.t̬əˈfaɪ.ə.bəl ˈɪm.ɪ.dʒɪz/
- *differential privacy noise into gradient computations:* /ˌdɪf.əˈren.ʃəl ˈpraɪ.və.si nɔɪz ˈɪn.tuː ˈɡreɪ.di.ənt ˌkɑːm.pjəˈteɪ.ʃənz/
- *query rate limiting combined with behavioral anomaly detection:* /ˈkwɪr.i reɪt ˈlɪm.ɪ.t̬ɪŋ kəmˈbaɪnd wɪð bɪˈheɪv.jɚ.əl əˈnɑː.məl.i dɪˈtek.ʃən/

---

## 🧠 Key Grammar Points

### 1. Inversion with Negative Adverbials (*Not only... but also / Simultaneously*)
- **Formula:** `Not only + Aux + S + V, but S + also + V`
- **Example:** *"Not only does model extraction threaten intellectual property, but it also increases the attack surface for evasion attacks."*
- **Usage:** Rất phù hợp khi trả lời câu hỏi phỏng vấn về mức độ nghiêm trọng của một lỗ hổng bảo mật.

### 2. Complex Gerund Complements
- **Formula:** `Verbs of prevention (prevent / protect against / suppress) + Object + from + V-ing`
- **Example:** *"This protects our proprietary architecture from being cloned by competitor scrapers."*

---

## 📖 Key Vocabulary & Pronunciation

| Term | IPA | Meaning | Context & Audio |
|---|---|---|---|
| **model extraction** | /ˈmɑː.dəl ɪkˈstræk.ʃən/ | Trích xuất mô hình | *Stealing a model's capabilities by cloning its outputs via black-box queries.* |
| **membership inference** | /ˈmem.bɚ.ʃɪp ˈɪn.fɚ.əns/ | Suy luận thành viên | *Proving a specific data record was present in the private training set.* |
| **model inversion** | /ˈmɑː.dəl ɪnˈvɝː.ʒən/ | Đảo ngược mô hình | *Reconstructing underlying training data samples directly from output logits.* |
| **differential privacy** | /ˌdɪf.əˈren.ʃəl ˈpraɪ.və.si/ | Quyền riêng tư vi sai | *A rigorous mathematical framework bounding the privacy leakage of algorithms.* |
| **logits suppression** | /ˈloʊ.dʒɪts səˈpreʃ.ən/ | Ẩn giá trị logit thô | *Returning only top-k labels rather than full continuous probability distributions.* |

---

## 💬 Key Sentence Patterns

1. **Discussing Privacy Guarantees:**
   - *"To guarantee that [Sensitive Data] cannot be leaked, we apply [Privacy Technique] with an epsilon bound of [Value]."*
   - *Example:* *"To guarantee that healthcare records cannot be leaked via membership inference, we apply DP-SGD with an epsilon bound of 2.0."*
2. **Defending API Endpoints:**
   - *"We mitigate model cloning by stripping [Sensitive Telemetry] and throttling [Query Patterns]."*
   - *Example:* *"We mitigate model cloning by stripping full logit arrays and throttling high-frequency programmatic queries."*

---

## 📝 Lesson Exam & Mastery Assessment

### Knowledge Quiz
1. **What is the goal of a membership inference attack?**
   - (A) To shut down the web server hosting the model
   - (B) To determine if a specific data subject's record was used during training
   - (C) To change the color scheme of the web application
   - *(Correct Answer: B)*
2. **How does Differential Privacy protect machine learning models during training?**
   - (A) By deleting the dataset after one epoch
   - (B) By adding calibrated mathematical noise to gradients to mask individual contributions
   - (C) By turning off GPU acceleration
   - *(Correct Answer: B)*
3. **Fill in the blank:** *"Suppressing raw logit distributions prevents adversaries from _______ accurate shadow models."*
   - (A) train
   - (B) training
   - (C) to train
   - *(Correct Answer: B)*

### Speaking & Shadowing Requirement
- Record shadowing the passage aloud (Target: >= 70% accuracy).

---

## 📚 References & Deep-Dive Resources

- 🔗 **Membership Inference Attacks Against Machine Learning Models (IEEE S&P):** [https://arxiv.org/abs/1610.05820](https://arxiv.org/abs/1610.05820)
- 🔗 **Differential Privacy in Deep Learning (Abadi et al., Google Research):** [https://arxiv.org/abs/1607.00133](https://arxiv.org/abs/1607.00133)
- 🔗 **TensorFlow Privacy & Opacus (PyTorch DP Library):** [https://opacus.ai/](https://opacus.ai/)
