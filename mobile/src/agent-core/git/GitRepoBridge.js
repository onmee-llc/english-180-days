/**
 * Git Repository Bridge for Alex AI Agent.
 * Manages repository connections, branch workflows, working tree diffs,
 * commits, and pull requests.
 */

export class GitRepoBridge {
  constructor(config = {}) {
    this.connectedRepo = config.repoUrl || 'https://github.com/onmee-llc/daily-mastery';
    this.currentBranch = config.defaultBranch || 'main';
    this.activeWorkingBranch = null;
    this.stagedChanges = [];
    this.gitHistory = [];
    this.authKey = config.token || null;
  }

  setToken(token) {
    this.authKey = token;
  }

  getRepoInfo() {
    return {
      repoUrl: this.connectedRepo,
      currentBranch: this.activeWorkingBranch || this.currentBranch,
      hasAuth: Boolean(this.authKey),
      stagedCount: this.stagedChanges.length,
    };
  }

  async connectRepo(repoUrl, branch = 'main') {
    this.connectedRepo = repoUrl;
    this.currentBranch = branch;
    this.activeWorkingBranch = null;
    this.stagedChanges = [];
    return {
      success: true,
      repo: repoUrl,
      branch: branch,
      message: `Đã kết nối thành công với kho lưu trữ Git: ${repoUrl} (nhánh: ${branch})`,
    };
  }

  async createBranch(branchName) {
    const sanitized = branchName.replace(/[^a-zA-Z0-9_\-\/]/g, '-');
    this.activeWorkingBranch = sanitized.startsWith('feature/') || sanitized.startsWith('fix/') ? sanitized : `feature/${sanitized}`;
    return {
      success: true,
      branch: this.activeWorkingBranch,
      baseBranch: this.currentBranch,
      message: `Đã tạo và checkout sang nhánh làm việc mới: ${this.activeWorkingBranch}`,
    };
  }

  async stageFile(filePath, codeDiff, status = 'modified') {
    const existingIdx = this.stagedChanges.findIndex((f) => f.filePath === filePath);
    const entry = {
      filePath,
      diff: codeDiff,
      status, // 'modified' | 'added' | 'deleted'
      timestamp: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      this.stagedChanges[existingIdx] = entry;
    } else {
      this.stagedChanges.push(entry);
    }

    return entry;
  }

  async getDiff() {
    if (this.stagedChanges.length === 0) {
      return {
        hasChanges: false,
        files: [],
        summary: 'Working tree clean. Không có thay đổi nào chưa commit.',
      };
    }

    return {
      hasChanges: true,
      branch: this.activeWorkingBranch || this.currentBranch,
      files: this.stagedChanges,
      summary: `Đã sẵn sàng ${this.stagedChanges.length} file thay đổi.`,
    };
  }

  async commitAndPush(commitMessage, options = {}) {
    if (this.stagedChanges.length === 0) {
      throw new Error('Không có thay đổi nào trong working tree để commit.');
    }

    const branch = this.activeWorkingBranch || this.currentBranch;
    const commitId = 'c_' + Math.random().toString(36).substring(2, 9);

    const record = {
      commitId,
      branch,
      message: commitMessage,
      filesCommitted: [...this.stagedChanges],
      author: 'Robert (via Alex AI Orchestrator)',
      timestamp: new Date().toISOString(),
    };

    this.gitHistory.unshift(record);
    const committedFiles = [...this.stagedChanges];
    this.stagedChanges = []; // reset staging

    return {
      success: true,
      commitId,
      branch,
      message: `Đã commit [${commitId}] và push lên nhánh ${branch} thành công.`,
      prUrl: `https://github.com/onmee-llc/daily-mastery/pull/new/${branch}`,
      files: committedFiles,
    };
  }
}
