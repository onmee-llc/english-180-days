**KE HOACH KPI 2026**

Principal Backend Developer

Thang 5 - Thang 12 nam 2026

| **Vai tro**             | Principal Backend Developer            |
| ----------------------- | -------------------------------------- |
| **Thoi gian thuc hien** | Thang 5/2026 - Thang 12/2026 (8 thang) |
| **Tong so KPI**         | 7 KPI, chia lam 2 track song song      |
| **Track 1**             | AI & Technical Excellence (4 KPI)      |
| **Track 2**             | Tieng Anh (3 KPI)                      |

# **1\. TONG QUAN TIMELINE**

Bang duoi mo ta cac hoat dong chinh theo tung thang trong ca 2 track:

| **Thang**     | **Track AI & Technical**                                                                                                            | **Track Tieng Anh**                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **T5 (May)**  | Bat dau KPI 1: chon use case, viet architecture doc<br><br>Bat dau doc khoa hoc certification                                       | Dang ky reading log, bat dau doc 3 bai EN/tuan                                  |
| **T6 (Jun)**  | KPI 1: implement service, integrate LLM API<br><br>KPI 2: draft LLM Best Practices doc (phan 1)                                     | Duy tri reading log, ghi chep tu moi                                            |
| **T7 (Jul)**  | KPI 1: deploy len staging, co monitoring<br><br>KPI 2: hoan chinh doc, share cho team<br><br>KPI 4: Tech Talk #1 - LLM Architecture | Dang ky 1 online EN meetup/event (T7-T8)                                        |
| **T8 (Aug)**  | Tiep tuc hoc certification (thi thu lan 1)<br><br>KPI 1: collect feedback, refine                                                   | Tham gia 1-2 buoi noi chuyen EN                                                 |
| **T9 (Sep)**  | Thi certification (deadline Q3)<br><br>On tap lai KPI 1 & 2, cap nhat doc neu can                                                   | Dang ky/tham gia buoi EN thu 3<br><br>Bat dau phac thao bai viet EN             |
| **T10 (Oct)** | Review Q3, dieu chinh ke hoach Q4<br><br>Bat dau soan KPI 4 Tech Talk #2                                                            | Viet draft bai EN, dung AI chinh grammar                                        |
| **T11 (Nov)** | KPI 4: Tech Talk #2 - Production AI<br><br>Doc ket qua certification neu chua co                                                    | Hoan chinh va publish bai viet EN                                               |
| **T12 (Dec)** | Tong ket: cap nhat tat ca evidence<br><br>Nhin lai: dieu gi hoc duoc, dieu gi can cai thien                                         | Dem reading log, review 4 buoi speaking<br><br>Share link bai viet len LinkedIn |

# **2\. TRACK 1 - AI & TECHNICAL EXCELLENCE**

Track nay gom 4 KPI, tập trung vao viec xay dung nen tang AI thuc chien o cap do Principal: thiet ke he thong, chuan hoa practice cho team, lay certification, va truyen dat kien thuc noi bo.

## **KPI 1 · Thiet ke & van hanh 1 AI system end-to-end**

**Deadline: Cuoi Q3/2026 (Thang 9)**

**Mo ta:**

Tu chon 1 use case thuc te trong du an, thiet ke toan bo kien truc, implement va deploy len staging/production. Day la KPI the hien nang luc Principal - khong chi code duoc ma phai design duoc he thong dang tin cay.

**Yeu cau chung nhan:**

- Architecture document: data flow diagram, component diagram, ly do chon LLM provider va model
- Backend service co day du: retry, timeout, fallback, streaming response, token cost log
- Code da qua review va merged len staging hoac production branch
- Basic monitoring: latency + error rate theo doi duoc
- README du de nguoi moi onboard trong 30 phut ma khong can hoi

**Ke hoach hanh dong chi tiet:**

