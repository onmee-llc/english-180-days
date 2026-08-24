import {describe, it, expect, beforeEach} from 'vitest';
import {CodingAgentOrchestrator, CODING_ENGINES} from './CodingAgentOrchestrator.js';
import {GitRepoBridge} from '../git/GitRepoBridge.js';

describe('CodingAgentOrchestrator', () => {
  let orchestrator;
  let git;

  beforeEach(() => {
    git = new GitRepoBridge();
    orchestrator = new CodingAgentOrchestrator(git);
  });

  it('lists supported coding engines (Antigravity, Claude Code, Codex)', () => {
    const engines = orchestrator.getEngines();
    expect(engines.length).toBe(3);
    expect(engines.map((e) => e.id)).toContain('antigravity');
    expect(engines.map((e) => e.id)).toContain('claude_code');
    expect(engines.map((e) => e.id)).toContain('codex');
  });

  it('dispatches a coding task and generates diffs for git staging', async () => {
    const progressUpdates = [];
    const res = await orchestrator.dispatchTask({
      engine: 'antigravity',
      taskTitle: 'Refactor Agent Stream Service',
      prompt: 'Optimize token streaming and error handling',
      targetFiles: ['src/services/AgentService.js'],
      branchName: 'refactor-agent-stream',
      onProgress: (p) => progressUpdates.push(p),
    });

    expect(res.success).toBe(true);
    expect(res.engine.id).toBe('antigravity');
    expect(res.diff).toBeDefined();
    expect(res.diff.file).toBe('src/services/AgentService.js');
    expect(progressUpdates.length).toBeGreaterThan(1);

    const gitDiff = await git.getDiff();
    expect(gitDiff.hasChanges).toBe(true);
    expect(gitDiff.files[0].filePath).toBe('src/services/AgentService.js');
  });
});
