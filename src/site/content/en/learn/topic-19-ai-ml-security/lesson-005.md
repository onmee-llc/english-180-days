---
title: "Day 215 — Adversarial Evasion & Input Perturbations"
description: "Explain adversarial examples, gradient-based evasion attacks, and robust certification techniques."
date: 2026-08-26
---

## Session goal

Explain how adversarial perturbations fool vision and NLP models at inference time, and describe how to increase model robustness via adversarial training and input pre-processing.

{% vi %}
**Mục tiêu buổi học:** Giải thích cách các biến đổi đối kháng (adversarial perturbations) đánh lừa các mô hình thị giác và xử lý ngôn ngữ tự nhiên tại thời điểm suy luận, đồng thời mô tả cách tăng cường độ bền vững của mô hình thông qua huấn luyện đối kháng (adversarial training) và tiền xử lý dữ liệu đầu vào.
{% endvi %}

## Shadowing passage

> Adversarial evasion attacks exploit the non-linear decision boundaries of deep neural networks without altering the underlying model parameters. By computing the loss gradient with respect to the input features, an attacker can apply imperceptible perturbations using methods like the Fast Gradient Sign Method or Projected Gradient Descent. In computer vision, adding microscopic noise to an image can cause a self-driving model to misclassify a stop sign as a speed limit. In natural language processing, adversarial token substitutions or homoglyph characters bypass content moderation filters while remaining easily readable by humans. To defend our models against evasion attacks, we incorporate adversarial training — exposing the network to dynamically generated adversarial examples during the training loop — and apply randomized input smoothing and certified robust bounds to verify safety guarantees.

{% vi %}
Các cuộc tấn công né tránh đối kháng (adversarial evasion) khai thác ranh giới quyết định phi tuyến tính của mạng nơ-ron sâu mà không cần can thiệp vào các tham số mô hình nền tảng. Bằng cách tính toán gradient của hàm mất mát đối với các đặc trưng đầu vào, kẻ tấn công có thể áp dụng các biến đổi cực nhỏ không thể nhận biết bằng mắt thường bằng các phương pháp như FGSM (Fast Gradient Sign Method) hoặc PGD (Projected Gradient Descent). Trong thị giác máy tính, việc thêm nhiễu siêu nhỏ vào ảnh có thể khiến mô hình xe tự lái nhận diện nhầm biển báo dừng thành biển giới hạn tốc độ. Trong xử lý ngôn ngữ tự nhiên, việc thay thế token đối kháng hoặc ký tự đồng hình (homoglyph) có thể vượt qua các bộ lọc kiểm duyệt nội dung trong khi con người vẫn đọc hiểu dễ dàng. Để bảo vệ mô hình chống lại các cuộc tấn công né tránh, chúng tôi tích hợp huấn luyện đối kháng (adversarial training) — đưa mạng nơ-ron tiếp xúc với các mẫu đối kháng được sinh động trong vòng lặp huấn luyện — đồng thời áp dụng kỹ thuật làm mượt đầu vào ngẫu nhiên và các ranh giới chứng thực độ bền vững để đảm bảo an toàn.
{% endvi %}

---

## 🔤 International Phonetic Alphabet (IPA)

- *Adversarial evasion attacks exploit non-linear decision boundaries:* /ˌæd.vɚˈser.i.əl ɪˈveɪ.ʒən əˈtæks ɪkˈsplɔɪt nɑːn-ˈlɪn.i.ɚ dɪˈsɪʒ.ən ˈbaʊn.dər.iz/
- *Fast Gradient Sign Method or Projected Gradient Descent:* /fæst ˈɡreɪ.di.ənt saɪn ˈmeθ.əd ɔːr prəˈdʒek.tɪd ˈɡreɪ.di.ənt dɪˈsent/
- *imperceptible perturbations to input features:* /ˌɪm.pɚˈsep.tə.bəl ˌpɝː.tɚˈbeɪ.ʃənz tuː ˈɪn.pʊt ˈfiː.tʃɚz/
- *homoglyph characters bypass content moderation filters:* /ˈhɑː.mə.ɡlɪf ˈkær.ək.tɚz ˈbaɪ.pæs ˈkɑːn.tent ˌmɑː.dəˈreɪ.ʃən ˈfɪl.tɚz/
- *adversarial training exposes the network to dynamic examples:* /ˌæd.vɚˈser.i.əl ˈtreɪ.nɪŋ ɪkˈspoʊ.zɪz ðə ˈnet.wɝːk tuː daɪˈnæm.ɪk ɪɡˈzæm.pəlz/