| **Thang** | **Hanh dong cu the**                                                                             | **Ket qua can co**                              |
| --------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| T5        | Chon use case cu the (chatbot noi bo / document Q&A / AI search). Viet Architecture doc ban dau. | Architecture doc v1 (co diagram)                |
| T6        | Implement backend service: goi LLM API, xu ly streaming, them retry logic, log token usage.      | PR draft tren staging branch                    |
| T7        | Them monitoring co ban (latency, error rate). Code review voi team. Deploy staging.              | Feature chay tren staging, dashboard monitor    |
| T8        | Thu thap feedback tu team, fix bug, refine based on real usage.                                  | Danh gia: he thong on dinh, khong co regression |
| T9        | Viet README hoan chinh. Chuan bi demo cho sip neu can.                                           | KPI 1 hoan thanh, co evidence day du            |

**Tai lieu chinh thuc va nguon hoc:**

| **Ten tai lieu / Ngu??n**   | **Link chinh thuc**                               | **Ghi chu**                          |
| --------------------------- | ------------------------------------------------- | ------------------------------------ |
| Anthropic API Documentation | <https://docs.anthropic.com/>                     | API ref, prompt guide, cookbook      |
| OpenAI Platform Docs        | <https://platform.openai.com/docs/>               | API ref, function calling, streaming |
| Google Gemini API Docs      | <https://ai.google.dev/gemini-api/docs>           | Alternative LLM provider             |
| LangChain Python Docs       | <https://python.langchain.com/docs/introduction/> | LLM framework pho bien nhat          |
| LlamaIndex Documentation    | <https://docs.llamaindex.ai/en/stable/>           | RAG & agentic pipelines              |
| pgvector GitHub (vector DB) | <https://github.com/pgvector/pgvector>            | Neu team dung PostgreSQL             |
| Qdrant Documentation        | <https://qdrant.tech/documentation/>              | Dedicated vector DB, de setup        |

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Dinh nghia hoan thanh (Definition of Done)</strong></p><ul><li>Architecture doc da duoc review boi it nhat 1 nguoi</li><li>Code merged vao main/staging branch, co CI/CD pass</li><li>Monitoring dashboard: latency + error rate theo doi duoc trong 7 ngay lien tiep</li><li>README: 1 nguoi moi doc xong tu onboard duoc ma khong can hoi</li></ul></th></tr></tbody></table></div>

## **KPI 2 · Soan LLM Best Practices Guide cho team**

**Deadline: Cuoi Q3/2026 (Thang 9)**

**Mo ta:**

Rut ra tu kinh nghiem thuc te (dac biet KPI 1), soan 1 internal doc chuan hoa cach team su dung LLM: prompt pattern, error handling, cost control, security. Day la vai tro dac trung cua Principal - khong phai chi hieu, ma phai truyen dat lai cho ca team.

**Noi dung doc phai bao gom (toi thieu):**

- Prompt template chuan cua team (system prompt, user prompt, few-shot examples)
- Cac pattern da dung: Chain-of-Thought, ReAct, structured output
- Cach xu ly hallucination, over-refusal, context window limit
- Retry & fallback strategy (khi nao retry, khi nao fallback sang model re hon)
- Cost optimization: chon model phu hop voi tung loai task
- Security: khong leak user PII vao prompt, prompt injection prevention
- Cach test & eval prompt (khong phai chi test thu cong)

**Ke hoach hanh dong chi tiet:**

| **Thang** | **Hanh dong cu the**                                                      | **Ket qua can co**                        |
| --------- | ------------------------------------------------------------------------- | ----------------------------------------- |
| T6        | Bat dau ghi chep: moi khi gap van de trong KPI 1, ghi lai va loi giai.    | Draft notes (co the la Notion/Confluence) |
| T7        | Soan doc chinh thuc tu notes. Viet phan: prompt patterns + cost guide.    | Doc v1 co 2 phan chinh                    |
| T8        | Hoan thien phan con lai: security, testing, gotchas. Review voi team.     | Doc hoan chinh, da nhan feedback          |
| T9        | Publish len Confluence/Notion/Google Docs chinh thuc. Thong bao cho team. | Link doc da duoc share                    |

**Tai lieu chinh thuc va nguon hoc:**

