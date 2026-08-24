---
title: "Day 212 — Direct & Indirect Prompt Injection"
description: "Differentiate between direct jailbreaks and indirect prompt injection via untrusted external context."
date: 2026-08-23
---

## Session goal

Differentiate clearly between direct jailbreaks and indirect prompt injection attacks, and present concrete mitigation strategies to engineering teams.

{% vi %}
**Mục tiêu buổi học:** Phân biệt rõ ràng giữa tấn công jailbreak trực tiếp và tấn công chèn prompt gián tiếp (indirect prompt injection) qua dữ liệu bên ngoài, đồng thời trình bày các chiến lược giảm thiểu rủi ro cho đội ngũ kỹ sư.
{% endvi %}

## Shadowing passage

> Prompt injection occurs when untrusted user input alters the intended execution flow of an LLM. We divide this into two categories: direct and indirect. Direct prompt injection, commonly known as jailbreaking, happens when a malicious user crafts an adversarial input to bypass system guardrails directly in the chat interface. Indirect prompt injection is far more dangerous: it happens when the LLM consumes third-party content — such as a webpage, email, or database record — that contains embedded instructions designed to hijack the model's behavior silently. Because LLMs process instructions and data within the same token stream, traditional regex filters cannot reliably stop these attacks. To mitigate this risk, we implement dual-LLM architecture, strict delimiter isolation, and secondary validation layers before executing any sensitive tool calls or persisting generated outputs.

{% vi %}
Tấn công chèn prompt (prompt injection) xảy ra khi dữ liệu đầu vào không đáng tin cậy của người dùng làm thay đổi luồng thực thi dự kiến của LLM. Chúng ta chia rủi ro này thành hai loại: trực tiếp và gián tiếp. Prompt injection trực tiếp, thường được gọi là jailbreak, xảy ra khi kẻ tấn công tạo input đối kháng nhằm vượt qua các rào chắn an toàn trực tiếp trên giao diện chat. Prompt injection gián tiếp nguy hiểm hơn nhiều: nó xảy ra khi LLM xử lý nội dung từ bên thứ ba — như trang web, email hoặc bản ghi cơ sở dữ liệu — có chứa các chỉ dẫn ngầm được cài cắm nhằm chiếm đoạt hành vi của mô hình một cách âm thầm. Do LLM xử lý cả chỉ dẫn và dữ liệu trong cùng một luồng token, các bộ lọc regex truyền thống không thể ngăn chặn triệt để. Để giảm thiểu rủi ro này, chúng tôi triển khai kiến trúc dual-LLM, cô lập bằng dấu phân cách nghiêm ngặt (delimiter isolation), và các lớp kiểm thực thứ cấp trước khi thực thi bất kỳ lệnh gọi công cụ nhạy cảm nào hoặc lưu trữ kết quả.
{% endvi %}

---

## 🔤 International Phonetic Alphabet (IPA)

- *Prompt injection occurs when untrusted user input alters the intended execution flow:* /prɑːmpt ɪnˈdʒek.ʃən əˈkɝːz wen ʌnˈtrʌs.tɪd ˈjuː.zɚ ˈɪn.pʊt ˈɑːl.tɚz ðə ɪnˈten.dɪd ˌek.səˈkjuː.ʃən floʊ/
- *jailbreaking happens when a malicious user crafts an adversarial input:* /ˈdʒeɪl.breɪk.ɪŋ ˈhæp.ənz wen ə məˈlɪʃ.əs ˈjuː.zɚ kræfts ən ˌæd.vɚˈser.i.əl ˈɪn.pʊt/
- *indirect prompt injection is far more dangerous:* /ˌɪn.daɪˈrekt prɑːmpt ɪnˈdʒek.ʃən ɪz fɑːr mɔːr ˈdeɪn.dʒɚ.əs/
- *traditional regex filters cannot reliably stop these attacks:* /trəˈdɪʃ.ən.əl ˈredʒ.eks ˈfɪl.tɚz ˈkæn.ɑːt rɪˈlaɪ.ə.bli stɑːp ðiːz əˈtæks/
- *strict delimiter isolation and secondary validation layers:* /strɪkt dɪˈlɪm.ə.t̬ɚ ˌaɪ.səˈleɪ.ʃən ænd ˈsek.ən.der.i ˌvæl.əˈdeɪ.ʃən ˈleɪ.ɚz/

