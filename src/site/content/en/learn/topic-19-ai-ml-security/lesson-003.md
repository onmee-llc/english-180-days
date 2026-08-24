---
title: "Day 213 — Training Data Poisoning & Backdoors"
description: "Explain how adversaries manipulate training datasets to insert hidden triggers and backdoors into AI models."
date: 2026-08-24
---

## Session goal

Articulate the mechanics of training data poisoning attacks, clean-label backdoors, and how to implement cryptographic dataset provenance in production MLOps pipelines.

{% vi %}
**Mục tiêu buổi học:** Trình bày cơ chế của các cuộc tấn công đầu độc dữ liệu huấn luyện (data poisoning), backdoor nhãn sạch (clean-label backdoors), và cách xây dựng cơ chế xác thực nguồn gốc dữ liệu bằng mật mã học trong pipeline MLOps thực tế.
{% endvi %}

## Shadowing passage

> Training data poisoning represents an existential threat to model integrity because the corruption occurs before the model is ever trained or fine-tuned. In a clean-label poisoning attack, an adversary injects subtly perturbed samples into public web crawls or crowdsourced datasets. To a human reviewer, the image or document looks completely benign, but to the gradient descent algorithm, it introduces a hidden mathematical backdoor. When the compromised model encounters a specific trigger phrase or visual token in production, it reliably produces an attacker-chosen output — such as classifying malware as benign or granting unauthorized access. To secure our MLOps pipelines against data poisoning, we implement strict cryptographic provenance using signed SHA-256 hashes, enforce data anomaly detection on feature distributions, and conduct continuous holdout validation against certified gold-standard evaluation sets.

{% vi %}
Đầu độc dữ liệu huấn luyện đại diện cho một mối đe dọa sinh tử đối với tính toàn vẹn của mô hình vì sự cố làm hỏng xảy ra trước khi mô hình được huấn luyện hoặc tinh chỉnh (fine-tune). Trong một cuộc tấn công đầu độc nhãn sạch (clean-label poisoning), kẻ tấn công chèn các mẫu bị biến đổi tinh vi vào các nguồn dữ liệu thu thập trên web hoặc dữ liệu cộng đồng. Đối với người duyệt, hình ảnh hoặc tài liệu trông hoàn toàn bình thường, nhưng đối với thuật toán gradient descent, nó lại tạo ra một cửa sau (backdoor) toán học ẩn giấu. Khi mô hình bị xâm nhập gặp một cụm từ kích hoạt (trigger phrase) hoặc token hình ảnh cụ thể trên môi trường production, nó sẽ luôn đưa ra kết quả do kẻ tấn công chỉ định — chẳng hạn như phân loại mã độc thành an toàn hoặc cấp quyền truy cập trái phép. Để bảo vệ các pipeline MLOps chống lại đầu độc dữ liệu, chúng tôi triển khai xác thực nguồn gốc mật mã bằng chữ ký hash SHA-256, thực thi phát hiện bất thường trên phân phối đặc trưng (feature distributions), và liên tục kiểm thử trên các tập đánh giá chuẩn vàng được chứng thực.
{% endvi %}

---

## 🔤 International Phonetic Alphabet (IPA)

- *Training data poisoning represents an existential threat to model integrity:* /ˈtreɪ.nɪŋ ˈdeɪ.t̬ə ˈpɔɪ.zən.ɪŋ ˌrep.rɪˈzents ən ˌeɡ.zɪˈsten.ʃəl θret tuː ˈmɑː.dəl ɪnˈteɡ.rə.t̬i/
- *clean-label poisoning attack:* /kliːn ˈleɪ.bəl ˈpɔɪ.zən.ɪŋ əˈtæk/
- *subtly perturbed samples into public web crawls:* /ˈsʌt.li pɚˈtɝːbd ˈsæm.pəlz ˈɪn.tuː ˈpʌb.lɪk web krɑːlz/
- *gradient descent algorithm introduces a hidden mathematical backdoor:* /ˈɡreɪ.di.ənt dɪˈsent ˈæl.ɡə.rɪ.ðəm ˌɪn.trəˈduː.sɪz ə ˈhɪd.ən ˌmæθ.əˈmæt̬.ɪ.kəl ˈbæk.dɔːr/
- *cryptographic provenance using signed SHA-256 hashes:* /ˌkrɪp.təˈɡræf.ɪk ˈprɑː.və.nəns ˈjuː.zɪŋ saɪnd ˌes-eɪtʃ-eɪ tuː-faɪv-sɪks ˈhæʃ.ɪz/

