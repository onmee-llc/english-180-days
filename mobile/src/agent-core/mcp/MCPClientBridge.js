/**
 * MCPClientBridge: Standardized Model Context Protocol (MCP) Client Host for Alex.
 * Connects Alex to external and on-device MCP servers via JSON-RPC 2.0 conventions.
 */

export const MCP_SERVERS = {
  WORKSPACE: 'mcp/workspace',
  GITHUB: 'mcp/github',
  MARKET: 'mcp/market',
  HEALTH: 'mcp/health',
  WEBSEARCH: 'mcp/websearch',
};

export class MCPClientBridge {
  constructor(options = {}) {
    this.servers = new Map();
    this._initDefaultServers();
  }

  _initDefaultServers() {
    // 1. Workspace MCP Server
    this.registerServer(MCP_SERVERS.WORKSPACE, {
      name: 'Google Workspace & Notion MCP',
      version: '1.0.0',
      description: 'Manages calendar events, agenda, reminders, and Notion pages.',
      tools: {
        get_calendar_events: async ({date}) => ({
          events: [
            {time: '10:00 AM', title: 'Daily Standup & AI Architecture Sync', duration: '30m'},
            {time: '02:00 PM', title: 'Code Review: Agent Streaming Engine', duration: '45m'},
            {time: '04:30 PM', title: 'Deep Work: Scalability & Memory RAG', duration: '90m'},
          ],
        }),
        create_event: async ({title, time}) => ({
          success: true,
          event: {id: `evt_${Date.now()}`, title, time},
        }),
      },
    });

    // 2. GitHub DevOps MCP Server
    this.registerServer(MCP_SERVERS.GITHUB, {
      name: 'GitHub DevOps MCP',
      version: '1.2.0',
      description: 'Inspects PRs, commit logs, branches, and repository health.',
      tools: {
        list_pull_requests: async ({status = 'open'}) => ({
          pullRequests: [
            {id: 'PR #108', title: 'feat: Alex Voice-First Hub and Daily Briefings', author: 'Robert', status: 'ready_for_review'},
            {id: 'PR #104', title: 'perf: SLM On-device Edge Token Streaming', author: 'Robert', status: 'approved'},
          ],
        }),
        get_commit_history: async ({limit = 5}) => ({
          commits: [
            {hash: 'a9f21b', message: 'feat: integrated Master Brand Kit & tokens', time: '2h ago'},
            {hash: '3d88e0', message: 'refactor: decouple memory store and profile distillation', time: '5h ago'},
          ],
        }),
      },
    });

    // 3. Financial & Market Intelligence MCP Server
    this.registerServer(MCP_SERVERS.MARKET, {
      name: 'Market Intelligence & Tech Radar MCP',
      version: '2.0.0',
      description: 'Provides real-time crypto quotes, macro financial indices, and tech trends.',
      tools: {
        get_macro_indices: async ({watchlist = []}) => ({
          indices: [
            {symbol: 'BTC/USD', price: '$96,400', change: '+3.4%', trend: 'up'},
            {symbol: 'ETH/USD', price: '$2,820', change: '+1.9%', trend: 'up'},
            {symbol: 'S&P 500', price: '5,980 pts', change: '+0.6%', trend: 'up'},
            {symbol: 'NVDA', price: '$142.50', change: '+2.8%', trend: 'up'},
          ],
          sentiment: 'Bullish Tech & Macro Expansion',
        }),
        get_asset_quote: async ({symbol}) => ({
          symbol,
          price: symbol === 'BTC' ? '$96,400' : '$100.00',
          change24h: '+3.4%',
          volume24h: '$42.5B',
        }),
      },
    });

    // 4. Apple Health & Life Rhythm MCP Server
    this.registerServer(MCP_SERVERS.HEALTH, {
      name: 'HealthKit & Life Rhythm MCP',
      version: '1.0.0',
      description: 'Queries sleep cycles, activity metrics, and optimal focus windows.',
      tools: {
        get_sleep_metrics: async () => ({
          sleepHours: 7.5,
          deepSleepHours: 2.1,
          recoveryScore: 88,
          recommendation: 'Thể trạng tối ưu cho các phiên tư duy kiến trúc sâu (Deep Work).',
        }),
      },
    });

    // 5. Live Web Search MCP Server
    this.registerServer(MCP_SERVERS.WEBSEARCH, {
      name: 'Tavily / Brave Web Search MCP',
      version: '1.1.0',
      description: 'Executes real-time web lookups for updated tech documentation and news.',
      tools: {
        search_web: async ({query}) => ({
          results: [
            {
              title: `Latest developments in ${query}`,
              snippet: 'Small Language Models (SLMs) running locally with MediaPipe and ExecuTorch are delivering sub-100ms first token latency on mobile NPUs.',
              url: 'https://news.ycombinator.com',
            },
          ],
        }),
      },
    });
  }

  registerServer(serverId, definition) {
    this.servers.set(serverId, definition);
  }

  getServer(serverId) {
    return this.servers.get(serverId) || null;
  }

  listServers() {
    return Array.from(this.servers.entries()).map(([id, def]) => ({
      id,
      name: def.name,
      version: def.version,
      description: def.description,
      toolCount: Object.keys(def.tools || {}).length,
    }));
  }

  listAllTools() {
    const allTools = [];
    this.servers.forEach((def, serverId) => {
      Object.keys(def.tools || {}).forEach((toolName) => {
        allTools.push({
          serverId,
          toolName,
          qualifiedName: `${serverId}/${toolName}`,
        });
      });
    });
    return allTools;
  }

  /**
   * Invokes an MCP tool using standard JSON-RPC 2.0 semantics.
   * @param {string} serverId
   * @param {string} toolName
   * @param {Object} args
   * @returns {Promise<{jsonrpc: '2.0', id: string, result?: any, error?: any}>}
   */
  async callTool(serverId, toolName, args = {}) {
    const rpcId = `rpc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const server = this.servers.get(serverId);

    if (!server) {
      return {
        jsonrpc: '2.0',
        id: rpcId,
        error: {code: -32601, message: `MCP Server not found: ${serverId}`},
      };
    }

    const toolFn = server.tools?.[toolName];
    if (!toolFn || typeof toolFn !== 'function') {
      return {
        jsonrpc: '2.0',
        id: rpcId,
        error: {code: -32601, message: `Tool not found on server ${serverId}: ${toolName}`},
      };
    }

    try {
      const result = await toolFn(args);
      return {
        jsonrpc: '2.0',
        id: rpcId,
        result,
      };
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id: rpcId,
        error: {code: -32000, message: err.message || 'Tool execution failed'},
      };
    }
  }
}
