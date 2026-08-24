---
title: "Day 219 — LLM Red Teaming & Automated Fuzzing"
description: "Master automated fuzzing frameworks (Garak, PyRIT) and manual red teaming methodologies for AI robustness."
date: 2026-08-30
---

## Session goal

Explain how to establish an automated LLM Red Teaming program using open-source fuzzing frameworks, benchmark harnesses, and continuous vulnerability regression testing.

{% vi %}
**Mục tiêu buổi học:** Giải thích cách thiết lập chương trình LLM Red Teaming tự động bằng các framework fuzzing mã nguồn mở, các bộ đánh giá benchmark, và quy trình kiểm thử hồi quy lỗ hổng bảo mật liên tục trong CI/CD.
{% endvi %}

## Shadowing passage

> AI Red Teaming is the proactive practice of rigorously probing machine learning models for vulnerabilities, jailbreaks, and unsafe failure modes before malicious actors can exploit them. Rather than relying solely on manual exploratory testing, an enterprise-grade red teaming strategy combines manual expert evaluations with continuous automated fuzzing. We utilize open-source frameworks like Garak and Microsoft's PyRIT to run thousands of mutated adversarial probes against our staging endpoints — testing for prompt leakage, role-play jailbreaks, refusal suppression, and hallucinated security advice. Each discovered exploit is automatically converted into a permanent regression test in our CI/CD pipeline. By tracking the Attack Success Rate across model versions and system prompt iterations, we quantify security posture improvements and ensure that new deployments never reintroduce previously patched vulnerabilities.

{% vi %}
AI Red Teaming là hoạt động chủ động dò quét nghiêm ngặt các mô hình học máy để tìm kiếm lỗ hổng, jailbreak và các trạng thái lỗi không an toàn trước khi kẻ xấu có thể khai thác. Thay vì chỉ dựa vào kiểm thử khám phá thủ công, chiến lược red teaming chuẩn doanh nghiệp kết hợp đánh giá chuyên gia với fuzzing tự động liên tục. Chúng tôi sử dụng các framework mã nguồn mở như Garak và PyRIT của Microsoft để thực hiện hàng ngàn thử nghiệm đối kháng đột biến nhằm vào các endpoint staging — kiểm tra rò rỉ prompt, jailbreak qua nhập vai (role-play), triệt tiêu từ chối (refusal suppression) và lời khuyên bảo mật bịa đặt. Mỗi lỗ hổng được phát hiện sẽ tự động được chuyển đổi thành một bài kiểm tra hồi quy vĩnh viễn trong pipeline CI/CD. Bằng cách theo dõi Tỷ lệ Tấn công Thành công (Attack Success Rate - ASR) qua các phiên bản mô hình và các lần cập nhật system prompt, chúng tôi định lượng được sự cải thiện về tư thế bảo mật và đảm bảo các đợt triển khai mới không bao giờ tái diễn các lỗ hổng đã được vá.
{% endvi %}

---

## 🔤 International Phonetic Alphabet (IPA)

- *AI Red Teaming is the proactive practice of probing machine learning models:* eɪ-aɪ red ˈtiː.mɪŋ ɪz ðə proʊˈæk.tɪv ˈpræk.tɪs əv ˈproʊb.ɪŋ məˈʃiːn ˈlɝː.nɪŋ ˈmɑː.dəlz/
- *jailbreaks, and unsafe failure modes:* /ˈdʒeɪl.breɪks ænd ʌnˈseɪf ˈfeɪl.jɚ moʊdz/
- *open-source frameworks like Garak and Microsoft's PyRIT:* ˈoʊ.pən sɔːrs ˈfreɪm.wɝːks laɪk ˈɡær.ək ænd ˈmaɪ.kroʊ.sɑːfts ˈpaɪ.rɪt/
- *prompt leakage, role-play jailbreaks, refusal suppression:* /prɑːmpt ˈliː.kɪdʒ ˈroʊl pleɪ ˈdʒeɪl.breɪks rɪˈfjuː.zəl səˈpreʃ.ən/
- *Attack Success Rate across model versions:* /əˈtæk səkˈses reɪt əˈkrɑːs ˈmɑː.dəl ˈvɝː.ʒənz/

---