---

## 🧠 Key Grammar Points

### 1. Relative Clauses with *Whereby / Wherein* in System Specifications
- **Formula:** `Noun (process/mechanism) + whereby / wherein + Clause`
- **Example:** *"Clean-label poisoning is a technique whereby attackers manipulate sample features without altering the target class label."*
- **Usage:** Tạo phong cách viết và nói mang tính kỹ thuật học thuật cao (RFC standard language).

### 2. Temporal Clauses (*Before / When / Once*) with Present Tenses
- **Formula:** `When + S + V(present), S + will / reliably + V(base)`
- **Example:** *"When the compromised model encounters the trigger token, it produces an attacker-controlled decision."*

---

## 📖 Key Vocabulary & Pronunciation

| Term | IPA | Meaning | Context & Audio |
|---|---|---|---|
| **data provenance** | /ˈdeɪ.t̬ə ˈprɑː.və.nəns/ | Nguồn gốc dữ liệu | *Verifying the cryptographic history and ownership of training datasets.* |
| **clean-label attack** | /kliːn ˈleɪ.bəl əˈtæk/ | Tấn công nhãn sạch | *Poisoning training samples without changing their ground-truth labels.* |
| **trigger phrase** | /ˈtrɪɡ.ɚ freɪz/ | Cụm từ kích hoạt | *The secret keyword that activates a hidden backdoor in the model.* |
| **gradient descent** | /ˈɡreɪ.di.ənt dɪˈsent/ | Thuật toán tối ưu gradient | *The optimization algorithm adjusting neural network parameters.* |
| **gold-standard set** | /ɡoʊld ˈstæn.dɚd set/ | Tập dữ liệu chuẩn vàng | *An immutable, cryptographically verified benchmark evaluation dataset.* |

---

## 💬 Key Sentence Patterns

1. **Explaining Supply Chain Security:**
   - *"To prevent [Risk] during data ingestion, we mandate [Cryptographic/Verification Step]."*
   - *Example:* *"To prevent data poisoning during ingestion, we mandate immutable ledger logging and hash-verification for all incoming datasets."*
2. **Describing Trigger Mechanisms:**
   - *"Under normal inputs, the model behaves as expected; however, upon receiving [Trigger], it [Malicious Action]."*
   - *Example:* *"Under normal inputs, the model performs normally; however, upon receiving the backdoor trigger, it bypasses authentication checks."*

---

## 📝 Lesson Exam & Mastery Assessment

### Knowledge Quiz
1. **What distinguishes a clean-label poisoning attack from a naive poisoning attack?**
   - (A) Clean-label attacks do not require changing the sample's label, making them harder to detect
   - (B) Clean-label attacks only work on CSV files
   - (C) Clean-label attacks speed up model training
   - *(Correct Answer: A)*
2. **Which method is most effective for ensuring training dataset provenance?**
   - (A) Renaming files randomly
   - (B) Cryptographic hashing and immutable provenance logging
   - (C) Converting datasets to plain text
   - *(Correct Answer: B)*
3. **Fill in the blank:** *"The backdoor remains dormant _______ the model processes the designated trigger token in production."*
   - (A) until
   - (B) although
   - (C) because
   - *(Correct Answer: A)*

### Speaking & Shadowing Requirement
- Record shadowing the passage aloud (Target: >= 70% accuracy).

---

## 📚 References & Deep-Dive Resources

- 🔗 **NIST Special Publication on Adversarial Machine Learning (SP 800-225):** [https://csrc.nist.gov/publications/detail/sp/800-225/final](https://csrc.nist.gov/publications/detail/sp/800-225/final)
- 🔗 **Poisoning Attacks on Machine Learning (Stanford Research):** [https://arxiv.org/abs/1804.00308](https://arxiv.org/abs/1804.00308)
- 🔗 **OWASP Machine Learning Security Top 10 — Data Poisoning:** [https://owasp.org/www-project-machine-learning-security-top-10/](https://owasp.org/www-project-machine-learning-security-top-10/)