| **Ten tai lieu / Ngu??n**          | **Link chinh thuc**                                                                | **Ghi chu**                       |
| ---------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------- |
| Anthropic Prompt Engineering Guide | <https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview> | Huong dan chinh thuc tu Anthropic |
| OpenAI Prompt Engineering Guide    | <https://platform.openai.com/docs/guides/prompt-engineering>                       | Best practices tu OpenAI          |
| OpenAI Production Best Practices   | <https://platform.openai.com/docs/guides/production-best-practices>                | Checklist cho production          |
| LangSmith (LLM Observability)      | <https://docs.smith.langchain.com/>                                                | Trace, debug, eval LLM calls      |
| Helicone Documentation             | <https://docs.helicone.ai/>                                                        | Proxy-based LLM monitoring        |
| RAGAS (RAG Evaluation)             | <https://docs.ragas.io/en/stable/>                                                 | Framework eval RAG quality        |

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Dinh nghia hoan thanh (Definition of Done)</strong></p><ul><li>Doc da duoc publish len platform chinh thuc cua team (Confluence, Notion hoac tuong duong)</li><li>It nhat 1 team member doc va apply noi dung vao task thuc te cua ho (co bang chung: comment, PR, mention)</li><li>Doc co ngay cap nhat - day la 'living document', khong phai viet 1 lan roi thoi</li></ul></th></tr></tbody></table></div>

## **KPI 3 · Hoan thanh 1 AI/ML Certification co gia tri**

**Deadline: Cuoi Q4/2026 (Thang 12)**

**Mo ta:**

Lay it nhat 1 chung chi AI/ML duoc cong nhan rong rai. Muc tieu khong chi la mang ve chung chi ma la qua trinh hoc de co nen tang ly thuyet va goc nhin rong hon ve AI system, bo sung cho kinh nghiem thuc chien da co tu KPI 1 & 2.

**Cac lua chon duoc goi y (chon 1):**

- DeepLearning.AI: 'Generative AI with LLMs' - thuc te nhat, khoang 3 tuan, co Coursera cert
- AWS Certified Machine Learning - Specialty - gia tri nhat tren thi truong, kho hon, can 2-3 thang on
- Google Cloud Professional ML Engineer - tot neu team dung GCP
- Microsoft Azure AI Engineer Associate (AI-102) - thich hop neu dung Azure

**Ke hoach hoc de kip deadline:**

| **Thang** | **Hanh dong cu the**                                                                  | **Ket qua can co**                         |
| --------- | ------------------------------------------------------------------------------------- | ------------------------------------------ |
| T5-T6     | Chon certification phu hop. Dang ky khoa hoc, lap schedule hoc: 1h/ngay, 5 ngay/tuan. | Schedule da lap, khoa hoc da dang ky       |
| T7-T8     | Hoan thanh 60-70% noi dung khoa hoc. Lam het lab va coding exercise.                  | Progress >= 60%, notes hoc tap dang day du |
| T9        | Hoan thanh khoa hoc. Lam practice exam 2 lan. Dang ky lich thi.                       | Completed khoa hoc + lich thi da co        |
| T10-T11   | Thi that. Neu rot lan 1: on lai, thi lai trong T11. Target: pass trong Q4.            | Thi lan 1 (va lan 2 neu can)               |
| T12       | Nhan certificate. Share len LinkedIn va vao repo team nhu evidence.                   | Certificate PDF/badge co mat               |

**Tai lieu chinh thuc va nguon hoc:**

