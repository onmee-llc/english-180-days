import {LLMClient} from './LLMClient.js';
import {ToolRegistry, createDefaultToolRegistry} from './ToolRegistry.js';
import {MemoryStore} from './MemoryStore.js';
import {ConcurrentTaskEngine, TASK_PRIORITY} from './ConcurrentTaskEngine.js';
import {AGENT_PERSONAS} from './AgentPersonas.js';
import {GitRepoBridge} from './git/GitRepoBridge.js';
import {CodingAgentOrchestrator} from './coding/CodingAgentOrchestrator.js';
import {DailyBriefingEngine} from './DailyBriefingEngine.js';
import {MCPClientBridge} from './mcp/MCPClientBridge.js';
import {AdaptiveLearningEngine} from './AdaptiveLearningEngine.js';
import {DecisionJournalStore} from './decisions/DecisionJournalStore.js';

/**
 * AgentRuntime: The central brain coordinating LLM generation,
 * tool execution loops, memory persistence, briefing generation,
 * MCP host bridging, decisions table reasoning, and concurrent background workers.
 */
export class AgentRuntime {
  /**
   * @param {Object} options
   * @param {string} [options.apiKey]
   * @param {boolean} [options.mockMode]
   * @param {Array} [options.contentLessons]
   * @param {Object} [options.masteryStore]
   * @param {string} [options.gitRepoUrl]
   * @param {Object} [options.briefingPreferences]
   */
  constructor(options = {}) {
    this.memory = new MemoryStore();
    this.taskEngine = new ConcurrentTaskEngine({maxConcurrent: 3});
    this.gitBridge = new GitRepoBridge({repoUrl: options.gitRepoUrl});
    this.codingOrchestrator = new CodingAgentOrchestrator(this.gitBridge);
    this.mcpBridge = new MCPClientBridge();
    this.adaptiveEngine = new AdaptiveLearningEngine({memoryStore: this.memory});
    this.decisionJournal = new DecisionJournalStore();
    this.briefingEngine = new DailyBriefingEngine({
      memoryStore: this.memory,
      masteryStore: options.masteryStore,
      mcpBridge: this.mcpBridge,
      preferences: options.briefingPreferences,
    });

    this.tools = createDefaultToolRegistry({
      taskStore: this.memory,
      masteryStore: options.masteryStore,
      contentLessons: options.contentLessons || [],
      gitBridge: this.gitBridge,
      codingOrchestrator: this.codingOrchestrator,
      briefingEngine: this.briefingEngine,
      mcpBridge: this.mcpBridge,
      adaptiveEngine: this.adaptiveEngine,
      decisionJournal: this.decisionJournal,
    });

    this.llm = new LLMClient({
      apiKey: options.apiKey || '',
      mockMode: options.mockMode ?? false,
    });

    this.activeController = null;
    this.isStreaming = false;
  }

  getDecisionJournal() {
    return this.decisionJournal;
  }

  getBriefingEngine() {
    return this.briefingEngine;
  }

  getMcpBridge() {
    return this.mcpBridge;
  }

  getAdaptiveEngine() {
    return this.adaptiveEngine;
  }

  getGitBridge() {
    return this.gitBridge;
  }

  getCodingOrchestrator() {
    return this.codingOrchestrator;
  }

  setApiKey(key) {
    this.llm.setApiKey(key);
  }

  getMemory() {
    return this.memory;
  }

  getToolRegistry() {
    return this.tools;
  }

  getTaskEngine() {
    return this.taskEngine;
  }

