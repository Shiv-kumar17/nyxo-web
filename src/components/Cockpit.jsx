import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play, RotateCcw, Share2, GitMerge, Lock, Check } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const INITIAL_AGENTS = [
  {
    id: 'arch',
    name: 'Agent 01: Architect',
    dotClass: 'c-arch',
    status: 'LEADER',
    badgeClass: 'leader-state',
    task: 'Decomposing OAuth2 PKCE spec into AST DAG',
    worktree: 'spec/oauth',
    metric: '98% Synced',
  },
  {
    id: 'back',
    name: 'Agent 02: Core Backend',
    dotClass: 'c-back',
    status: 'CODING',
    badgeClass: 'active-state',
    task: 'Implementing token exchange in auth/jwt.rs',
    worktree: 'Lock: auth/jwt.rs (Write)',
    metric: '+142 LOC',
  },
  {
    id: 'front',
    name: 'Agent 03: UI / Client',
    dotClass: 'c-front',
    status: 'CODING',
    badgeClass: 'active-state',
    task: 'Generating AuthProvider hook & reactive tokens',
    worktree: 'client/auth',
    metric: 'Ready for types',
  },
  {
    id: 'test',
    name: 'Agent 04: QA & Testing',
    dotClass: 'c-test',
    status: 'TESTING',
    badgeClass: 'test-state',
    task: 'Writing property fuzz tests for replay attacks',
    worktree: 'Suite: 18/18 Passing',
    metric: 'Coverage 94.2%',
  },
  {
    id: 'sec',
    name: 'Agent 05: Security Audit',
    dotClass: 'c-sec',
    status: 'AUDITING',
    badgeClass: 'sec-state',
    task: 'Inspecting entropy in secure random generator',
    worktree: 'Alerts: 0 Vulnerabilities',
    metric: 'Clean',
  },
  {
    id: 'doc',
    name: 'Agent 06: Docs & Contracts',
    dotClass: 'c-doc',
    status: 'SYNCING',
    badgeClass: 'sync-state',
    task: 'Auto-generating OpenAPI 3.1 & Swagger schemas',
    worktree: 'api/spec.json',
    metric: 'Auto-sync',
  },
];

const EVENT_POOL = [
  { agent: "Architect", color: "c-arch", msg: "Blackboard DAG updated: Split auth endpoint into /token and /introspect" },
  { agent: "Backend", color: "c-back", msg: "Acquired AST write lock on 'services/auth/token.go' (symbol: IssueToken)" },
  { agent: "UI/Client", color: "c-front", msg: "Received state broadcast: 'AuthTokenResponse' schema registered" },
  { agent: "QA/Test", color: "c-test", msg: "Running synthetic fuzz tests on issue_token_test.go... [PASS: 40/40]" },
  { agent: "Security", color: "c-sec", msg: "AST security audit: Verified cryptographically secure random entropy" },
  { agent: "Release", color: "c-doc", msg: "Auto-synced OpenAPI 3.1 specification to 'docs/api.swagger.json'" },
  { agent: "Backend", color: "c-back", msg: "Released write lock on 'services/auth/token.go'. Diff committed to worktree." },
  { agent: "Arbiter", color: "c-front", msg: "Auto-merging worktree branch 'agent/backend-482' into staging trunk [NO CONFLICTS]" },
  { agent: "Architect", color: "c-arch", msg: "Dispatched sub-task: Generate client refresh token interceptor" },
  { agent: "UI/Client", color: "c-front", msg: "Writing Axios client token interceptor in 'client/src/api/auth.ts'" },
  { agent: "QA/Test", color: "c-test", msg: "Spawning mock OAuth2 authorization server container on :9099" },
];

