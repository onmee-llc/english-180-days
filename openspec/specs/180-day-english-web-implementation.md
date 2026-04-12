# Proposal: 180-Day English Program — Web Implementation

**Status:** Ready to implement ✅
**Date:** 2026-04-13
**Author:** Leo / Copilot
**Request:** `/opsx:propose`
**Source:** [180-day-english-program.md](../../guidelines/180-day-english-program.md)

---

## Summary

Chuyển toàn bộ nội dung chương trình 180-day English Speaking Program vào hệ thống web Eleventy hiện tại, deploy lên Firebase Hosting tại `onmee.vn`. Mỗi **Topic** trong chương trình trở thành một **Course** trong hệ thống. Tất cả nội dung web dev không liên quan sẽ được xoá để giữ codebase nhẹ và sạch.

---

## Problem

Nội dung học tiếng Anh hiện đang nằm trong file markdown tĩnh (`guidelines/`), không có giao diện để học hàng ngày. Hệ thống web hiện tại (`onmee.vn`) đang chứa nội dung web development (CSS, PWA, performance, v.v.) không liên quan đến mục tiêu cá nhân này.

---

## Goals

- Implement toàn bộ 11 topics thành 11 courses trong hệ thống `/learn/`.
- Homepage phản ánh mục đích học tiếng Anh.
- Xoá tất cả nội dung web dev không liên quan.
- Deploy được lên Firebase Hosting (static, không cần backend).
- Học được trên mọi thiết bị (mobile-friendly, dark mode support — đã có sẵn).

## Non-Goals

- Không implement tính năng recording/audio tự động.
- Không thêm user accounts hay progress tracking (phase 1).
- Không thêm authentication.
- Không thay đổi build pipeline (Gulp, Rollup, Sass) — giữ nguyên.

---

## Architecture Mapping

### Course System (giữ nguyên, tái sử dụng 100%)

| Architecture component | Vai trò trong program mới |
|---|---|
| `layout: course` | Layout cho tất cả trang trong mỗi topic |
| `src/site/_data/courses/[key]/meta.yml` | Metadata của mỗi topic (title, URL, logo, ...) |
| `src/site/_data/courses/[key]/toc.yml` | Thứ tự các module trong topic |
| `src/site/content/en/learn/[key]/[module].md` | Nội dung từng module |
| `layout: learn-page` | Trang `/learn/` liệt kê tất cả 11 topics |
| `layout: homepage` | Trang chủ cập nhật theo chương trình |
| Firebase Hosting (`dist/`) | Deploy static output |

---

## New Course Structure: 11 Topics

### Topics 1–10 (Technical Speaking Topics)

Mỗi topic gồm **5 modules** sau:

| Module file | Nội dung |
|---|---|
| `index.md` | Giới thiệu topic + lý do quan trọng + mục tiêu 2 tuần |
| `content-outline.md` | Nội dung cốt lõi cần nắm (concepts, frameworks, scripts) |
| `key-vocabulary.md` | Danh sách từ vựng + cụm phrase + ví dụ dùng |
| `practice-questions.md` | 5 câu hỏi luyện tập với gợi ý trả lời |
| `weekly-goals.md` | Mục tiêu cụ thể Week 1 + Week 2 |

**URL pattern:** `/learn/topic-[n]-[slug]/[module]/`

### Topic 11 (Daily English with Kids — Parallel Track)

Mỗi **Group** của phrase = 1 module:

| Module file | Nội dung |
|---|---|
| `index.md` | Giới thiệu track + learning pace |
| `morning-routine.md` | Group 1 — Morning Routine |
| `school.md` | Group 2 — School Drop-off & Pick-up |
| `mealtime.md` | Group 3 — Mealtime |
| `tidying-discipline.md` | Group 4 — Tidying Up & Gentle Discipline |
| `asking-help.md` | Group 5 — Asking for Help |
| `playtime.md` | Group 6 — Playtime |
| `bedtime.md` | Group 7 — Evening & Bedtime |
| `encouragement.md` | Group 8 — Encouragement & Praise |

**URL pattern:** `/learn/topic-11-daily-with-kids/[group-slug]/`

---

## Full URL Map

```
/                          → Homepage (program overview)
/learn/                    → Index — all 11 topics listed as cards

/learn/topic-1-introduce-yourself/
/learn/topic-1-introduce-yourself/content-outline/
/learn/topic-1-introduce-yourself/key-vocabulary/
/learn/topic-1-introduce-yourself/practice-questions/
/learn/topic-1-introduce-yourself/weekly-goals/

/learn/topic-2-system-design/
/learn/topic-2-system-design/content-outline/
/learn/topic-2-system-design/key-vocabulary/
/learn/topic-2-system-design/practice-questions/
/learn/topic-2-system-design/weekly-goals/

/learn/topic-3-api-microservices/            (Weeks 5–6)
/learn/topic-4-cloud-infrastructure/         (Weeks 7–8)
/learn/topic-5-ai-ml-pipelines/              (Weeks 9–10)
/learn/topic-6-automation-workflow/          (Weeks 11–12)
/learn/topic-7-project-storytelling/         (Weeks 13–14)
/learn/topic-8-technical-problem-solving/    (Weeks 15–16)
/learn/topic-9-team-communication/           (Weeks 17–18)
/learn/topic-10-salary-negotiation/          (Weeks 19–20)

/learn/topic-11-daily-with-kids/             (Parallel — all 180 days)
/learn/topic-11-daily-with-kids/morning-routine/
...
```

