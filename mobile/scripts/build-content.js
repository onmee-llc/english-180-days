import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..', '..');
const CONTENT_DIR = path.join(REPO_ROOT, 'src/site/content/en/learn');
const COURSES_DATA_DIR = path.join(REPO_ROOT, 'src/site/_data/courses');
const I18N_COURSES_PATH = path.join(
  REPO_ROOT,
  'src/site/_data/i18n/courses.yml',
);
const OUT_PATH = path.join(__dirname, '..', 'src/content/lessons.json');

const PROGRAM_START = new Date('2026-08-22');
const md = new MarkdownIt({html: true});

export function extractDayNumber(title, topicSlug = '', lessonNum = 1) {
  const m = (title || '').match(/^Day\s+(\d+)/i);
  if (m) return parseInt(m[1], 10);
  const num = parseInt(lessonNum, 10) || 1;
  if (topicSlug === 'topic-17-finance-career') return 224 + num;
  if (topicSlug === 'topic-18-ai-ml-roadmap') return 232 + num;
  if (topicSlug === 'topic-11-daily-with-kids') return 242 + num;
  if (topicSlug === 'pronunciation-guide') return 250 + num;
  return null;
}

/**
 * Topic questions repository for overview generation.
 */
export function getTopicQuestions(topicSlug = '', title = '') {
  const bank = {
    'topic-1-introduce-yourself': [
      'Bạn có thể tự giới thiệu về bản thân và vai trò chuyên môn trong 90 giây mà không cần dịch trong đầu không?',
      'Điểm mạnh kỹ thuật lớn nhất và sản phẩm thực tế gần đây nhất của bạn là gì?',
      'Lý do bạn phù hợp nhất với vị trí kỹ sư senior này là gì?',
    ],
    'topic-2-system-design': [
      'Làm thế nào để giải thích kiến trúc phân tán (distributed systems) và trade-offs latency/throughput bằng tiếng Anh?',
      'Chiến lược Caching (Redis) và Data Partitioning nào phù hợp nhất cho bài toán này?',
      'Làm sao thiết kế hệ thống chịu tải cao (High QPS) đảm bảo tính sẵn sàng (High Availability)?',
    ],
    'topic-3-api-microservices': [
      'Lợi ích và nhược điểm khi chuyển đổi từ Monolith sang Microservices là gì?',
      'Làm thế nào để xử lý Circuit Breaker, Rate Limiting và Idempotency trong API design?',
      'Làm sao đảm bảo tính toàn vẹn dữ liệu giữa các microservices (Saga pattern/2PC)?',
    ],
    'topic-4-cloud-infrastructure': [
      'Bạn tối ưu chi phí cloud (AWS/GCP) và kiến trúc Auto-scaling như thế nào?',
      'Làm thế nào để thiết kế mô hình bảo mật Zero-Trust và phân quyền IAM chặt chẽ?',
      'Chiến lược Disaster Recovery (RPO/RTO) nào được áp dụng cho production database?',
    ],
    'topic-5-ai-ml-pipelines': [
      'Làm thế nào để xây dựng RAG pipeline hoàn chỉnh với Vector DB và Chunking tối ưu?',
      'Bạn xử lý bài toán latency và streaming responses trong hệ thống LLM như thế nào?',
      'Làm sao đánh giá chất lượng đầu ra của mô hình (LLM Evaluation Framework)?',
    ],
    'topic-6-automation-workflow': [
      'Làm thế nào để thiết kế hàng đợi tác vụ bất đồng bộ (Queue-based asynchronous workers)?',
      'Chiến lược Retry logic với Exponential Backoff và Dead-Letter Queue (DLQ) là gì?',
      'Làm sao đảm bảo tính tự động hóa thông suốt trong CI/CD pipeline?',
    ],
    'topic-7-project-storytelling': [
      'Bạn kể lại dự án phức tạp nhất theo cấu trúc STAR (Situation, Task, Action, Result) như thế nào?',
      'Quyết định kỹ thuật khó khăn nhất mà bạn đã đưa ra trong dự án là gì?',
      'Kết quả định lượng (Metrics & Impact) đạt được sau khi bàn giao dự án là gì?',
    ],
    'topic-8-problem-solving': [
      'Quy trình từng bước bạn áp dụng để phân tích nguyên nhân gốc rễ (Root Cause Analysis)?',
      'Khi xảy ra sự cố production nghiêm trọng, bạn giao tiếp và xử lý khủng hoảng ra sao?',
      'Làm thế nào để cân bằng giữa giải pháp ngắn hạn (Hotfix) và dài hạn (Refactor)?',
    ],
    'topic-9-team-communication': [
      'Làm thế nào để đưa ra phản hồi Code Review mang tính xây dựng và rõ ràng bằng tiếng Anh?',
      'Cách trình bày ý kiến khi bất đồng quan điểm kiến trúc kỹ thuật với đồng nghiệp?',
      'Làm sao cập nhật tiến độ Daily Standup súc tích, đi thẳng vào trọng tâm và blockers?',
    ],
    'topic-10-salary-negotiation': [
      'Làm thế nào để đưa ra kỳ vọng mức lương (Target Range) tự tin và có cơ sở?',
      'Cách đàm phán thêm các đãi ngộ khác (Equity, Sign-on Bonus, Remote Allowance)?',
      'Phản hồi chuyên nghiệp và khéo léo khi nhận được nhiều offer cùng lúc ra sao?',
    ],
    'topic-11-daily-with-kids': [
      'Các mẫu câu tự nhiên nhất khi giao tiếp cùng con vào các thời điểm trong ngày là gì?',
      'Làm thế nào để phản xạ 100% tiếng Anh không ngập ngừng trong các tình huống gia đình?',
      'Cách dùng từ ngữ động viên, khuyến khích con tích cực và gần gũi bằng tiếng Anh?',
    ],
    'pronunciation-guide': [
      'Làm sao phát âm chuẩn phụ âm cuối, âm đuôi /-s, -z, -ed/ không bị nuốt âm hay thêm "-uh"?',
      'Cách phân biệt và phát âm chuẩn các cặp âm khó như /θ/ vs /ð/, /v/ vs /w/?',
      'Làm thế nào để luyện Shadowing bắt chước nhịp điệu và ngữ điệu người bản xứ?',
    ],
    'topic-12-llm-system-architecture': [
      'Kiến trúc tổng thể của một hệ thống LLM Production gồm những thành phần nào?',
      'Làm thế nào để thiết kế bộ nhớ đệm (Semantic Caching) giảm chi phí và độ trễ?',
      'Chiến lược Guardrails và Input/Output Validation cho LLM được triển khai ra sao?',
    ],
    'topic-13-prompt-engineering': [
      'Các kỹ thuật nâng cao như Few-Shot, Chain-of-Thought (CoT) mang lại hiệu quả gì?',
      'Làm thế nào để thiết kế Structured Output (JSON mode) cho AI pipelines?',
      'Cách viết System Prompt chặt chẽ để giảm thiểu rủi ro ảo giác (Hallucination)?',
    ],
    'topic-14-ai-tech-talks': [
      'Cấu trúc một bài thuyết trình kỹ thuật (Tech Talk) 20 phút bằng tiếng Anh gồm những phần nào?',
      'Làm thế nào để mở đầu ấn tượng và thu hút người nghe ngay từ slide đầu tiên?',
      'Cách trả lời lưu loát các câu hỏi khó trong phần Q&A của buổi hội thảo?',
    ],
    'topic-15-en-reading-lab': [
      'Làm thế nào để nắm bắt nhanh các luận điểm chính từ bài báo kiến trúc hệ thống?',
      'Cách tổng hợp và tóm tắt một nghiên cứu AI phức tạp thành một đoạn văn ngắn gọn?',
      'Thuật ngữ chuyên ngành nào cần ghi nhớ sâu để áp dụng vào công việc?',
    ],
    'topic-16-en-technical-writing': [
      'Các nguyên tắc viết tài liệu kỹ thuật (RFC/Design Doc) mạch lạc, súc tích là gì?',
      'Làm thế nào để diễn đạt các trade-offs kỹ thuật một cách khách quan và thuyết phục?',
      'Cấu trúc chuẩn của một bài viết kỹ thuật chia sẻ kinh nghiệm trên blog công nghệ?',
    ],
    'topic-19-ai-ml-security': [
      'Các vector tấn công phổ biến nhất nhắm vào LLM (Prompt Injection, Jailbreak) là gì?',
      'Làm thế nào để triển khai Red Teaming và Audit bảo mật cho hệ thống GenAI?',
      'Chiến lược Defense-in-Depth để bảo vệ dữ liệu nhạy cảm trong mô hình AI là gì?',
    ],
    'topic-17-finance-career': [
      'Làm thế nào để lập kế hoạch tài chính cá nhân và quỹ khẩn cấp cho kỹ sư phần mềm?',
      'Chiến lược đa dạng hóa nguồn thu nhập (Freelance, Consulting, Investment) ra sao?',
      'Cách đánh giá tổng thu nhập (Total Compensation: Base, Bonus, RSU) khi chọn công ty?',
    ],
    'topic-18-ai-ml-roadmap': [
      'Lộ trình từng bước để từ Backend Engineer nâng cấp thành AI/LLM Systems Engineer?',
      'Những dự án thực chiến (Hands-on Projects) nào cần hoàn thành để chứng minh năng lực?',
      'Cách xây dựng Portfolio kỹ thuật về AI/ML thu hút nhà tuyển dụng quốc tế?',
    ],
  };

  return bank[topicSlug] || [
    'Mục tiêu chính và giá trị thực tiễn lớn nhất của bài học này là gì?',
    'Làm thế nào để áp dụng các mẫu câu và từ vựng này vào môi trường làm việc thực tế?',
    'Bạn có thể tự diễn đạt lại nội dung bài học bằng tiếng Anh trong 60 giây không?',
  ];
}