  /**
   * Main turn execution method
   */
  async sendPrompt({
    channelId = 'companion',
    prompt = '',
    audioPart = null,
    mode = 'stream', // 'stream' | 'background'
    interactionMode = 'text', // 'text' | 'voice'
    onToken,
    onThinking,
    onTool,
    onComplete,
    onError,
  }) {
    const trimmedPrompt = (prompt || '').trim();
    if (!trimmedPrompt && !audioPart) return null;

    const persona = AGENT_PERSONAS[channelId] || AGENT_PERSONAS.companion;

    // 1. Save user message to thread
    const userMsg = this.memory.addMessage(channelId, {
      role: 'user',
      content: trimmedPrompt || '(Voice input recorded)',
    });

    // 2. Handle Background Task Mode (Async Job)
    if (mode === 'background') {
      const backgroundJob = this.taskEngine.dispatch({
        title: `Phân tích: "${trimmedPrompt.slice(0, 45)}..."`,
        type: channelId.toUpperCase(),
        priority: TASK_PRIORITY.MEDIUM,
        executor: async ({updateProgress, signal}) => {
          updateProgress(20, 'Đang chuẩn bị ngữ cảnh...');
          await new Promise((r) => setTimeout(r, 600));
          if (signal.aborted) return;

          updateProgress(50, 'Đang suy luận & tổng hợp dữ liệu...');
          let accumulated = '';
          for await (const chunk of this.llm.stream({
            prompt: trimmedPrompt,
            systemInstruction: persona.systemPrompt,
            signal,
            interactionMode,
          })) {
            if (chunk.text) accumulated += chunk.text;
          }

          updateProgress(90, 'Đang hoàn tất kết quả...');
          await new Promise((r) => setTimeout(r, 400));
          updateProgress(100, 'Hoàn thành tác vụ');

          // Add completed agent message to thread
          this.memory.addMessage(channelId, {
            role: 'model',
            content: accumulated,
            actionCards: [
              {
                type: 'BACKGROUND_COMPLETED',
                title: 'Tác vụ chạy nền đã hoàn thành',
                jobId: backgroundJob.id,
              },
            ],
            telemetry: {source: 'background_worker'},
          });

          return {content: accumulated};
        },
      });

      // Add immediate acknowledgment card
      const ackMsg = this.memory.addMessage(channelId, {
        role: 'model',
        content: `Đã đưa tác vụ vào hàng đợi chạy nền (Job ID: \`${backgroundJob.id}\`). Bạn có thể tiếp tục trò chuyện bình thường trong lúc tác vụ đang được xử lý!`,
        actionCards: [
          {
            type: 'TASK_QUEUED',
            jobId: backgroundJob.id,
            title: backgroundJob.title,
          },
        ],
      });

      if (onComplete) onComplete(ackMsg);
      return ackMsg;
    }

    // 3. Handle Interactive Streaming Mode
    this.activeController = new AbortController();
    this.isStreaming = true;

    // Detect if prompt implies automatic tool execution
    const detectedTools = interactionMode === 'voice' ? [] : this._detectToolTriggers(trimmedPrompt, channelId);

    // Initial placeholder message for the model
    const modelMsg = this.memory.addMessage(channelId, {
      role: 'model',
      content: '',
      thinking: detectedTools.length > 0 ? 'Đang phân tích ý định và kích hoạt tools...' : null,
      toolsExecuted: [],
      actionCards: [],
    });

    try {
      // Execute any pre-flight detected tools
      const executedTools = [];
      const generatedCards = [];

      for (const t of detectedTools) {
        if (onThinking) onThinking(`⚡ Đang thực thi công cụ: ${t.name}...`);
        const toolResult = await this.tools.execute(t.name, t.args);
        executedTools.push(toolResult);
        if (onTool) onTool(toolResult);

        // Generate action card if tool produces actionable widget
        if (t.name === 'manage_tasks' && toolResult.result?.created) {
          generatedCards.push({
            type: 'TASK_LIST',
            tasks: [toolResult.result.created],
          });
        }
      }

      // Ingest interaction into adaptive learning engine
      this.adaptiveEngine.ingestInteraction(trimmedPrompt);

      // Prepare context: Base system instruction (voice vs text) + User Profile + Style
      const baseInstruction = (interactionMode === 'voice' && persona.voiceCallSystemPrompt)
        ? persona.voiceCallSystemPrompt
        : persona.systemPrompt;
      const profile = this.memory.getProfile();
      const styleAugmentation = this.adaptiveEngine.generateStyleAugmentation();
      const decisionsContext = interactionMode === 'voice' ? '' : this.decisionJournal.formatDecisionsForContext(trimmedPrompt);
      const systemInstruction = `${baseInstruction}\n\n[USER CONTEXT]\nUser Name: ${profile.name}\nRole: ${profile.title}\nActive Goals: ${profile.goals.join(', ')}${styleAugmentation}${decisionsContext}`;

      // Fetch recent messages for context
      const threadHistory = this.memory.getThreadMessages(channelId)
        .slice(-6, -1) // Exclude current empty model placeholder
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{text: m.content || ''}],
        }));

      let accumulated = '';
      let telemetryData = null;

      for await (const chunk of this.llm.stream({
        prompt: trimmedPrompt,
        audioPart,
        systemInstruction,
        history: threadHistory,
        signal: this.activeController.signal,
        interactionMode,
      })) {
        if (chunk.text) {
          accumulated += chunk.text;
          this.memory.updateMessage(channelId, modelMsg.id, {
            content: accumulated,
            thinking: null,
            toolsExecuted: executedTools,
            actionCards: generatedCards,
          });

          if (onToken) {
            onToken({
              text: chunk.text,
              accumulated,
              telemetry: chunk.telemetry,
            });
          }
        }

        if (chunk.isFinal) {
          telemetryData = chunk.telemetry;
        }
      }

      const finalMsg = this.memory.updateMessage(channelId, modelMsg.id, {
        content: accumulated,
        thinking: null,
        toolsExecuted: executedTools,
        actionCards: generatedCards,
        telemetry: telemetryData,
      });

      this.isStreaming = false;
      if (onComplete) onComplete(finalMsg);
      return finalMsg;
    } catch (err) {
      this.isStreaming = false;
      if (err.name === 'AbortError') {
        this.memory.updateMessage(channelId, modelMsg.id, {
          content: modelMsg.content + ' *(Đã dừng phản hồi theo yêu cầu)*',
        });
        return;
      }

      const errorMsg = `Rất tiếc, đã có lỗi xảy ra: ${err.message}`;
      this.memory.updateMessage(channelId, modelMsg.id, {
        content: errorMsg,
      });
      if (onError) onError(err);
    }
  }

  abortActiveStream() {
    if (this.activeController) {
      this.activeController.abort();
      this.isStreaming = false;
    }
  }

  _detectToolTriggers(prompt, channelId) {
    const p = prompt.toLowerCase();
    const tools = [];

    if (p.includes('tạo task') || p.includes('thêm việc') || p.includes('kế hoạch')) {
      tools.push({
        name: 'manage_tasks',
        args: {
          action: 'create',
          title: prompt.replace(/tạo task|thêm việc|hãy|cho tôi/gi, '').trim() || 'Nhiệm vụ mới',
          category: channelId === 'english' ? 'english' : 'work',
        },
      });
    }

    if (p.includes('xp') || p.includes('streak') || p.includes('điểm')) {
      tools.push({
        name: 'mastery_tracker',
        args: {action: 'get_stats'},
      });
    }

    if (p.includes('báo cáo') || p.includes('tóm tắt hôm nay') || p.includes('briefing')) {
      tools.push({
        name: 'generate_daily_briefing',
        args: {},
      });
    }

    if (p.includes('thị trường') || p.includes('giá btc') || p.includes('crypto') || p.includes('market')) {
      tools.push({
        name: 'query_market_insights',
        args: {},
      });
    }

    if (p.includes('quyết định') || p.includes('chốt') || p.includes('lựa chọn') || p.includes('tradeoff')) {
      tools.push({
        name: 'query_past_decisions',
        args: {query: p},
      });
    }

    return tools;
  }
}