| **Ten tai lieu / Ngu??n**                 | **Link chinh thuc**                                                               | **Ghi chu**                      |
| ----------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------- |
| DeepLearning.AI - Generative AI with LLMs | <https://www.coursera.org/learn/generative-ai-with-llms>                          | Thuc te, co Coursera cert, ~16h  |
| DeepLearning.AI - All Courses             | <https://www.deeplearning.ai/courses/>                                            | Bo suu tap khoa hoc AI/ML        |
| AWS ML Specialty Certification            | <https://aws.amazon.com/certification/certified-machine-learning-specialty/>      | Exam guide + sample questions    |
| Google Cloud ML Engineer Cert             | <https://cloud.google.com/learn/certification/machine-learning-engineer>          | Study guide chinh thuc           |
| Microsoft Azure AI-102                    | <https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/> | Free learning path tren MS Learn |
| A Cloud Guru / Pluralsight                | <https://www.pluralsight.com/cloud-guru>                                          | Khoa on thi AWS/GCP/Azure        |

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Dinh nghia hoan thanh (Definition of Done)</strong></p><ul><li>Certificate PDF hoac Credly badge da duoc cap</li><li>Share len LinkedIn profile (tab Licenses &amp; Certifications)</li><li>Upload vao thu muc evidence cua team (Google Drive / Confluence)</li></ul></th></tr></tbody></table></div>

## **KPI 4 · Dan dat 2 AI Tech Talk noi bo**

**Deadline: Tech Talk #1 cuoi Q3 (T7) · Tech Talk #2 cuoi Q4 (T11)**

**Mo ta:**

To chuc 2 buoi technical sharing noi bo (45-60 phut moi buoi) de truyen dat kien thuc AI cho ca team. Day la phan the hien ro nhat vai tro Principal: khong chi lam gioi ma con phai nang tam ca team.

**Tech Talk #1 - Thang 7/2026 (LLM Architecture & Integration):**

- LLM landscape: provider nao dung khi nao (OpenAI vs Anthropic vs Gemini vs local)
- Live demo: goi API, xu ly streaming, xem cost log - co the chia se man hinh code thuc
- Kien truc patterns: khi nao dung RAG, khi nao chì can prompt, khi nao fine-tune
- Q&A mo: khuyen khich team hoi bat ky dieu gi ve AI

**Tech Talk #2 - Thang 11/2026 (Production AI & Lessons Learned):**

- Chia se nhung gi da sai trong KPI 1 va cach fix - honest retrospective
- Eval framework: lam sao biet AI dang hoat dong tot (metrics, eval sets)
- Cost & latency optimization thuc chien: con so cu the
- AI roadmap: team nen tap trung vao dieu gi trong 2027

**Ke hoach chuan bi:**

| **Thang** | **Hanh dong cu the**                                                           | **Ket qua can co**               |
| --------- | ------------------------------------------------------------------------------ | -------------------------------- |
| T6        | Outline slides cho Tech Talk #1. Chon tool trinh bay (Google Slides / Notion). | Outline da xong                  |
| T7        | Trinh bay Tech Talk #1. Thu thap feedback bang form hoac hoi truc tiep.        | Slides upload, feedback thu thap |
| T10       | Outline slides cho Tech Talk #2 dua tren lesson learned tu Q3.                 | Outline v1 cho TT#2              |
| T11       | Trinh bay Tech Talk #2. Tong ket nam va dinh huong 2027.                       | TT#2 dien ra, slides luu tru     |

**Tai lieu chinh thuc va nguon hoc:**

| **Ten tai lieu / Ngu??n**          | **Link chinh thuc**                                | **Ghi chu**                      |
| ---------------------------------- | -------------------------------------------------- | -------------------------------- |
| Anthropic Cookbook (demo examples) | <https://github.com/anthropics/anthropic-cookbook> | Code mau chinh thuc tu Anthropic |
| OpenAI Cookbook                    | <https://github.com/openai/openai-cookbook>        | Code mau chinh thuc tu OpenAI    |
| Google AI Developer Blog           | <https://developers.googleblog.com/>               | News & tutorials tu Google       |
| DeepLearning.AI Short Courses      | <https://www.deeplearning.ai/short-courses/>       | Nguon tham khao noi dung talk    |

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Dinh nghia hoan thanh (Definition of Done)</strong></p><ul><li>Moi Tech Talk: slides da duoc luu vao thu muc chung cua team</li><li>Co record hoac notes day du cho nguoi vang mat</li><li>Thu thap it nhat 3 cau hoi/feedback tu nguoi tham du</li><li>Sau Tech Talk #2: team biet duoc AI roadmap va co thể tu hoc them ma khong can hold tay</li></ul></th></tr></tbody></table></div>

