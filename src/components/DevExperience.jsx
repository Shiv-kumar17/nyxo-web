import React, { useState } from 'react';
import { Terminal, FileCode } from 'lucide-react';

export default function DevExperience() {
  const [activeTab, setActiveTab] = useState('cli');

  return (
    <section className="section-devex" id="devex">
      <div className="section-container">
        <div className="devex-info">
          <div className="section-badge">DEVELOPER EXPERIENCE</div>
          <h2 className="section-title">Designed for Engineers Who Move at Warp Speed</h2>
          <p className="section-subtitle">
            Whether you invoke Nyxo from your terminal or open the IDE companion sidecar, your cluster feels like a tireless 6-person staff engineering team sitting beside you.
          </p>

          <div className="devex-features">
            <div className="devex-item hover-target">
              <div className="devex-num">01</div>
              <div>
                <h4>Single Command Initialization</h4>
                <p>Type <code>nyxo cluster up</code>. Nyxo reads your repo, maps the AST, allocates agent roles, and binds to your local IDE.</p>
              </div>
            </div>

            <div className="devex-item hover-target">
              <div className="devex-num">02</div>
              <div>
                <h4>Interactive Human-in-the-Loop Intercepts</h4>
                <p>Whenever high-level architectural trade-offs arise, the Lead Orchestrator surfaces concise multi-choice decisions right in your CLI.</p>
              </div>
            </div>

            <div className="devex-item hover-target">
              <div className="devex-num">03</div>
              <div>
                <h4>Instant Time-Travel Replay</h4>
                <p>Rewind, inspect, or branch any agent's chain of thought and code generation at any nanosecond in the git log.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="devex-cli glass-card hover-target">
          <div className="cli-header">
            <div className="cli-tabs">
              <span
                className={`cli-tab ${activeTab === 'cli' ? 'active' : ''}`}
                onClick={() => setActiveTab('cli')}
              >
                <Terminal size={12} /> zsh / powershell
              </span>
              <span
                className={`cli-tab ${activeTab === 'config' ? 'active' : ''}`}
                onClick={() => setActiveTab('config')}
              >
                <FileCode size={12} /> nyxo.config.ts
              </span>
            </div>
            <div className="cli-badge">v2.4 STABLE</div>
          </div>

          {activeTab === 'cli' ? (
            <div className="cli-code-block">
              <div className="cli-line"><span className="cmd-prompt">$</span> <span className="cmd-bin">npm</span> i -g @nyxo/cluster</div>
              <div className="cli-line"><span className="cmd-prompt">$</span> <span className="cmd-bin">nyxo</span> cluster init --preset=fullstack-swarm</div>
              <div className="cli-line text-muted">✔ Scanning repository dependency tree (42 files)...</div>
              <div className="cli-line text-muted">✔ Provisioning 6 ephemeral Git worktrees...</div>
              <div className="cli-line text-muted">✔ Initializing Blackboard IPC on 127.0.0.1:9092...</div>
              <div className="cli-line text-cyan">✨ Nyxo Swarm Online: 6 Agents Ready</div>
              <div className="cli-line"><span className="cmd-prompt">$</span> <span className="cmd-bin">nyxo</span> run <span className="cmd-str">"Build production Stripe billing portal with webhooks & test harness"</span></div>
              <div className="cli-line text-green">⚡ Architect: Sub-tasks emitted [DAG: 4 nodes, 8 parallel jobs]</div>
              <div className="cli-line text-purple">⚡ Backend: Locking <code>api/stripe.go</code> [Branch: agent/backend-482]</div>
              <div className="cli-line text-yellow">⚡ QA: Generating mock webhook payload test matrix</div>
            </div>
          ) : (
            <div className="cli-code-block">
              <div className="cli-line text-purple">export default <span className="cmd-str">defineNyxoConfig</span>({'{'}</div>
              <div className="cli-line text-muted">&nbsp;&nbsp;cluster: {'{'} agents: 6, maxWorktrees: 8 {'}'},</div>
              <div className="cli-line text-muted">&nbsp;&nbsp;blackboard: {'{'} syncIntervalMs: 18, transport: 'ipc' {'}'},</div>
              <div className="cli-line text-cyan">&nbsp;&nbsp;arbiter: {'{'} autoMerge: true, requireTestPass: true {'}'},</div>
              <div className="cli-line text-green">&nbsp;&nbsp;telemetry: {'{'} streamLogs: true, webConsolePort: 3000 {'}'}</div>
              <div className="cli-line text-purple">{'}'});</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