---

## Files to Create

```
src/site/content/en/learn/
  topic-1-introduce-yourself/
    topic-1.11tydata.js        ← course-11tydata('topic-1-introduce-yourself')
    index.md
    content-outline.md
    key-vocabulary.md
    practice-questions.md
    weekly-goals.md
  topic-2-system-design/       ← same structure
  topic-3-api-microservices/
  topic-4-cloud-infrastructure/
  topic-5-ai-ml-pipelines/
  topic-6-automation-workflow/
  topic-7-project-storytelling/
  topic-8-technical-problem-solving/
  topic-9-team-communication/
  topic-10-salary-negotiation/
  topic-11-daily-with-kids/
    topic-11.11tydata.js
    index.md
    morning-routine.md
    school.md
    mealtime.md
    tidying-discipline.md
    asking-help.md
    playtime.md
    bedtime.md
    encouragement.md

src/site/_data/courses/
  topic-1-introduce-yourself/
    meta.yml
    toc.yml
  topic-2-system-design/
  ... (11 total)

src/images/courses/
  topic-1/ logo.svg, background.svg, card.svg (placeholder SVGs)
  ... (11 total)
```

---

## Files to Update

| File | Change |
|---|---|
| `src/site/content/en/index.md` | New homepage content — program overview, link to `/learn/` |
| `src/site/content/en/about/index.md` | Rewrite — mô tả mục tiêu chương trình (không xoá) |
| `src/site/_data/i18n/courses.yml` | Add 11 topic entries (en only), remove web-dev entries |
| `src/site/_data/i18n/learn.yml` | Update header text to describe the English program |
| `src/site/_data/i18n/header.yml` | Remove `explore`, `patterns`, `measure`; keep `learn`, `about` |
| `src/site/_includes/partials/site-header.njk` | Remove nav links: Blog, Explore, Patterns, Measure |
| `src/site/_includes/partials/site-footer.njk` | Strip web-dev links (Chrome updates, case studies, etc.) |
| `src/site/content/en/learn/index.md` | Update title/description for English program |
| `src/site/content/en/learn/learn.11tydata.js` | Remove web-dev paths, return empty or English topics |
| `src/site/content/en/en.11tydata.js` | Remove web-dev paths |

---

## Files / Directories to Delete

### Content (web dev specific)
```
src/site/content/en/accessible/
src/site/content/en/angular/
src/site/content/en/animations/
src/site/content/en/baseline/
src/site/content/en/blog/
src/site/content/en/chrometober-2022/
src/site/content/en/community-guidelines/
src/site/content/en/demo/
src/site/content/en/design-system/
src/site/content/en/developer-satisfaction/
src/site/content/en/devices/
src/site/content/en/discoverable/
src/site/content/en/explore/
src/site/content/en/fast/
src/site/content/en/handbook/
src/site/content/en/how-to-optimize-inp/
src/site/content/en/identity/
src/site/content/en/learn-core-web-vitals/
src/site/content/en/lighthouse-pwa/
src/site/content/en/measure/
src/site/content/en/media/
src/site/content/en/metrics/
src/site/content/en/mini-apps/
src/site/content/en/newsletter/
src/site/content/en/notifications/
src/site/content/en/patterns/
src/site/content/en/payments/
src/site/content/en/podcasts/
src/site/content/en/progressive-web-apps/
src/site/content/en/react/
src/site/content/en/reliable/
src/site/content/en/secure/
src/site/content/en/shows/
src/site/content/en/tags/
src/site/content/en/third_party/
src/site/content/en/vitals/
src/site/content/en/web-dev-basics-one/
src/site/content/en/webassembly/

src/site/content/en/learn/css/         ← replace with 11 topic courses
```

### Course data (web dev)
```
src/site/_data/courses/accessibility/
src/site/_data/courses/css/
src/site/_data/courses/design/
src/site/_data/courses/example/
src/site/_data/courses/forms/
src/site/_data/courses/html/
src/site/_data/courses/images/
src/site/_data/courses/privacy/
src/site/_data/courses/pwa/
```

### Data / scripts (web dev)
```
src/site/_data/authorsData.json      ← no author profiles needed
src/site/_data/showsData.json        ← no shows
src/site/_data/podcasts.js           ← no podcasts
src/site/_data/event.js              ← no events
src/site/_data/paths/                ← web dev learning paths
src/lib/lighthouse/                  ← Lighthouse integration
src/lib/lighthouse-service.js
src/lib/psi-service.js
src/lib/patterns.js
src/lib/pages/                       ← web dev page scripts
```