# **3\. TRACK 2 - TIENG ANH**

Track nay gom 3 KPI. Muc tieu khong phai la 'hoc tieng Anh tu dau' ma la nang cao kha nang su dung tieng Anh trong cong viec ky thuat hang ngay - doc doc, noi chuyen, va viet - mot cach tu tin va chinh xac.

## **KPI 5 · Xay thoi quen doc EN technical content hang tuan**

**Giai doan: Thang 5 - Thang 12 (duy tri lien tuc)**

**Mo ta:**

Xay thoi quen doc bai ky thuat bang tieng Anh it nhat 3 bai/tuan - khong dung Google Translate lam cot. Muc tieu la den cuoi nam, doc doc tieu de va cac khai niem kỹ thuat EN ma khong can ngung lai tra nghia.

**Nguon doc duoc goi y (chinh thuc, chat luong cao):**

- ByteByteGo Blog - system design, architecture (newsletter + blog)
- The Pragmatic Engineer - engineering culture, career, deep dives
- Martin Fowler Blog - software architecture, patterns, refactoring
- Anthropic Research Blog - AI safety, model updates chinh thuc
- OpenAI Blog - model releases, research tu OpenAI
- Increment (stripe.com/magazine) - deep dives chuyen nghiep

**Cach duy tri reading log (don gian nhat):**

- Dung Notion / Google Sheet voi 3 cot: Ngay | Ten bai | 1 dieu hoc duoc
- Muc tieu: 50+ entries vao thang 12/2026
- Khong tinh bai doc qua Google Translate - phai doc thang tieng Anh

**Tai lieu chinh thuc va nguon hoc:**

| **Ten tai lieu / Ngu??n** | **Link chinh thuc**                         | **Ghi chu**                        |
| ------------------------- | ------------------------------------------- | ---------------------------------- |
| ByteByteGo Blog           | <https://blog.bytebytego.com/>              | System design, newsletter mien phi |
| The Pragmatic Engineer    | <https://newsletter.pragmaticengineer.com/> | Engineering deep dives             |
| Martin Fowler Blog        | <https://martinfowler.com/>                 | Architecture & patterns            |
| Anthropic Research        | <https://www.anthropic.com/research>        | AI research chinh thuc             |
| OpenAI Blog               | <https://openai.com/blog/>                  | Model news & research              |
| Increment Magazine        | <https://increment.com/>                    | Professional tech writing          |
| Hacker News (EN)          | <https://news.ycombinator.com/>             | Tech news & discussions            |

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Dinh nghia hoan thanh (Definition of Done)</strong></p><ul><li>Reading log co it nhat 50 entries vao ngay 31/12/2026</li><li>Tu danh gia: doc 1 bai ky thuat EN (500+ tu) xong hieu y chinh ma khong dung translation tool</li><li>Co the giai thich 3 concept ky thuat EN bat ky cho nguoi khac bang tieng Viet - tuc la hieu that, khong chi doc qua</li></ul></th></tr></tbody></table></div>

## **KPI 6 · Tham gia it nhat 4 buoi noi chuyen bang tieng Anh**

**Giai doan: Q3 - Q4 2026 (Thang 7 - Thang 12)**

**Mo ta:**

Chu dong tao co hoi noi tieng Anh thuc su - khong chi la nghe. Muc tieu la cuoi nam, noi duoc ve cac chu de ky thuat bang EN ma khong can thoi gian chuan bi qua nhieu.

**Cac co hoi co the tan dung:**

- Demo feature cho stakeholder / doi tac nuoc ngoai (neu co)
- Online tech meetup bang EN: SREcon, PyCon, AWS Community Day Online, CNCF events
- Mock interview ky thuat bang EN tren Pramp.com (mien phi, co doi tac ngau nhien)
- 1-on-1 mentoring hoac peer call qua ADPList (mien phi, mentor toan cau)
- Tham gia Discord / Slack community EN: Hugging Face, LangChain, Anthropic Discord

