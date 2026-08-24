---
title: "Day 216 — OWASP Top 10 for Large Language Models"
description: "Master the international standard for LLM application security: LLM01 Prompt Injection to LLM10 Model Theft."
date: 2026-08-27
---

## Session goal

Deliver an authoritative walkthrough of the OWASP Top 10 for LLM Applications, mapping security vulnerabilities directly to architectural patterns and remediation controls.

{% vi %}
**Mục tiêu buổi học:** Trình bày một cách bài bản và chuyên nghiệp về tiêu chuẩn quốc tế OWASP Top 10 for LLM Applications, liên kết trực tiếp các lỗ hổng bảo mật với các mẫu kiến trúc và biện pháp khắc phục.
{% endvi %}

## Shadowing passage

> The OWASP Top 10 for Large Language Model Applications serves as the benchmark industry standard for securing generative AI architectures. Beyond LLM01 Prompt Injection, several critical vulnerabilities demand rigorous controls. LLM02, Sensitive Information Disclosure, happens when proprietary data or PII in system prompts or training weights is inadvertently leaked to unauthorized users. LLM03, Supply Chain Vulnerabilities, addresses compromised pre-trained weights or malicious third-party plugins hosted on public repositories. LLM06, Excessive Agency, occurs when an autonomous model is granted unbounded privileges, uncontrolled tool access, or high-impact actions without human-in-the-loop verification. Finally, LLM07, System Prompt Leakage, exposes competitive intellectual property and internal business rules. As a principal backend engineer, I systematically evaluate our AI architecture against all ten OWASP categories, ensuring automated CI/CD security scanning, fine-grained RBAC on tools, and strict output sanitization gates.

{% vi %}
OWASP Top 10 for Large Language Model Applications đóng vai trò là tiêu chuẩn chuẩn mực của ngành trong việc bảo mật kiến trúc GenAI. Ngoài LLM01 Prompt Injection, một số lỗ hổng quan trọng khác đòi hỏi các chốt kiểm soát chặt chẽ. LLM02, Tiết lộ thông tin nhạy cảm (Sensitive Information Disclosure), xảy ra khi dữ liệu độc quyền hoặc PII trong system prompt hoặc trọng số huấn luyện vô tình bị rò rỉ cho người dùng không được ủy quyền. LLM03, Lỗ hổng chuỗi cung ứng (Supply Chain Vulnerabilities), giải quyết vấn đề trọng số mô hình pre-trained bị can thiệp hoặc plugin của bên thứ ba độc hại được lưu trữ trên các kho lưu trữ công cộng. LLM06, Quyền hạn quá mức (Excessive Agency), xảy ra khi một mô hình tự trị được cấp đặc quyền vô hạn, quyền truy cập công cụ không kiểm soát hoặc thực hiện các hành động có tác động lớn mà không có con người giám sát (human-in-the-loop). Cuối cùng, LLM07, Rò rỉ System Prompt, làm lộ tài sản trí tuệ và các quy tắc nghiệp vụ nội bộ. Là một kỹ sư backend cốt cán, tôi đánh giá có hệ thống kiến trúc AI của chúng tôi dựa trên cả mười danh mục của OWASP, đảm bảo quét bảo mật CI/CD tự động, phân quyền RBAC chi tiết cho các công cụ và các cổng làm sạch output nghiêm ngặt.
{% endvi %}

---

## 🔤 International Phonetic Alphabet (IPA)

- *OWASP Top 10 for Large Language Model Applications:* /ˈoʊ.wæsp tɑːp ten fɔːr lɑːrdʒ ˈlæŋ.ɡwɪdʒ ˈmɑː.dəl ˌæp.ləˈkeɪ.ʃənz/
- *benchmark industry standard for securing generative AI:* /ˈbentʃ.mɑːrk ˈɪn.də.stri ˈstæn.dɚd fɔːr sɪˈkjʊr.ɪŋ ˈdʒen.ɚ.ə.t̬ɪv eɪ-aɪ/
- *Sensitive Information Disclosure happens when PII is leaked:* /ˈsen.sə.t̬ɪv ˌɪn.fɚˈmeɪ.ʃən dɪsˈkloʊ.ʒɚ ˈhæp.ənz wen piː-aɪ-aɪ ɪz liːkt/
- *Excessive Agency occurs when a model is granted unbounded privileges:* ɪkˈses.ɪv ˈeɪ.dʒən.si əˈkɝːz wen ə ˈmɑː.dəl ɪz ˈɡræn.t̬ɪd ʌnˈbaʊn.dɪd ˈprɪv.əl.ɪ.dʒɪz/
- *human-in-the-loop verification:* ˈhjuː.mən ɪn ðə luːp ˌver.ə.fəˈkeɪ.ʃən/

