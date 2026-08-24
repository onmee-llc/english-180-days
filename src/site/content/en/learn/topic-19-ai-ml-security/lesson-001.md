---
title: "Day 211 — AI/ML Threat Modeling & Attack Surface"
description: "Model the attack surface of AI systems: data pipelines, model weights, API gateways, and runtime environments."
date: 2026-08-22
---

## Session goal

Explain how you systematically threat model an enterprise AI system by breaking down the attack surface across data, models, infrastructure, and user interfaces.

{% vi %}
**Mục tiêu buổi học:** Giải thích cách bạn lập mô hình mối đe dọa (threat modeling) cho một hệ thống AI doanh nghiệp bằng cách phân tích bề mặt tấn công qua các tầng: dữ liệu, mô hình, hạ tầng và giao diện người dùng.
{% endvi %}

## Shadowing passage

> When threat modeling an enterprise AI architecture, I analyze four distinct layers: data ingestion, model weights, runtime inference, and tool execution. At the data layer, the primary risks are training data poisoning and supply chain contamination from third-party datasets. At the model layer, we must protect against model extraction, weight tampering, and membership inference attacks that leak sensitive training data. At the runtime inference layer, prompt injection and denial-of-wallet attacks represent the most frequent attack vectors. Finally, at the tool execution layer, autonomous agents must never have unsandboxed access to shell commands or internal APIs. Applying the STRIDE framework specifically tailored for AI ensures we identify attack paths before deploying to production. By implementing defense-in-depth across each layer, we minimize the blast radius if any single control fails.

{% vi %}
Khi lập mô hình mối đe dọa cho kiến trúc AI doanh nghiệp, tôi phân tích bốn tầng riêng biệt: thu nạp dữ liệu, trọng số mô hình, suy luận runtime, và thực thi công cụ. Ở tầng dữ liệu, rủi ro chính là đầu độc dữ liệu huấn luyện và ô nhiễm chuỗi cung ứng từ các bộ dữ liệu bên thứ ba. Ở tầng mô hình, chúng ta phải bảo vệ chống lại trích xuất mô hình, can thiệp trọng số và tấn công suy luận thành viên làm rò rỉ dữ liệu huấn luyện nhạy cảm. Ở tầng suy luận runtime, chèn prompt và tấn công làm cạn kiệt ví (denial-of-wallet) đại diện cho các vectơ tấn công thường xuyên nhất. Cuối cùng, ở tầng thực thi công cụ, các agent tự trị không bao giờ được phép truy cập không cô lập vào lệnh shell hoặc API nội bộ. Việc áp dụng khung STRIDE được tùy biến riêng cho AI đảm bảo chúng ta phát hiện các đường dẫn tấn công trước khi triển khai lên production. Bằng cách thực thi phòng thủ theo chiều sâu trên từng tầng, chúng ta giảm thiểu tối đa phạm vi ảnh hưởng nếu bất kỳ chốt kiểm soát đơn lẻ nào bị thất bại.
{% endvi %}

---

## 🔤 International Phonetic Alphabet (IPA)

- *When threat modeling an enterprise AI architecture:* /wen θret ˈmɑː.dəl.ɪŋ ən ˈen.t̬ɚ.praɪz eɪ-aɪ ˈɑːr.kə.tek.tʃɚ/
- *I analyze four distinct layers:* /aɪ ˈæn.əl.aɪz fɔːr dɪˈstɪŋkt ˈleɪ.ɚz/
- *data ingestion, model weights, runtime inference, and tool execution:* /ˈdeɪ.t̬ə ɪnˈdʒes.tʃən ˈmɑː.dəl weɪts ˈrʌn.taɪm ˈɪn.fɚ.əns ænd tuːl ˌek.səˈkjuː.ʃən/
- *training data poisoning:* /ˈtreɪ.nɪŋ ˈdeɪ.t̬ə ˈpɔɪ.zən.ɪŋ/
- *prompt injection:* /prɑːmpt ɪnˈdʒek.ʃən/
- *minimize the blast radius:* /ˈmɪn.ə.maɪz ðə blæst ˈreɪ.di.əs/

