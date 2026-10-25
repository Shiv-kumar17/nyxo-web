import React from 'react';
import { Database, GitBranch, Lock, ShieldCheck, Check } from 'lucide-react';

export default function ArchitectureCore() {
  const pillars = [
    {
      icon: <Database size={24} />,
      bgClass: 'c-arch-bg',
      title: 'Unified Blackboard Memory',
      desc: "Agents do not blindly dump conversational tokens into each other's windows. Instead, Nyxo maintains a living Knowledge Blackboard with semantic symbol graphs and real-time diff propagation.",
      specs: [
        '18ms Redis/IPC state sync',
        'Real-time AST type broadcasting',
        'Eliminates token duplication',
      ],
    },
    {
      icon: <GitBranch size={24} />,
      bgClass: 'c-back-bg',
      title: 'Ephemeral Git Worktrees',
      desc: 'Each agent runs code generation, execution, and linting inside its own zero-cost isolated Git worktree. No agent ever causes broken intermediate state for its peers.',
      specs: [
        'Instantaneous worktree branching',
        'Zero cross-agent build corruption',
        'Automatic rebase on blackboard commit',
      ],
    },
    {
      icon: <Lock size={24} />,
      bgClass: 'c-test-bg',
      title: 'AST-Aware Fine Locks',
      desc: 'Instead of coarse file locking, Nyxo uses Abstract Syntax Tree locking. Agent 2 can safely edit a function inside user.ts while Agent 3 simultaneously adds a new interface to the same file.',
      specs: [
        'Method-level and symbol-level locks',
        'Zero merge conflicts on integration',
        'Dynamic deadlock prevention engine',
      ],
    },
    {
      icon: <ShieldCheck size={24} />,
      bgClass: 'c-sec-bg',
      title: 'Continuous QA & Arbiter Gate',
      desc: 'As fast as code is produced, dedicated QA and Security agents continuously fuzz, lint, and verify the changes in isolated test containers before committing to the main trunk.',
      specs: [
        'Continuous synthetic unit test creation',
        'Real-time CVE & OWASP vulnerability scans',
        'Automated rollback on regression',
      ],
    },
  ];

  return (
    <section className="section-features" id="cluster">
      <div className="section-header text-center">
        <div className="section-badge">ENGINEERING CORE</div>
        <h2 className="section-title">Solving the Clustered Swarm Bottleneck</h2>
        <p className="section-subtitle">
          How Nyxo achieves 6x parallel throughput without race conditions, token overload, or hallucinated interfaces.
        </p>
      </div>

      <div className="features-grid">
        {pillars.map((pillar, idx) => (
          <div key={idx} className="feature-card glass-card hover-target">
            <div className={`feature-icon ${pillar.bgClass}`}>{pillar.icon}</div>
            <h3>{pillar.title}</h3>
            <p>{pillar.desc}</p>
            <ul className="feature-specs">
              {pillar.specs.map((spec, sIdx) => (
                <li key={sIdx}>
                  <Check size={14} />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
