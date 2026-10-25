import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const NYXO_YAML = `# ==============================================
# NYXO CLUSTER ORCHESTRATION CONFIGURATION (v2.4)
# ==============================================
cluster:
  name: "production-swarm"
  version: "2.4.0"
  agents:
    - id: "agent-01-architect"
      role: "lead-architect"
      model: "claude-3-7-sonnet"
      capabilities: ["ast-analysis", "dag-decomposition", "arbiter"]
    - id: "agent-02-backend"
      role: "core-engineer"
      model: "gemini-2-5-flash"
      worktree: "agent/worktree-backend"
    - id: "agent-03-frontend"
      role: "ui-presentation"
      model: "gemini-2-5-flash"
      worktree: "agent/worktree-frontend"
    - id: "agent-04-qa"
      role: "test-automator"
      model: "gemini-2-5-flash"
      worktree: "agent/worktree-qa"
    - id: "agent-05-security"
      role: "security-auditor"
      model: "claude-3-5-haiku"
    - id: "agent-06-release"
      role: "contracts-release"
      model: "gemini-2-5-flash"

blackboard:
  transport: "ipc"
  host: "127.0.0.1"
  port: 9092
  syncIntervalMs: 14
  diffCompression: true

locking:
  granularity: "ast-symbol"
  timeoutMs: 8000
  deadlockDetection: true

arbiter:
  autoMerge: true
  strategy: "fast-forward-rebase"
  requireTestSuitePass: true
  minCoverageThreshold: 90.0
`;

export default function ExportConfigModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    sound.playSuccess();
    navigator.clipboard.writeText(NYXO_YAML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sound.playSuccess();
    const blob = new Blob([NYXO_YAML], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nyxo.cluster.yaml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="export-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <div className="export-title">
            <FileCode size={18} className="text-cyan" />
            <span>Export Production Swarm Blueprint</span>
          </div>
          <button className="drawer-close-btn hover-target" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="export-body">
          <div className="export-meta-note">
            This configuration file boots an identical 6-agent clustered swarm with AST fine-locking, IPC shared blackboard, and autonomous merge arbiter.
          </div>
          <pre className="export-code-block">
            <code>{NYXO_YAML}</code>
          </pre>
        </div>

        <div className="export-footer">
          <button className="btn btn-secondary hover-target" onClick={handleDownload}>
            <Download size={14} />
            <span>Download nyxo.cluster.yaml</span>
          </button>
          <button className="btn btn-primary hover-target" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy YAML Spec'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
