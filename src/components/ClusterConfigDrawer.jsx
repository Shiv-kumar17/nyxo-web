import React, { useState } from 'react';
import { X, Sliders, Cpu, Save, ShieldAlert, GitPullRequest, Layers, Activity } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function ClusterConfigDrawer({ isOpen, onClose }) {
  const [clusterSize, setClusterSize] = useState(6);
  const [architectModel, setArchitectModel] = useState('Claude 3.7 Sonnet (Reasoning)');
  const [workerModel, setWorkerModel] = useState('Gemini 2.5 Flash (Speed)');
  const [mergeStrategy, setMergeStrategy] = useState('fast-forward');
  const [lockGranularity, setLockGranularity] = useState('ast-symbol');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playSuccess();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <Sliders size={18} className="text-cyan" />
            <span>Nyxo Cluster Orchestration Settings</span>
          </div>
          <button className="drawer-close-btn hover-target" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Swarm Size */}
          <div className="config-group">
            <div className="config-label-row">
              <span className="config-title"><Cpu size={14} /> Swarm Agent Size</span>
              <span className="config-val-pill">{clusterSize} Agents</span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              value={clusterSize}
              onChange={(e) => {
                sound.playBeep(400 + e.target.value * 40, 0.02);
                setClusterSize(Number(e.target.value));
              }}
              className="config-slider"
            />
            <div className="config-subtext">
              Allocates {clusterSize} parallel Git worktrees and concurrent thread loops.
            </div>
          </div>

          {/* Model Allocation */}
          <div className="config-group">
            <label className="config-title"><Layers size={14} /> Architect / Planner Backbone</label>
            <select
              className="config-select"
              value={architectModel}
              onChange={(e) => setArchitectModel(e.target.value)}
            >
              <option>Claude 3.7 Sonnet (Reasoning)</option>
              <option>DeepSeek R1 (Chain of Thought)</option>
              <option>GPT-4o (Omni Lead)</option>
              <option>Gemini 2.5 Pro (Ultra Context)</option>
            </select>
          </div>

          <div className="config-group">
            <label className="config-title"><Activity size={14} /> Implementer / QA Swarm Backbone</label>
            <select
              className="config-select"
              value={workerModel}
              onChange={(e) => setWorkerModel(e.target.value)}
            >
              <option>Gemini 2.5 Flash (Speed)</option>
              <option>Claude 3.5 Haiku (Fast)</option>
              <option>GPT-4o-mini (Lightweight)</option>
              <option>DeepSeek V3 (Parallel Coder)</option>
            </select>
          </div>

          {/* Merge Strategy */}
          <div className="config-group">
            <label className="config-title"><GitPullRequest size={14} /> Autonomous Merge Policy</label>
            <div className="radio-options">
              <label className={`radio-pill hover-target ${mergeStrategy === 'fast-forward' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="merge"
                  checked={mergeStrategy === 'fast-forward'}
                  onChange={() => setMergeStrategy('fast-forward')}
                />
                <span>AST Fast-Forward Rebase (Strict Zero-Conflict)</span>
              </label>

              <label className={`radio-pill hover-target ${mergeStrategy === 'consensus' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="merge"
                  checked={mergeStrategy === 'consensus'}
                  onChange={() => setMergeStrategy('consensus')}
                />
                <span>Swarm Consensus (Requires 3 QA & Security Approvals)</span>
              </label>
            </div>
          </div>

          {/* Lock Granularity */}
          <div className="config-group">
            <label className="config-title"><ShieldAlert size={14} /> AST Lock Granularity</label>
            <div className="radio-options">
              <label className={`radio-pill hover-target ${lockGranularity === 'ast-symbol' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="lock"
                  checked={lockGranularity === 'ast-symbol'}
                  onChange={() => setLockGranularity('ast-symbol')}
                />
                <span>AST Symbol-Level (Method/Interface fine locks)</span>
              </label>

              <label className={`radio-pill hover-target ${lockGranularity === 'file' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="lock"
                  checked={lockGranularity === 'file'}
                  onChange={() => setLockGranularity('file')}
                />
                <span>File-Level Coarse Locks (Pessimistic)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn btn-secondary hover-target" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary hover-target" onClick={handleSave}>
            <Save size={16} />
            <span>{savedSuccess ? 'Configuration Saved!' : 'Apply Swarm Config'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