---

## 🧠 Key Grammar Points

### 1. Defining Relative Clauses with *Where / In Which* for Risk Scenarios
- **Formula:** `Vulnerability Name + refers to a scenario in which / where + S + V`
- **Example:** *"Excessive Agency refers to a vulnerability where an autonomous agent is granted unrestricted shell execution without authorization boundaries."*
- **Usage:** Mẫu câu vàng khi được hỏi: *"Can you explain what OWASP LLM06 is?"* trong các buổi phỏng vấn.

### 2. Adverbial Phrases of Degree (*Systematically, Rigorously, Inadvertently*)
- **Usage:** Nâng cấp từ vựng từ mức trung bình lên mức kỹ sư cấp cao: dùng *inadvertently leaked* thay vì *accidentally leaked*, *rigorously evaluated* thay vì *checked carefully*.

---

## 📖 Key Vocabulary & Pronunciation

| Term | IPA | Meaning | Context & Audio |
|---|---|---|---|
| **Excessive Agency** | /ɪkˈses.ɪv ˈeɪ.dʒən.si/ | Quyền hạn quá mức | *Granting an LLM autonomous permissions exceeding what is strictly necessary.* |
| **human-in-the-loop** | /ˌhjuː.mən ɪn ðə ˈluːp/ | Giám sát bởi con người | *Requiring human confirmation before executing irreversible or sensitive operations.* |
| **system prompt leakage** | /ˈsɪs.təm prɑːmpt ˈliː.kɪdʒ/ | Rò rỉ prompt hệ thống | *Extracting proprietary instructions and business secrets from the model's context.* |
| **fine-grained RBAC** | /faɪn ɡreɪnd ɑːr-biː-eɪ-siː/ | Phân quyền vai trò chi tiết | *Restricting tool capabilities based on least privilege and user identity.* |
| **output sanitization** | /ˈaʊt.pʊt ˌsæn.ə.t̬əˈzeɪ.ʃən/ | Làm sạch dữ liệu đầu ra | *Scanning LLM responses for XSS payloads, secrets, and harmful tokens.* |

---

## 💬 Key Sentence Patterns

1. **Mapping Vulnerabilities to Architectural Mitigations:**
   - *"To mitigate [OWASP Category], our architectural standard enforces [Remediation Pattern]."*
   - *Example:** *"To mitigate Excessive Agency (LLM06), our architectural standard enforces human-in-the-loop approval on all state-mutating database operations."*
2. **Conducting Audits:**
   - *"We audit our AI pipelines against [Framework], focusing particularly on [Priority Areas]."*
   - *Example:** *"We audit our AI pipelines against OWASP LLM Top 10, focusing particularly on prompt injection, tool sandboxing, and data provenance."*

---

## 📝 Lesson Exam & Mastery Assessment

### Knowledge Quiz
1. **What is OWASP LLM06 (Excessive Agency)?**
   - (A) The model responding too quickly
   - (B) Granting an autonomous model excessive permissions, functionality, or autonomy without adequate safeguards
   - (C) The cost of training the model
   - *(Correct Answer: B)*
2. **Which architectural control best mitigates Sensitive Information Disclosure (LLM02)?**
   - (A) Masking PII before embedding ingestion and applying strict egress sanitization filters
   - (B) Making all database tables publicly readable
   - (C) Increasing the LLM temperature parameter
   - *(Correct Answer: A)*
3. **Fill in the blank:** *"Autonomous agents must not execute destructive actions _______ obtaining explicit human approval."*
   - (A) without
   - (B) during
   - (C) whenever
   - *(Correct Answer: A)*

### Speaking & Shadowing Requirement
- Record shadowing the passage aloud (Target: >= 70% accuracy).

---

## 📚 References & Deep-Dive Resources

- 🔗 **Official OWASP Top 10 for LLM Applications (2025/2026 Edition):** [https://genai.owasp.org/llm-top-10/](https://genai.owasp.org/llm-top-10/)
- 🔗 **OWASP LLM Checklist & Governance Framework:** [https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-v1-2/](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-v1-2/)
- 🔗 **Cloud Security Alliance (CSA) AI Security Guidance:** [https://cloudsecurityalliance.org/research/topics/artificial-intelligence/](https://cloudsecurityalliance.org/research/topics/artificial-intelligence/)