---

## 🧠 Key Grammar Points

### 1. Prepositional Gerund Phrases for Instrumentality (*By + V-ing*)
- **Formula:** `By + V-ing [Action/Method], [Subject] + can / will + [Outcome]`
- **Example:** *"By computing the gradient of the loss function, attackers craft minimal perturbations that shift the classification vector."*
- **Usage:** Đây là cấu trúc chuẩn để giải thích nguyên lý toán học và cơ chế thuật toán trong kỹ thuật.

### 2. Concession Clauses (*While / Although*)
- **Formula:** `[Clause A], while [Present Participle / Clause B]`
- **Example:** *"Homoglyph attacks bypass automated moderation while remaining human-readable."*

---

## 📖 Key Vocabulary & Pronunciation

| Term | IPA | Meaning | Context & Audio |
|---|---|---|---|
| **evasion attack** | /ɪˈveɪ.ʒən əˈtæks/ | Tấn công né tránh | *Manipulating inputs at test time to deceive a trained model.* |
| **perturbation** | /ˌpɝː.tɚˈbeɪ.ʃən/ | Sự gây nhiễu / Biến đổi nhỏ | *Tiny, targeted mathematical noise added to input data.* |
| **adversarial training** | /ˌæd.vɚˈser.i.əl ˈtreɪ.nɪŋ/ | Huấn luyện đối kháng | *Including adversarial examples in training data to harden the model.* |
| **homoglyph attack** | /ˈhɑː.mə.ɡlɪf əˈtæk/ | Tấn công ký tự đồng dạng | *Using identical-looking Unicode characters from different scripts (e.g. Cyrillic 'а' vs Latin 'a').* |
| **robustness bound** | /roʊˈbʌst.nəs baʊnd/ | Ngưỡng bền vững chứng thực | *Mathematical certification that no perturbation below epsilon can alter prediction.* |

---

## 💬 Key Sentence Patterns

1. **Explaining Adversarial Robustness:**
   - *"The trade-off of [Defense Technique] is a slight reduction in [Standard Metric], but a dramatic increase in [Security Metric]."*
   - *Example:** *"The trade-off of adversarial training is a slight drop in clean test accuracy, but a dramatic increase in adversarial robustness under perturbation."*
2. **Defending Vision & Text Pipelines:**
   - *"We deploy [Normalization Layer] ahead of the model to strip out [Adversarial Artifacts]."*
   - *Example:** *"We deploy Unicode normalization and token canonicalization to strip out homoglyph payloads before text reaches the embedding layer."*

---

## 📝 Lesson Exam & Mastery Assessment

### Knowledge Quiz
1. **What is an adversarial perturbation in machine learning?**
   - (A) Deleting a table from a database
   - (B) A subtle, engineered noise added to inputs that causes the model to make incorrect predictions
   - (C) Increasing the learning rate during training
   - *(Correct Answer: B)*
2. **How does adversarial training harden a deep learning model?**
   - (A) By encrypting the server hard drive
   - (B) By generating adversarial examples during training and teaching the network to classify them correctly
   - (C) By reducing the number of training epochs
   - *(Correct Answer: B)*
3. **Fill in the blank:** *"Adversaries craft homoglyph substitutions to bypass keyword filters _______ misleading human moderators."*
   - (A) without
   - (B) because
   - (C) unless
   - *(Correct Answer: A)*

### Speaking & Shadowing Requirement
- Record shadowing the passage aloud (Target: >= 70% accuracy).

---

## 📚 References & Deep-Dive Resources

- 🔗 **Explaining and Harnessing Adversarial Examples (Goodfellow et al.):** [https://arxiv.org/abs/1412.6572](https://arxiv.org/abs/1412.6572)
- 🔗 **Adversarial Robustness Toolbox (IBM ART):** [https://github.com/Trusted-AI/adversarial-robustness-toolbox](https://github.com/Trusted-AI/adversarial-robustness-toolbox)
- 🔗 **CleverHans Adversarial Benchmark Library:** [https://github.com/cleverhans-lab/cleverhans](https://github.com/cleverhans-lab/cleverhans)