/**
 * Extracts Overview metadata: Objectives, Key Concepts to master, Questions to answer.
 */
export function extractOverview(rawContent, frontMatter = {}, topicSlug = '', lessonNum = 1) {
  const objectives = [];
  const keyTakeaways = [];
  const coreQuestions = [];

  // 1. Objectives
  const goalMatch = rawContent.match(/## Session goal[^\n]*\n+([\s\S]*?)(?=\n##|\n---|$)/i);
  if (goalMatch) {
    const rawGoal = goalMatch[1].replace(/<[^>]+>/g, '').replace(/\{%[\s\S]*?%\}/g, '').trim();
    const cleanGoal = rawGoal.split('\n')[0].replace(/^>\s*/, '').trim();
    if (cleanGoal) {
      objectives.push(cleanGoal);
    }
  }

  const viGoalMatch = rawContent.match(/<strong>Mục tiêu[^:<]*:?<\/strong>\s*:?\s*([^<\n]+)/i)
    || rawContent.match(/Mục tiêu buổi học:?\s*([^\n<]+)/i);
  if (viGoalMatch) {
    const viGoal = viGoalMatch[1].trim();
    if (viGoal && !objectives.includes(viGoal)) {
      objectives.push(viGoal);
    }
  }

  if (frontMatter.description && objectives.length < 2) {
    objectives.push(frontMatter.description.trim());
  }

  if (objectives.length === 0) {
    objectives.push(`Nắm vững kiến thức trọng tâm và phản xạ lưu loát của bài học.`);
    objectives.push(`Luyện tập kỹ thuật Shadowing đồng bộ ngữ điệu và phát âm chuẩn.`);
  } else if (objectives.length === 1) {
    objectives.push(`Thực hành Shadowing nhịp điệu tự nhiên và phản xạ không cần dịch trong đầu.`);
  }

  // 2. Key Takeaways
  const vocab = extractVocabulary(rawContent);
  if (vocab.length > 0) {
    const topTerms = vocab.slice(0, 3).map((v) => `${v.word}${v.note ? ` (${v.note})` : ''}`).join(' · ');
    keyTakeaways.push(`Từ vựng & Cụm từ then chốt: ${topTerms}`);
  }

  const grammar = extractGrammar(rawContent);
  if (grammar.length > 0) {
    const gTitles = grammar.map((g) => g.title).join(', ');
    keyTakeaways.push(`Ngữ pháp trọng điểm: ${gTitles}`);
  }

  const patterns = extractSentencePatterns(rawContent);
  if (patterns.length > 0) {
    const pTitles = patterns.map((p) => p.title).join('; ');
    keyTakeaways.push(`Mẫu câu ứng dụng thực tế: ${pTitles}`);
  }

  if (keyTakeaways.length < 2) {
    keyTakeaways.push(`Quy tắc ngắt nghỉ theo cụm từ (thought groups) và nối âm mượt mà.`);
    keyTakeaways.push(`Phản xạ trả lời tự tin, không học vẹt, tập trung vào bản chất vấn đề.`);
  }

  // 3. Core Questions to Answer
  const reflectionMatch = rawContent.match(/## Reflection[^\n]*\n+([\s\S]*?)(?=\n##|\n---|$)/i);
  if (reflectionMatch) {
    const refText = reflectionMatch[1].replace(/<[^>]+>/g, '').replace(/\{%[\s\S]*?%\}/g, '').trim();
    const refQ = refText.split('\n')[0].replace(/^>\s*/, '').trim();
    if (refQ && refQ.length > 10) {
      coreQuestions.push(refQ);
    }
  }

  const viRefMatch = rawContent.match(/<strong>Tự ngẫm:?<\/strong>\s*:?\s*([^<\n]+)/i)
    || rawContent.match(/Tự ngẫm:?\s*([^\n<]+)/i);
  if (viRefMatch) {
    const viRef = viRefMatch[1].trim();
    if (viRef && !coreQuestions.includes(viRef)) {
      coreQuestions.push(viRef);
    }
  }

  const topicQuestionBank = getTopicQuestions(topicSlug, frontMatter.title || '');
  for (const q of topicQuestionBank) {
    if (coreQuestions.length < 3 && !coreQuestions.includes(q)) {
      coreQuestions.push(q);
    }
  }

  return {
    objectives,
    keyTakeaways,
    coreQuestions,
  };
}

/**
 * Mirrors src/site/_includes/components/Vi.js: replaces each
 * {% vi %}...{% endvi %} block with the same `.lesson-vi` HTML structure.
 */
export function parseViBlocks(rawMarkdown) {
  return rawMarkdown.replace(
    /\{%\s*vi\s*%\}([\s\S]*?)\{%\s*endvi\s*%\}/g,
    (_, viContent) => {
      const rendered = md.render(viContent.trim());
      return (
        `<div class="lesson-vi" lang="vi">` +
        `<span class="lesson-vi__label" aria-hidden="true">🇻🇳 Tiếng Việt</span>` +
        `<div class="lesson-vi__body flow">${rendered}</div>` +
        `</div>`
      );
    },
  );
}

/**
 * Extracts raw Shadowing passage text and its Vietnamese translation.
 */
export function extractShadowing(rawContent) {
  const match = rawContent.match(
    /## Shadowing passage[^\n]*\n+> ([\s\S]*?)(?=\n\n(?:\{%|\S)|\n\{%|\n##|\n---|$)/i,
  );
  let passage = '';
  if (match) {
    passage = match[1]
      .split('\n')
      .map((line) => line.replace(/^>\s*/, '').trim())
      .join(' ')
      .trim();
  }

  // Extract translation inside {% vi %} immediately following shadowing
  let viTranslation = '';
  const viMatch = rawContent.match(
    /## Shadowing passage[\s\S]*?\{%\s*vi\s*%\}([\s\S]*?)\{%\s*endvi\s*%\}/i,
  );
  if (viMatch) {
    viTranslation = viMatch[1].trim();
  }

  return {passage, viTranslation};
}

/**
 * Extracts Key Phrases / Vocabulary table.
 */
export function extractVocabulary(rawContent) {
  const vocab = [];
  const tableMatch = rawContent.match(
    /## (?:Key phrases|Key vocabulary|📖 Key Vocabulary|Phrases|Từ vựng)[^\n]*\n+([\s\S]*?)(?=\n##|\n---|$)/i,
  );
  if (!tableMatch) return vocab;

  const lines = tableMatch[1].split('\n').filter((l) => l.trim().startsWith('|'));
  // Skip header and separator
  for (let i = 2; i < lines.length; i++) {
    const cols = lines[i]
      .split('|')
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

    if (cols.length >= 2) {
      const word = cols[0].replace(/\*\*/g, '').replace(/["']/g, '').trim();
      const secondCol = cols[1] ? cols[1].trim() : '';
      const thirdCol = cols[2] ? cols[2].trim() : '';

      // If 3 columns (Term, IPA/Listen, Note)
      if (cols.length >= 3) {
        const ipaMatch = secondCol.match(/\/([^/]+)\//);
        const ipa = ipaMatch ? `/${ipaMatch[1]}/` : '';
        vocab.push({
          word,
          ipa: ipa || (secondCol.startsWith('[Nghe') ? '' : secondCol),
          note: thirdCol,
        });
      } else {
        // 2 columns (English phrase, Vietnamese context)
        vocab.push({
          word,
          ipa: '',
          note: secondCol,
        });
      }
    }
  }
  return vocab;
}

/**
 * Extracts Grammar points.
 */
export function extractGrammar(rawContent) {
  const grammar = [];
  const sectionMatch = rawContent.match(
    /## (?:Key grammar|🧠 Key Grammar)[^\n]*\n+([\s\S]*?)(?=\n##|\n---|$)/i,
  );
  if (!sectionMatch) return grammar;

  const subsections = sectionMatch[1].split(/###\s+/);
  for (const sub of subsections) {
    if (!sub.trim()) continue;
    const lines = sub.trim().split('\n');
    const title = lines[0].trim();
    const body = lines.slice(1).join('\n').trim();
    grammar.push({title, body});
  }
  return grammar;
}

/**
 * Extracts Sentence Patterns.
 */
export function extractSentencePatterns(rawContent) {
  const patterns = [];
  const sectionMatch = rawContent.match(
    /## (?:Key sentence patterns|💬 Key Sentence Patterns)[^\n]*\n+([\s\S]*?)(?=\n##|\n---|$)/i,
  );
  if (!sectionMatch) return patterns;

  const lines = sectionMatch[1].split('\n');
  let currentPattern = null;

  for (const line of lines) {
    const boldMatch = line.match(/^\d+\.\s+\*\*(.*?)\*\*:?\s*(.*)$/);
    if (boldMatch) {
      if (currentPattern) patterns.push(currentPattern);
      currentPattern = {
        title: boldMatch[1].trim(),
        formula: boldMatch[2].trim(),
        examples: [],
      };
    } else if (line.trim().startsWith('*Example:*') || line.trim().startsWith('- *Example:*')) {
      if (currentPattern) {
        currentPattern.examples.push(
          line.replace(/^[-*]\s*\*Example:\*\s*/, '').replace(/["']/g, '').trim(),
        );
      }
    }
  }
  if (currentPattern) patterns.push(currentPattern);
  return patterns;
}

/**
 * Extracts Exam Questions.
 */
export function extractExamQuestions(rawContent, fallbackTitle = '', fallbackGoal = '') {
  const questions = [];
  const sectionMatch = rawContent.match(
    /## (?:Lesson Exam|📝 Lesson Exam|Quiz|Practice questions)[^\n]*\n+([\s\S]*?)(?=\n##\s+(?:📚|References)|$)/i,
  );

  if (sectionMatch) {
    const rawSection = sectionMatch[1];
    const qBlocks = rawSection.split(/\d+\.\s+\*\*/);

    for (let i = 1; i < qBlocks.length; i++) {
      const block = qBlocks[i];
      const qTextMatch = block.match(/^(.*?)\*\*/);
      const qText = qTextMatch ? qTextMatch[1].trim() : '';

      const options = [];
      const optMatches = [...block.matchAll(/-\s+\(([A-D])\)\s+(.*?)(?=\n-|\n\s*\*\(Correct|$)/g)];
      for (const m of optMatches) {
        options.push({key: m[1], text: m[2].trim()});
      }

      const answerMatch = block.match(/\*\(Correct Answer:\s*([A-D])\)\*/i);
      const correctAnswer = answerMatch ? answerMatch[1] : (options[0]?.key || 'A');

      if (qText && options.length > 0) {
        questions.push({
          question: qText,
          options,
          correctAnswer,
        });
      }
    }
  }

  // Fallback intelligent questions if lesson has none explicitly defined in markdown
  if (questions.length === 0) {
    questions.push({
      question: `Trọng tâm và mục tiêu chính của bài học "${fallbackTitle}" là gì?`,
      options: [
        {key: 'A', text: fallbackGoal || 'Thực hành phát âm chuẩn tự nhiên và làm chủ cấu trúc câu.'},
        {key: 'B', text: 'Chỉ đọc lướt qua mà không cần luyện tập.'},
        {key: 'C', text: 'Dịch từng từ sang tiếng Việt mà không cần phản xạ.'},
      ],
      correctAnswer: 'A',
    });
    questions.push({
      question: 'Phương pháp Shadowing hiệu quả nhất đòi hỏi bạn phải làm gì?',
      options: [
        {key: 'A', text: 'Nghe và nhắc lại theo nhịp điệu, ngữ điệu và trọng âm câu gần như cùng lúc với audio.'},
        {key: 'B', text: 'Chỉ đọc thầm trong đầu.'},
        {key: 'C', text: 'Tắt âm thanh và tự đọc theo ý mình.'},
      ],
      correctAnswer: 'A',
    });
  }

  return questions;
}

/**
 * Extracts Reference Resources links.
 */
export function extractReferences(rawContent) {
  const refs = [];
  const sectionMatch = rawContent.match(
    /## (?:References|📚 References|Deep-Dive Resources|Tài liệu tham khảo)[^\n]*\n+([\s\S]*?)(?=\n##|$)/i,
  );
  if (!sectionMatch) return refs;

  const linkMatches = [...sectionMatch[1].matchAll(/-\s+(?:🔗\s*)?\[(.*?)\]\((.*?)\)/g)];
  for (const m of linkMatches) {
    refs.push({
      title: m[1].trim(),
      url: m[2].trim(),
    });
  }
  return refs;
}

/**
 * meta.yml stores title/description as "i18n.courses.<key>.<field>"
 */
export function resolveI18nRef(value, i18nCourses) {
  const prefix = 'i18n.courses.';
  if (typeof value !== 'string' || !value.startsWith(prefix)) {
    return value;
  }
  const [key, field] = value.slice(prefix.length).split('.');
  return i18nCourses[key]?.[field]?.en ?? value;
}

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function toISO(date) {
  return date.toISOString().slice(0, 10);
}

function loadI18nCourses() {
  return yaml.load(fs.readFileSync(I18N_COURSES_PATH, 'utf8'));
}

function loadTopicMeta(i18nCourses) {
  const meta = {};
  for (const slug of fs.readdirSync(COURSES_DATA_DIR)) {
    const metaPath = path.join(COURSES_DATA_DIR, slug, 'meta.yml');
    if (!fs.existsSync(metaPath)) continue;
    const parsed = yaml.load(fs.readFileSync(metaPath, 'utf8'));
    meta[slug] = {
      highlight: parsed.highlight || 'purple',
      type: parsed.type || 'tech',
      title: resolveI18nRef(parsed.title, i18nCourses),
      description: resolveI18nRef(parsed.description, i18nCourses),
    };
  }
  return meta;
}

const TOPIC_11_FILES = [
  {file: 'morning-routine.md', day: 243, lessonNum: '001', title: 'Group 1 — Morning Routine'},
  {file: 'school.md', day: 244, lessonNum: '002', title: 'Group 2 — School Drop-off & Pick-up'},
  {file: 'mealtime.md', day: 245, lessonNum: '003', title: 'Group 3 — Mealtime'},
  {file: 'tidying-discipline.md', day: 246, lessonNum: '004', title: 'Group 4 — Tidying & Discipline'},
  {file: 'asking-help.md', day: 247, lessonNum: '005', title: 'Group 5 — Asking for Help & Cooperation'},
  {file: 'playtime.md', day: 248, lessonNum: '006', title: 'Group 6 — Playtime & Outdoor'},
  {file: 'bedtime.md', day: 249, lessonNum: '007', title: 'Group 7 — Bedtime Routine'},
  {file: 'encouragement.md', day: 250, lessonNum: '008', title: 'Group 8 — Encouragement & Emotional Support'},
];

const PRONUNCIATION_FILES = [
  {file: 'how-to-shadow-without-ipa.md', day: 251, lessonNum: '001', title: 'Foundation — How to Shadow without IPA'},
  {file: 'sound-1-final-consonants.md', day: 252, lessonNum: '002', title: 'Sound 1 — Phụ âm cuối từ (Final Consonants)'},
  {file: 'sound-2-th.md', day: 253, lessonNum: '003', title: 'Sound 2 — Âm TH (/θ/ và /ð/)'},
  {file: 'sound-3-ae-vowel.md', day: 254, lessonNum: '004', title: 'Sound 3 — Nguyên âm /æ/'},
  {file: 'sound-4-schwa.md', day: 255, lessonNum: '005', title: 'Sound 4 — Âm Schwa (/ə/)'},
  {file: 'sound-5-word-stress.md', day: 256, lessonNum: '006', title: 'Sound 5 — Trọng âm từ (Word Stress)'},
  {file: 'sound-6-ed-endings.md', day: 257, lessonNum: '007', title: 'Sound 6 — Đuôi -ed (/t/, /d/, /ɪd/)'},
  {file: 'sound-7-v-vs-w.md', day: 258, lessonNum: '008', title: 'Sound 7 — Cặp âm /v/ và /w/'},
];

function buildSpecialLessons(topicSlug, filesConfig, meta) {
  const specialLessons = [];
  const topicDir = path.join(CONTENT_DIR, topicSlug);
  if (!fs.existsSync(topicDir)) return specialLessons;

  for (const cfg of filesConfig) {
    const filePath = path.join(topicDir, cfg.file);
    if (!fs.existsSync(filePath)) continue;

    const raw = fs.readFileSync(filePath, 'utf8');
    const {data: frontMatter, content} = matter(raw);

    const title = cfg.title || frontMatter.title || '';
    const dayNum = cfg.day;
    const lessonNum = cfg.lessonNum;

    let {passage: shadowingPassage, viTranslation: shadowingVi} = extractShadowing(content);
    let vocabulary = extractVocabulary(content);
    const grammar = extractGrammar(content);
    const sentencePatterns = extractSentencePatterns(content);

    // If shadowing passage is not formatted with ## Shadowing passage, construct it from table of phrases or content
    if (!shadowingPassage) {
      if (vocabulary.length > 0) {
        shadowingPassage = vocabulary.map((v) => v.word.replace(/[".]/g, '') + '.').join(' ');
        shadowingVi = vocabulary.map((v) => v.note.replace(/[".]/g, '') + '.').join(' ');
      } else {
        const sentences = content
          .replace(/#+ [^\n]+/g, '')
          .replace(/\|[^\n]+\|/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .split('\n')
          .map((s) => s.trim())
          .filter((s) => s.length > 20 && !s.startsWith('-') && !s.startsWith('*'));
        shadowingPassage = sentences.slice(0, 5).join(' ');
      }
    }

    const examQuestions = extractExamQuestions(content, title, frontMatter.description || '');
    const references = extractReferences(content);
    const overview = extractOverview(content, frontMatter, topicSlug, lessonNum);
    const bodyHtml = md.render(parseViBlocks(content));

    specialLessons.push({
      day: dayNum,
      date: toISO(addDays(PROGRAM_START, dayNum - 1)),
      topicSlug,
      topicTitle: meta.title,
      topicDescription: meta.description || '',
      topicHighlight: meta.highlight || (topicSlug === 'pronunciation-guide' ? 'orange' : 'green'),
      topicType: meta.type || 'english',
      lessonNum,
      title: `Day ${dayNum} — ${title}`,
      shortTitle: title.replace(/^Day\s+\d+\s*[—\-–—]\s*/iu, ''),
      description: frontMatter.description || '',
      bodyHtml,
      shadowingPassage: shadowingPassage || frontMatter.description || '',
      shadowingVi: shadowingVi || '',
      vocabulary,
      grammar,
      sentencePatterns,
      examQuestions,
      references,
      overview,
    });
  }

  return specialLessons;
}

export function buildLessons(topicMeta) {
  const lessons = [];

  for (const topicSlug of fs.readdirSync(CONTENT_DIR)) {
    const topicDir = path.join(CONTENT_DIR, topicSlug);
    if (!fs.statSync(topicDir).isDirectory()) continue;

    const meta = topicMeta[topicSlug] || {
      highlight: 'purple',
      type: 'tech',
      title: topicSlug,
      description: '',
    };

    // Handle special topics
    if (topicSlug === 'topic-11-daily-with-kids') {
      const topic11Lessons = buildSpecialLessons(topicSlug, TOPIC_11_FILES, meta);
      lessons.push(...topic11Lessons);
      continue;
    }

    if (topicSlug === 'pronunciation-guide') {
      const pronunLessons = buildSpecialLessons(topicSlug, PRONUNCIATION_FILES, meta);
      lessons.push(...pronunLessons);
      continue;
    }

    const lessonFiles = fs
      .readdirSync(topicDir)
      .filter((f) => /^lesson-\d+\.md$/.test(f))
      .sort();

    for (const file of lessonFiles) {
      const raw = fs.readFileSync(path.join(topicDir, file), 'utf8');
      const {data: frontMatter, content} = matter(raw);
      const lessonNum = file.replace('lesson-', '').replace('.md', '');
      const dayNum = extractDayNumber(frontMatter.title || '', topicSlug, lessonNum);
      if (!dayNum) {
        console.warn(
          `build-content: skipping ${topicSlug}/${file} — title has no "Day N" prefix`,
        );
        continue;
      }

      const bodyHtml = md.render(parseViBlocks(content));

      const {passage: shadowingPassage, viTranslation: shadowingVi} =
        extractShadowing(content);
      const vocabulary = extractVocabulary(content);
      const grammar = extractGrammar(content);
      const sentencePatterns = extractSentencePatterns(content);
      const examQuestions = extractExamQuestions(
        content,
        frontMatter.title || '',
        frontMatter.description || '',
      );
      const references = extractReferences(content);
      const overview = extractOverview(content, frontMatter, topicSlug, lessonNum);

      lessons.push({
        day: dayNum,
        date: toISO(addDays(PROGRAM_START, dayNum - 1)),
        topicSlug,
        topicTitle: meta.title,
        topicDescription: meta.description || '',
        topicHighlight: meta.highlight,
        topicType: meta.type,
        lessonNum,
        title: frontMatter.title || '',
        shortTitle: (frontMatter.title || '').replace(
          /^Day\s+\d+\s*[—\-–—]\s*/iu,
          '',
        ),
        description: frontMatter.description || '',
        bodyHtml,
        shadowingPassage: shadowingPassage || frontMatter.description || '',
        shadowingVi: shadowingVi || '',
        vocabulary,
        grammar,
        sentencePatterns,
        examQuestions,
        references,
        overview,
      });
    }
  }

  lessons.sort((a, b) => a.day - b.day);
  return lessons;
}

function main() {
  const i18nCourses = loadI18nCourses();
  const topicMeta = loadTopicMeta(i18nCourses);
  const lessons = buildLessons(topicMeta);

  if (lessons.length === 0) {
    throw new Error(
      `build-content: parsed 0 lessons from ${CONTENT_DIR} — check the content directory path.`,
    );
  }

  fs.mkdirSync(path.dirname(OUT_PATH), {recursive: true});
  fs.writeFileSync(
    OUT_PATH,
    JSON.stringify({programStart: toISO(PROGRAM_START), lessons}, null, 2),
  );
  console.log(`build-content: wrote ${lessons.length} lessons to ${OUT_PATH}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