### Firebase Functions (entire)
```
functions/
```
→ Hosting only. Xoá toàn bộ thư mục `functions/`.

### Images (web dev branding)
```
src/images/courses/css/
src/images/courses/accessibility/
src/images/courses/design/
src/images/courses/forms/
src/images/courses/html/
src/images/courses/images/
src/images/courses/privacy/
src/images/courses/pwa/
src/images/collections/              ← web dev collection images
src/images/podcasts/                 ← podcast artwork
src/images/tags/                     ← web dev tag images
```

---

## Homepage Update

**New `src/site/content/en/index.md`:**

```yaml
---
layout: homepage
title: 'onmee.vn — 180-Day English Program'
intro:
  eyebrow: '180 Days to International Readiness'
  title: "Speak English. Get the job."
  summary: |
    A structured 180-day speaking program for senior backend / AI engineers
    targeting $5k+/month international remote roles.
    Topic-based practice. Built for daily use. 30 minutes a day.
  buttonText: 'Start the program'
  buttonUrl: '/learn/'
  image: '/images/lockup.svg'
  imageWidth: '333'
  imageHeight: '240'
---
```

---

## About Page Update

**Rewrite `src/site/content/en/about/index.md`** — replace all web.dev content with:

```yaml
---
layout: about
title: 'About this program'
banner:
  eyebrow: 'About the 180-Day English Program'
  title: 'Speak English. Get the job.'
  summary: |
    A personal 180-day speaking program designed for a senior backend
    and AI engineer targeting international remote roles at $5,000+/month.
    Built on structured topic-based practice — 30 minutes a day,
    every single day, for 180 days.
intro:
  title: 'The goal'
  summary:
    - paragraph: >
        Most Vietnamese engineers with 10+ years of experience are paid $2,000–$3,500/month
        working locally. The same role at an international remote company pays $5,000–$8,000/month.
        The gap is not technical skill. The gap is English communication.
    - paragraph: >
        This program closes that gap in 180 days. It covers 10 technical speaking topics —
        from system design to salary negotiation — plus a parallel daily track for
        natural English with kids at home.
    - paragraph: >
        Each topic is structured as a course: content outline, key vocabulary,
        practice questions, and weekly goals. Navigate through the modules,
        speak every answer out loud, and track your progress as you go.
  primaryButtonText: 'View all topics'
  primaryButtonUrl: '/learn/'
---
```

---

## Implementation Sequence

1. **Delete** `functions/` entirely (hosting only)
2. **Delete** all web-dev content directories from `src/site/content/en/`
3. **Delete** all web-dev course data from `src/site/_data/courses/`
4. **Delete** irrelevant data files, lib scripts, and images (web-dev branding)
5. **Update** i18n files: `courses.yml`, `learn.yml`, `header.yml`
6. **Update** site header/footer: strip web-dev nav links
7. **Update** `en.11tydata.js` and `learn.11tydata.js`: remove web-dev paths
8. **Update** homepage `index.md` — program overview
9. **Rewrite** `about/index.md` — program goals
10. **Create** 11 course metadata directories (`meta.yml` + `toc.yml` each)
11. **Create** 11 course content directories with markdown modules
12. **Verify** build: `npm run dev` → all 11 courses visible at `/learn/`, progress tracking works
13. **Deploy** to Firebase Hosting: `npm run build && firebase deploy --only hosting`

---

---

## Resolved Decisions

| # | Question | Decision |
|---|---|---|
| 1 | Logo/branding images | Placeholder SVG — giống CSS course (màu khác nhau per topic) |
| 2 | Practice timer | Không cần. Dùng **progress tracking built-in** (xem bên dưới) |
| 3 | `/about/` page | Giữ lại, viết lại nội dung mô tả mục tiêu chương trình |
| 4 | Firebase Functions | Hosting only — không deploy functions, xoá functions/ |

---

## Progress Tracking (Built-in — Zero Extra Code)

Hệ thống đã có sẵn `CourseLinks` web component (`src/lib/components/CourseLinks/index.js`):

- **Cơ chế:** Khi người dùng mở một trang module trong course, URL đó tự động được ghi vào `localStorage` dưới key `webdev_course_progress`.
- **UI:** Sidebar navigation drawer hiển thị **checkmark** (`✓`) trên mỗi module đã visited.
- **Percentage:** Component tính tự động `percent` (0–100) dựa trên số module đã visit / tổng số module.
- **No backend:** Toàn bộ chạy client-side, không cần Firestore, không cần sign-in.
- **Behaviour:** Mở trang = đánh dấu done. Đây là behaviour phù hợp với chương trình (đọc xong = học xong module đó).

**Không cần implement gì thêm** — chỉ cần tạo đúng course structure là progress tracking hoạt động tự động.