export default function Cockpit({ activeAgentId, onSelectAgent }) {
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState(() => EVENT_POOL.slice(0, 5).map((e, i) => ({
    ...e,
    id: i,
    time: '18:42:' + (10 + i * 2) + '.1',
  })));

  const terminalRef = useRef(null);

  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + Math.floor(now.getMilliseconds() / 100);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const randomEvent = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      setLogs((prev) => [
        ...prev.slice(-40),
        {
          ...randomEvent,
          id: Date.now() + Math.random(),
          time: getTimestamp(),
        },
      ]);
    }, 2400);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSelectAgent = (agent) => {
    sound.playLock();
    if (onSelectAgent) {
      onSelectAgent(agent.id);
    }
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        time: getTimestamp(),
        agent: 'ORCHESTRATOR',
        color: agent.dotClass,
        msg: `Focused developer inspection on ${agent.name}. Active worktree: ${agent.worktree}`,
      },
    ]);
  };

  return (
    <section className="section-cockpit" id="cockpit">
      <div className="section-header text-center">
        <div className="section-badge">INTERACTIVE COCKPIT</div>
        <h2 className="section-title">The Nyxo Swarm Control Center</h2>
        <p className="section-subtitle">
          Real-time telemetry showing 6 AI agents synchronously editing, testing, and reviewing in isolated worktrees.
        </p>
      </div>

      <div className="cockpit-container glass-card">
        {/* Sidebar: Agent Swarm List */}
        <div className="cockpit-sidebar">
          <div className="sidebar-title">
            <span>ACTIVE SWARM CLUSTER</span>
            <span className="badge-count">6 RUNNING</span>
          </div>

          <div className="agent-list">
            {INITIAL_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className={`agent-card hover-target ${activeAgentId === agent.id ? 'active' : ''}`}
                onClick={() => handleSelectAgent(agent)}
              >
                <div className="agent-header">
                  <span className={`agent-dot ${agent.dotClass}`} />
                  <span className="agent-name">{agent.name}</span>
                  <span className={`agent-status-badge ${agent.badgeClass}`}>{agent.status}</span>
                </div>
                <div className="agent-task">{agent.task}</div>
                <div className="agent-meta">
                  <span><code>{agent.worktree}</code></span>
                  <span className="agent-load">{agent.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cockpit Main Area */}
        <div className="cockpit-main">
          {/* Terminal */}
          <div className="cockpit-terminal">
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="terminal-title">nyxo-cluster-daemon --shared-context=active --blackboard-rpc</div>
              <div className="terminal-actions">
                <button
                  className="terminal-btn hover-target"
                  onClick={() => {
                    sound.playBeep(isPaused ? 600 : 400, 0.03);
                    setIsPaused(!isPaused);
                  }}
                >
                  {isPaused ? <Play size={12} /> : <Pause size={12} />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  className="terminal-btn hover-target"
                  onClick={() => {
                    sound.playBeep(450, 0.03);
                    setLogs([]);
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <div className="terminal-output" ref={terminalRef}>
              {logs.map((log) => (
                <div key={log.id} className="log-entry">
                  <span className="log-time">[{log.time}]</span>
                  <span className={`log-agent ${log.color}`}>● {log.agent}:</span>
                  <span className="log-msg">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Blackboard Monitor & Arbiter */}
          <div className="cockpit-blackboard">
            <div className="blackboard-card">
              <div className="bb-header">
                <Share2 size={16} />
                <span>Shared Context Blackboard</span>
              </div>
              <div className="bb-body">
                <div className="bb-row">
                  <span className="bb-key">Active Goal:</span>
                  <span className="bb-val highlight">Implement RFC 7636 OAuth2 PKCE Stack</span>
                </div>
                <div className="bb-row">
                  <span className="bb-key">AST Write Locks:</span>
                  <span className="badge-lock">
                    <Lock size={12} /> auth/jwt.rs (Agent 02)
                  </span>
                </div>
                <div className="bb-row">
                  <span className="bb-key">Context Token Pool:</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: '32%' }} />
                  </div>
                  <span className="bb-val">32% (Dynamic Diffing)</span>
                </div>
              </div>
            </div>

            <div className="blackboard-card">
              <div className="bb-header">
                <GitMerge size={16} />
                <span>Autonomous Merge Arbiter</span>
              </div>
              <div className="bb-body">
                <div className="merge-pipeline">
                  <div className="merge-step done">
                    <Check size={12} /> Worktree Isolation
                  </div>
                  <div className="merge-arrow">→</div>
                  <div className="merge-step done">
                    <Check size={12} /> AST Diff Analysis
                  </div>
                  <div className="merge-arrow">→</div>
                  <div className="merge-step running">
                    <span className="mini-spinner" /> Fuzz Matrix
                  </div>
                  <div className="merge-arrow">→</div>
                  <div className="merge-step pending">Fast-Forward Main</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
