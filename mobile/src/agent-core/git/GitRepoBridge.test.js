import {describe, it, expect, beforeEach} from 'vitest';
import {GitRepoBridge} from './GitRepoBridge.js';

describe('GitRepoBridge', () => {
  let git;

  beforeEach(() => {
    git = new GitRepoBridge({repoUrl: 'https://github.com/onmee-llc/daily-mastery'});
  });

  it('initializes with repository configuration', () => {
    const info = git.getRepoInfo();
    expect(info.repoUrl).toBe('https://github.com/onmee-llc/daily-mastery');
    expect(info.currentBranch).toBe('main');
  });

  it('creates sanitized feature branches', async () => {
    const res = await git.createBranch('add alex coding tools');
    expect(res.success).toBe(true);
    expect(res.branch).toBe('feature/add-alex-coding-tools');
  });

  it('stages file diffs and commits changes', async () => {
    await git.stageFile('src/Agent.js', '+ const alex = new AlexAgent();', 'modified');
    const diff = await git.getDiff();
    expect(diff.hasChanges).toBe(true);
    expect(diff.files.length).toBe(1);

    const commitRes = await git.commitAndPush('feat: add alex agent core');
    expect(commitRes.success).toBe(true);
    expect(commitRes.commitId).toBeDefined();
    expect(commitRes.prUrl).toContain('github.com/onmee-llc/daily-mastery');

    const cleanDiff = await git.getDiff();
    expect(cleanDiff.hasChanges).toBe(false);
  });
});