## 🧠 Key Grammar Points

### 1. Prepositional Phrases of Means (*By + V-ing / Through + Noun*)
- **Formula:** `By tracking [Metric], we [Verb Phrase]`
- **Example:** *"By tracking Attack Success Rate across deployment cycles, we quantify the efficacy of our guardrails."*
- **Usage:** Rất phù hợp khi giải thích chỉ số đo lường (KPIs & Metrics) cho ban giám đốc và phỏng vấn kỹ thuật.

### 2. Relative Adverbs (*Where / Whereby / Rather than*)
- **Formula:** `Rather than + V-ing [Sub-optimal Approach], S + V [Best Practice]`
- **Example:** *"Rather than relying on ad-hoc prompts, we run structured automated attack suites."*

---

## 📖 Key Vocabulary & Pronunciation

| Term | IPA | Meaning | Context & Audio |
|---|---|---|---|
| **red teaming** | /red ˈtiː.mɪŋ/ | Đội đỏ kiểm thử | *Simulating adversary tactics to discover zero-day AI vulnerabilities.* |
| **fuzzing framework** | /ˈfʌz.ɪŋ ˈfreɪm.wɝːk/ | Khung kiểm thử tự động | *Automated tools generating mutated adversarial test cases (e.g. Garak).* |
| **Attack Success Rate (ASR)** | /əˈtæk səkˈses reɪt/ | Tỷ lệ tấn công thành công | *The percentage of adversarial prompts that successfully bypass guardrails.* |
| **refusal suppression** | /rɪˈfjuː.zəl səˈpreʃ.ən/ | Triệt tiêu từ chối | *Adversarial techniques that forbid the LLM from saying "I cannot fulfill this request".* |
| **regression test** | /rɪˈɡreʃ.ən test/ | Kiểm thử hồi quy | *Automated test ensuring a previously fixed bug never reoccurs.* |

---

## 💬 Key Sentence Patterns

1. **Describing Automated Security Pipelines:**
   - *"We integrate [Fuzzing Tool] into our CI/CD pipeline, automatically gating deployments if [Metric, e.g. ASR] exceeds [Threshold]."*
   - *Example:** *"We integrate Garak into our CI/CD pipeline, automatically blocking deployments if the Attack Success Rate exceeds zero percent on tier-1 safety probes."*
2. **Explaining Red Teaming Methodologies:**
   - *"Our red teaming methodology encompasses both [Approach A, e.g. automated combinatorial fuzzing] and [Approach B, e.g. manual expert adversarial probing]."*
   - *Example:** *"Our red teaming methodology encompasses both automated combinatorial fuzzing and manual expert adversarial probing."*

---

## 📝 Lesson Exam & Mastery Assessment

### Knowledge Quiz
1. **What does Attack Success Rate (ASR) measure in LLM red teaming?**
   - (A) How fast the model generates tokens
   - (B) The percentage of adversarial attempts that successfully trigger unsafe outputs or bypass safety policies
   - (C) The API server uptime
   - *(Correct Answer: B)*
2. **What is the primary benefit of converting red team exploits into CI/CD regression tests?**
   - (A) It reduces cloud hosting costs
   - (B) It guarantees that future prompt or model updates never reintroduce previously patched vulnerabilities
   - (C) It increases model context window size
   - *(Correct Answer: B)*
3. **Fill in the blank:** *"Automated fuzzers generate thousands of mutated prompts _______ manual testing would take months."*
   - (A) whereas
   - (B) because
   - (C) despite
   - *(Correct Answer: A)*

### Speaking & Shadowing Requirement
- Record shadowing the passage aloud (Target: >= 70% accuracy).

---

## 📚 References & Deep-Dive Resources

- 🔗 **Garak: An LLM Vulnerability Scanner:** [https://github.com/leondz/garak](https://github.com/leondz/garak)
- 🔗 **Microsoft PyRIT (Python Risk Identification Tool for GenAI):** [https://github.com/Azure/PyRIT](https://github.com/Azure/PyRIT)
- 🔗 **Frontier AI Red Teaming Protocols (Anthropic / OpenAI):** [https://www.anthropic.com/research/red-teaming-language-models](https://www.anthropic.com/research/red-teaming-language-models)