---

## 🧠 Key Grammar Points

### 1. Contrasting Clauses with *While* and *Whereas*
- **Formula:** `[Clause A], whereas / while [Clause B]`
- **Example:** *"Direct injection targets the prompt directly, whereas indirect injection hides payloads inside external data sources."*
- **Usage:** Dùng để so sánh 2 khái niệm đối lập trong phỏng vấn kỹ thuật để thể hiện tư duy phân tích sắc bén.

### 2. Causal Prepositional Phrases (*Due to / Because*)
- **Formula:** `Because + Clause` vs `Due to / Owing to + Noun Phrase`
- **Example:** *"Because LLMs process data and instructions in a single stream, token-level separation requires architectural controls."*

---

## 📖 Key Vocabulary & Pronunciation

| Term | IPA | Meaning | Context & Audio |
|---|---|---|---|
| **indirect prompt injection** | /ˌɪn.daɪˈrekt prɑːmpt ɪnˈdʒek.ʃən/ | Chèn prompt gián tiếp | *Exploiting LLMs through poisoned external web or document data.* |
| **jailbreak** | /ˈdʒeɪl.breɪk/ | Vượt rào bảo mật | *Tricking the model into ignoring safety alignment policies.* |
| **delimiter** | /dɪˈlɪm.ə.t̬ɚ/ | Ký tự phân cách | *Special tokens (e.g. XML tags, quotes) used to separate data from instructions.* |
| **token stream** | /ˈtoʊ.kən striːm/ | Luồng token | *The unified sequence of tokens processed by the transformer.* |
| **dual-LLM pattern** | /ˈduː.əl el-el-em ˈpæt̬.ɚn/ | Mẫu kiến trúc 2 LLM | *Using an isolated untrusted LLM paired with a privileged controller LLM.* |

---

## 💬 Key Sentence Patterns

1. **Highlighting Architectural Vulnerabilities:**
   - *"The fundamental vulnerability stems from the fact that LLMs [Vulnerability Description]."*
   - *Example:* *"The fundamental vulnerability stems from the fact that LLMs cannot inherently distinguish between developer instructions and user data."*
2. **Presenting Defensive Recommendations:**
   - *"To prevent [Threat], we enforce [Control 1], coupled with [Control 2]."*
   - *Example:* *"To prevent indirect injection, we enforce strict XML delimiters, coupled with secondary LLM policy evaluators."*

---

## 📝 Lesson Exam & Mastery Assessment

### Knowledge Quiz
1. **Why are traditional regex filters ineffective against prompt injection?**
   - (A) Regex is too slow for real-time systems
   - (B) Natural language is semantically unbounded, allowing infinite syntactic variations
   - (C) Regex only works on numbers
   - *(Correct Answer: B)*
2. **What is an indirect prompt injection attack?**
   - (A) Attacking the hardware GPU directly
   - (B) Embedding malicious instructions in external content (e.g., email, webpage) read by the LLM
   - (C) Sending HTTP POST requests without headers
   - *(Correct Answer: B)*
3. **Fill in the blank:** *"Indirect injection is particularly dangerous _______ it executes silently without user awareness."*
   - (A) because
   - (B) despite
   - (C) whereas
   - *(Correct Answer: A)*

### Speaking & Shadowing Requirement
- Record shadowing the passage aloud (Target: >= 70% accuracy).

---

## 📚 References & Deep-Dive Resources

- 🔗 **Simon Willison's Prompt Injection Taxonomy:** [https://simonwillison.net/series/prompt-injection/](https://simonwillison.net/series/prompt-injection/)
- 🔗 **OWASP LLM01: Prompt Injection:** [https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-2025.pdf](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- 🔗 **NCC Group Prompt Injection Research:** [https://research.nccgroup.com/category/ai-ml/](https://research.nccgroup.com/category/ai-ml/)