---

## 🧠 Key Grammar Points

### 1. Participle Clauses for Conciseness in Architecture Explanations
- **Formula:** `[V-ing / Having + V3], [Main Clause]`
- **Example:** *"Applying the STRIDE framework specifically tailored for AI, we identify attack paths before deploying to production."*
- **Usage:** Giúp diễn đạt 2 hành động có quan hệ nguyên nhân/kết quả hoặc phương pháp một cách chuyên nghiệp, thay vì lặp lại các liên từ đơn giản như *Because we apply...*.

### 2. Causative & Preventative Structures
- **Formula:** `ensure (that) + S + V(present) / minimize + Object`
- **Example:** *"This ensures we minimize the blast radius if any single control fails."*
- **Technical Note:** Luôn dùng hiện tại đơn sau *ensure that* trong các tài liệu thiết kế kỹ thuật.

---

## 📖 Key Vocabulary & Pronunciation

| Term | IPA | Meaning | Context & Audio |
|---|---|---|---|
| **threat modeling** | /θret ˈmɑː.dəl.ɪŋ/ | Lập mô hình đe dọa | *Identifying system vulnerabilities systematically before deployment.* |
| **attack surface** | /əˈtæk ˈsɝː.fɪs/ | Bề mặt tấn công | *The total sum of points where an adversary can enter or extract data.* |
| **blast radius** | /blæst ˈreɪ.di.əs/ | Phạm vi ảnh hưởng sự cố | *The maximum extent of damage if a security breach occurs.* |
| **defense-in-depth** | /dɪˈfens ɪn depθ/ | Phòng thủ chiều sâu | *Redundant layers of defense across all architectural tiers.* |
| **denial-of-wallet** | /dɪˈnaɪ.əl əv ˈwɑː.lɪt/ | Tấn công cạn kiệt chi phí | *Flooding an LLM API to cause catastrophic financial charges.* |

---

## 💬 Key Sentence Patterns

1. **Describing Multi-Layered Architecture:**
   - *"When threat modeling [System Name], I analyze [Number] distinct layers: [Layer 1], [Layer 2], and [Layer 3]."*
   - *Example:* *"When threat modeling our agent service, I analyze three distinct layers: prompt intake, tool routing, and backend execution."*
2. **Explaining Risk Mitigation:**
   - *"By implementing [Security Control], we ensure that [Negative Outcome] is strictly contained."*
   - *Example:* *"By implementing strict token limits and sandboxed containers, we ensure that runaway costs and malicious exploits are strictly contained."*

---

## 📝 Lesson Exam & Mastery Assessment

### Knowledge & Grammar Quiz
1. **Which of the following is considered a runtime inference vulnerability in LLM applications?**
   - (A) Data poisoning in raw crawl archives
   - (B) Prompt injection and denial-of-wallet attacks
   - (C) Hardware supply chain tampering
   - *(Correct Answer: B)*
2. **What does the term "blast radius" refer to in secure system design?**
   - (A) The physical radius of an on-premise server room
   - (B) The maximum extent of damage if a component is compromised
   - (C) The network latency between microservices
   - *(Correct Answer: B)*
3. **Fill in the blank:** *"Applying defense-in-depth across each layer _______ that single points of failure are eliminated."*
   - (A) ensuring
   - (B) ensures
   - (C) to ensure
   - *(Correct Answer: B)*

### Speaking & Shadowing Requirement
- Record shadowing the passage aloud.
- Minimum Passing Score: **>= 70%** pronunciation accuracy.

---

## 📚 References & Deep-Dive Resources

- 🔗 **OWASP Top 10 for LLMs:** [https://owasp.org/www-project-top-10-for-large-language-model-applications/](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- 🔗 **NIST AI Risk Management Framework (AI RMF 1.0):** [https://www.nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework)
- 🔗 **Microsoft AI Threat Modeling Guide:** [https://learn.microsoft.com/en-us/security/engineering/threat-modeling-aiml](https://learn.microsoft.com/en-us/security/engineering/threat-modeling-aiml)
