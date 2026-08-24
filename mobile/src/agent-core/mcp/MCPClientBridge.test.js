import {describe, it, expect} from 'vitest';
import {MCPClientBridge, MCP_SERVERS} from './MCPClientBridge.js';

describe('MCPClientBridge', () => {
  it('registers and lists default MCP servers and tools', () => {
    const bridge = new MCPClientBridge();
    const servers = bridge.listServers();

    expect(servers.length).toBeGreaterThanOrEqual(5);
    expect(servers.some((s) => s.id === MCP_SERVERS.WORKSPACE)).toBe(true);
    expect(servers.some((s) => s.id === MCP_SERVERS.GITHUB)).toBe(true);
    expect(servers.some((s) => s.id === MCP_SERVERS.MARKET)).toBe(true);

    const tools = bridge.listAllTools();
    expect(tools.some((t) => t.toolName === 'get_calendar_events')).toBe(true);
    expect(tools.some((t) => t.toolName === 'list_pull_requests')).toBe(true);
    expect(tools.some((t) => t.toolName === 'get_macro_indices')).toBe(true);
  });

  it('executes tool calls with valid JSON-RPC 2.0 structure', async () => {
    const bridge = new MCPClientBridge();

    const res = await bridge.callTool(MCP_SERVERS.MARKET, 'get_macro_indices', {});
    expect(res.jsonrpc).toBe('2.0');
    expect(res.id).toBeDefined();
    expect(res.result).toBeDefined();
    expect(res.result.indices.length).toBeGreaterThan(0);
  });

  it('returns appropriate JSON-RPC errors for unknown servers or tools', async () => {
    const bridge = new MCPClientBridge();

    const badServer = await bridge.callTool('mcp/unknown', 'test', {});
    expect(badServer.error).toBeDefined();
    expect(badServer.error.code).toBe(-32601);

    const badTool = await bridge.callTool(MCP_SERVERS.WORKSPACE, 'unknown_tool', {});
    expect(badTool.error).toBeDefined();
    expect(badTool.error.code).toBe(-32601);
  });
});