**Ke hoach hanh dong chi tiet:**

| **Thang** | **Hanh dong cu the**                                                              | **Ket qua can co**                   |
| --------- | --------------------------------------------------------------------------------- | ------------------------------------ |
| T7        | Dang ky 1 event online bang EN hoac tim partner tren Pramp/ADPList. Thu buoi dau. | Buoi 1 hoan thanh, ghi chep cam nhan |
| T8-T9     | Thuc hien buoi 2 va buoi 3. Tang dan do kho (informal -> formal).                 | Log 3 buoi voi notes cu the          |
| T10-T12   | Buoi thu 4 (cuoi nam). Co the la demo truoc sip neu co co hoi.                    | Log day du 4 buoi voi tu danh gia    |

**Tai lieu chinh thuc va nguon hoc:**

| **Ten tai lieu / Ngu??n**    | **Link chinh thuc**                         | **Ghi chu**                          |
| ---------------------------- | ------------------------------------------- | ------------------------------------ |
| ADPList (mentoring mien phi) | <https://adplist.org/>                      | Tim mentor EN trong cong nghe        |
| Pramp (mock interview EN)    | <https://www.pramp.com/>                    | Peer mock interview ky thuat         |
| Meetup.com (tech events)     | <https://www.meetup.com/topics/technology/> | Tim online tech meetup               |
| Luma (online events)         | <https://lu.ma/>                            | AI/tech events online, nhieu buoi EN |
| Anthropic Discord            | <https://discord.gg/anthropic>              | Community chinh thuc Anthropic       |
| Hugging Face Discord         | <https://huggingface.co/join/discord>       | AI/ML community lon                  |

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Dinh nghia hoan thanh (Definition of Done)</strong></p><ul><li>Log ghi nhan it nhat 4 buoi voi: ngay, hinh thuc, chu de, cam nhan</li><li>Tu danh gia: buoi thu 4 so voi buoi thu 1, noi luu loat va tu tin hon ro rang</li><li>Buoi cuoi cung it nhat la formal setting (demo, interview, hoac presentation)</li></ul></th></tr></tbody></table></div>

## **KPI 7 · Viet va publish 1 technical article bang tieng Anh**

**Deadline: Cuoi Q4/2026 (Thang 11 la ideal, T12 la chap nhan duoc)**

**Mo ta:**

Viet 1 bai ky thuat bang tieng Anh (500-1000 tu) duoc publish cong khai. Chu de lay tu kinh nghiem thuc te - tot nhat la rut ra tu KPI 1 hoac KPI 2. Day la cach manh nhat de cung co writing skill va build personal brand cung mot luc.

**Goi y chu de (chon 1):**

- 'What I learned building my first LLM-powered backend service'
- 'LLM cost optimization: tips from production experience'
- 'Why prompt engineering is more engineering than art'
- 'RAG vs fine-tuning: when to use which approach'
- 'How we set up AI observability for our backend team'

**Quy trinh viet khuyen nghi:**

- Buoc 1 - Outline: viet cac y chinh bang tieng Viet truoc, sau do chuyen sang EN
- Buoc 2 - Draft: viet toan bo bai bang EN, khong can hoan hao
- Buoc 3 - Review: dung ChatGPT hoac Claude de check grammar & clarity (khong phai de viet thay)
- Buoc 4 - Final read: doc lai toan bo lan cuoi, dam bao gion/tieng noi la cua minh
- Buoc 5 - Publish & share: dang len platform, share len LinkedIn

**Ke hoach hanh dong chi tiet:**

| **Thang** | **Hanh dong cu the**                                                 | **Ket qua can co**            |
| --------- | -------------------------------------------------------------------- | ----------------------------- |
| T9        | Chon chu de cu the. Viet outline (5-7 dau muc chinh).                | Outline da xong, chu de chot  |
| T10       | Viet draft day du. Khong chỉnh sua o giai doan nay, cu viet het da.  | Draft hoan chinh (co the xau) |
| T11       | Review grammar, chỉnh sua clarity, lay feedback tu 1 nguoi. Publish. | Bai da duoc publish, co URL   |
| T12       | Share URL len LinkedIn. Cap nhat link vao portfolio ca nhan neu co.  | Link duoc share cong khai     |

