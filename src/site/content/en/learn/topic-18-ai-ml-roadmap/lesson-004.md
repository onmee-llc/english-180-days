---
title: "Phase 4 — Deep Learning Foundations"
description: "Understand neural networks and train one yourself in PyTorch."
date: 2026-06-22
---

## Goal

Build, train, and debug a small neural network and understand each moving part.

{% vi %}
**Mục tiêu:** Xây, huấn luyện và gỡ lỗi một mạng nơ-ron nhỏ và hiểu từng bộ phận.
{% endvi %}

## What to learn

- **Neurons, layers, activations** (ReLU, sigmoid, softmax).
- **Forward pass, loss functions, backpropagation, optimizers** (SGD, Adam).
- **Training loop**: epochs, batches, learning rate.
- Overfitting controls: dropout, regularization, early stopping.
- **PyTorch** basics: tensors, `nn.Module`, autograd.

{% vi %}
**Học gì:**
- **Nơ-ron, lớp, hàm kích hoạt** (ReLU, sigmoid, softmax).
- **Lan truyền xuôi, hàm mất mát, lan truyền ngược, optimizer** (SGD, Adam).
- **Vòng huấn luyện**: epoch, batch, learning rate.
- Kiểm soát overfitting: dropout, regularization, early stopping.
- Cơ bản **PyTorch**: tensor, `nn.Module`, autograd.
{% endvi %}

## Resources

- **FREE** — fast.ai "Practical Deep Learning for Coders": <https://course.fast.ai>
- **FREE** — PyTorch official "Learn the Basics" tutorial.
- **FREE** — 3Blue1Brown "Neural Networks" series (YouTube).

{% vi %}
**Tài nguyên:**
- **FREE** — fast.ai "Practical Deep Learning for Coders".
- **FREE** — Hướng dẫn chính thức "Learn the Basics" của PyTorch.
- **FREE** — Loạt video "Neural Networks" của 3Blue1Brown (YouTube).
{% endvi %}

## Build

Train a neural network on MNIST (handwritten digits) in Colab. Reach >97% test accuracy and plot the training curve.

{% vi %}
**Thực hành:** Huấn luyện một mạng nơ-ron trên MNIST (chữ số viết tay) trong Colab. Đạt >97% accuracy trên tập test và vẽ đường cong huấn luyện.
{% endvi %}

## Reflection

What happened to your loss curve when you changed the learning rate? Why?

{% vi %}
**Tự ngẫm:** Đường cong loss thay đổi ra sao khi bạn đổi learning rate? Vì sao?
{% endvi %}