**Tai lieu chinh thuc va nguon hoc:**

| **Ten tai lieu / Ngu??n**       | **Link chinh thuc**          | **Ghi chu**                              |
| ------------------------------- | ---------------------------- | ---------------------------------------- |
| Dev.to (platform xuat ban)      | <https://dev.to/>            | Mien phi, tech community lon, de dang ky |
| Hashnode (platform xuat ban)    | <https://hashnode.com/>      | Co the dung domain rieng, mien phi       |
| Medium (platform xuat ban)      | <https://medium.com/>        | Uy tin, nhieu nguoi doc trong tech       |
| LinkedIn Articles               | <https://www.linkedin.com/>  | Reach cao voi network hien tai cua ban   |
| Hemingway Editor (writing tool) | <https://hemingwayapp.com/>  | Kiem tra do ro rang cua bai viet EN      |
| Grammarly (grammar check)       | <https://www.grammarly.com/> | Grammar & style checker                  |

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Dinh nghia hoan thanh (Definition of Done)</strong></p><ul><li>Bai da duoc publish, co URL public va ai cung doc duoc</li><li>Do dai: it nhat 500 tu (khong tinh code snippets)</li><li>Noi dung: co y kien rieng cua tac gia, khong chi la summary cua nguon khac</li><li>URL duoc share len LinkedIn (du chi 5 nguoi doc)</li></ul></th></tr></tbody></table></div>

# **4\. BANG TONG HOP DEFINITION OF DONE**

Dung bang nay de trao doi voi sip va review hang quy. Moi KPI co evidence cu the, tranh tinh trang 'lam roi nhung khong chung minh duoc'.

| **#** | **KPI**                      | **Definition of Done**                                        | **Deadline**       |
| ----- | ---------------------------- | ------------------------------------------------------------- | ------------------ |
| **1** | **AI System End-to-End**     | Code merged tren staging, co monitoring, README du de onboard | Cuoi Q3 2026       |
| **2** | **LLM Best Practices Guide** | Doc duoc share, co 1 member apply vao task thuc te            | Cuoi Q3 2026       |
| **3** | **AI/ML Certification**      | Certificate PDF/badge da nhan, share len LinkedIn             | Cuoi Q4 2026       |
| **4** | **2x Tech Talk noi bo**      | Slides luu tru, co record hoac notes, thu feedback            | 1 cai Q3, 1 cai Q4 |
| **5** | **EN Reading Habit**         | Reading log >= 50 entries, doc EN khong can dich              | Duy tri T5-T12     |
| **6** | **EN Speaking Practice**     | Log >= 4 buoi noi tieng Anh                                   | Cuoi Q4 2026       |
| **7** | **EN Technical Writing**     | 1 bai EN da publish, co URL public                            | Cuoi Q4 2026       |

# **5\. LUU Y THUC HIEN**

**Quan ly thoi gian:**

- 2 track chay song song - khong nen de het Q3 moi bat dau tieng Anh
- AI track: nang nhat la T5-T9, giam dan khi het certification va deploy xong
- EN track: duy tri deu, 30-45 phut/ngay, khong can hoc theo block lon

**Review checkpoint de xuat:**

- Cuoi T6: check progress KPI 1 (architecture doc + first PR)
- Cuoi T9 (Q3 review): danh gia KPI 1,2,4a - co evidence day du chua?
- Cuoi T12 (final review): danh gia tat ca 7 KPI voi sip

**Nguyen tac quan trong:**

- Evidence-first: lam den dau ghi chep den do (screenshot, PR link, notes)
- Khong hoan hao ngay tu dau - iterate la quy trinh, khong phai fail
- Neu mot KPI bi delay: bao som, dieu chinh scope thay vi bo het

Tai lieu KPI - Principal Backend Developer - Cap nhat: Thang 4/2026