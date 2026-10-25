import React, { useState } from 'react';
import { History, Play, RotateCcw, Clock, GitCommit, CheckCircle2, ChevronRight, FastForward } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const TIMELINE_EVENTS = [
  {
    time: "00:00",
    label: "Swarm Boot & AST Ingestion",
    agent: "Architect",
    color: "c-arch",
    summary: "Repository AST indexed (42 files, 318 symbols). Shared memory blackboard initialized at 127.0.0.1:9092.",
    activeLocks: "None",
    worktrees: "0 / 6 Active",
    diffPreview: "+ [INIT] Blackboard daemon registered on IPC bus",
  },
  {
    time: "00:25",
    label: "DAG Decomposition & Branch Allocation",
    agent: "Architect ➔ Orchestrator",
    color: "c-arch",
    summary: "Goal parsed into 4 sub-tasks. Spawned 6 ephemeral Git worktrees on branch 'agent/worktree-*'.",
    activeLocks: "None (Partition Phase)",
    worktrees: "6 / 6 Active",
    diffPreview: "+ [TASK-1] services/auth/token.go\n+ [TASK-2] client/src/hooks/useAuth.ts\n+ [TASK-3] tests/token_fuzz_test.go",
  },
  {
    time: "00:52",
    label: "Concurrent AST Lock Acquisition & Coding",
    agent: "Backend & Frontend",
    color: "c-back",
    summary: "Agent 02 locked symbol 'IssueToken'. Agent 03 streaming React AuthProvider hook in parallel.",
    activeLocks: "Write: services/auth/token.go (Agent 02)",
    worktrees: "6 / 6 Active (Writing)",
    diffPreview: "+ func (s *Service) IssueToken(uid string) (*TokenPair, error) {\n+   return s.jwt.Sign(claims)\n+ }",
  },
  {
    time: "01:20",
    label: "Continuous Property Fuzz Testing",
    agent: "QA Automator",
    color: "c-test",
    summary: "QA agent intercepted AST diffs and spawned 40 synthetic fuzz permutations against token replay attacks.",
    activeLocks: "Read: services/auth/token.go (Agent 04)",
    worktrees: "6 / 6 Active (Testing)",
    diffPreview: "✔ TestReplayAttackProtection: PASS (1.4ms)\n✔ TestKeyExpirationBounds: PASS (0.8ms)",
  },
  {
    time: "01:45",
    label: "Security Audit & Lock Release",
    agent: "Security Auditor",
    color: "c-sec",
    summary: "Static analysis verified cryptographic randomness entropy. Released AST lock on 'token.go'.",
    activeLocks: "0 Active (All Released)",
    worktrees: "6 / 6 Staged",
    diffPreview: "✔ CVE Scan: 0 issues found\n✔ OWASP Top 10 compliance: 100%\n- Lock released on services/auth/token.go",
  },
  {
    time: "02:08",
    label: "Autonomous Trunk Fast-Forward",
    agent: "Merge Arbiter",
    color: "c-front",
    summary: "All 6 isolated worktree diffs consolidated with AST-aware three-way merge. Main branch fast-forwarded.",
    activeLocks: "Trunk Clean",
    worktrees: "6 Worktrees Cleaned Up",
    diffPreview: "✨ [COMMIT: a94f21b] Swarm Feature Merge: OAuth2 RFC 7636 PKCE\n6 files changed, +382 lines, 0 conflicts",
  },
];

export default function TimeTravelDebugger() {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentEvent = TIMELINE_EVENTS[currentIndex];

  const handleStepChange = (idx) => {
    sound.playBeep(450 + idx * 80, 0.03);
    setCurrentIndex(idx);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    sound.playLaunch();

    let step = currentIndex;
    const interval = setInterval(() => {
      step = (step + 1) % TIMELINE_EVENTS.length;
      setCurrentIndex(step);
      sound.playBeep(500 + step * 70, 0.04);
      if (step === TIMELINE_EVENTS.length - 1) {
        clearInterval(interval);
        setIsPlaying(false);
        sound.playSuccess();
      }
    }, 1800);
  };

  return (
    <section className="section-time-travel" id="time-travel">
      <div className="section-header text-center">
        <div className="section-badge">TIME-TRAVEL INSPECTION</div>
        <h2 className="section-title">Deterministic Swarm Event Replay</h2>
        <p className="section-subtitle">
          Scrub through the cluster's execution timeline nanosecond by nanosecond. Inspect AST lock acquisitions, concurrent git diffs, and arbiter merge decisions.
        </p>
      </div>

      <div className="time-travel-container glass-card">
        {/* Scrubber Controls */}
        <div className="scrubber-header">
          <div className="scrubber-title">
            <History size={16} className="text-cyan" />
            <span>Execution Timeline Scrubber</span>
            <span className="timeline-step-badge">{currentEvent.time} / 02:08</span>
          </div>

          <div className="scrubber-actions">
            <button
              className="btn btn-secondary hover-target"
              onClick={() => handleStepChange(0)}
              title="Reset Timeline"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
            <button
              className="btn btn-primary hover-target"
              onClick={handleTogglePlay}
            >
              {isPlaying ? <FastForward size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Playing Replay...' : 'Auto-Play Swarm'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Scrub Bar */}
        <div className="scrubber-track-wrapper">
          <div className="scrubber-track">
            <div
              className="scrubber-fill"
              style={{ width: `${(currentIndex / (TIMELINE_EVENTS.length - 1)) * 100}%` }}
            />
            {TIMELINE_EVENTS.map((ev, i) => (
              <button
                key={i}
                className={`scrubber-node hover-target ${i <= currentIndex ? 'visited' : ''} ${i === currentIndex ? 'active' : ''}`}
                style={{ left: `${(i / (TIMELINE_EVENTS.length - 1)) * 100}%` }}
                onClick={() => handleStepChange(i)}
                title={`${ev.time} - ${ev.label}`}
              >
                <span className="node-tooltip">{ev.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Keyframe Cards */}
        <div className="timeline-cards-row">
          {TIMELINE_EVENTS.map((ev, idx) => (
            <div
              key={idx}
              className={`timeline-pill-card hover-target ${idx === currentIndex ? 'selected' : ''}`}
              onClick={() => handleStepChange(idx)}
            >
              <div className="t-card-time">{ev.time}</div>
              <div className="t-card-label">{ev.label}</div>
              <div className={`t-card-agent ${ev.color}`}>● {ev.agent}</div>
            </div>
          ))}
        </div>

        {/* Live Replay State Inspector */}
        <div className="replay-inspector-grid">
          <div className="replay-state-card">
            <div className="replay-card-head">
              <Clock size={15} />
              <span>Cluster Snapshot at {currentEvent.time}</span>
            </div>
            <div className="replay-body">
              <div className="r-row">
                <span className="r-key">Primary Event:</span>
                <span className="r-val highlight">{currentEvent.label}</span>
              </div>
              <div className="r-row">
                <span className="r-key">Active Agent:</span>
                <span className={`r-val ${currentEvent.color}`}>● {currentEvent.agent}</span>
              </div>
              <div className="r-row">
                <span className="r-key">Active AST Locks:</span>
                <span className="r-val badge-lock">{currentEvent.activeLocks}</span>
              </div>
              <div className="r-row">
                <span className="r-key">Isolated Worktrees:</span>
                <span className="r-val text-cyan">{currentEvent.worktrees}</span>
              </div>
              <p className="r-summary">{currentEvent.summary}</p>
            </div>
          </div>

          <div className="replay-code-card">
            <div className="replay-card-head">
              <GitCommit size={15} />
              <span>AST Delta Stream Buffer</span>
            </div>
            <pre className="replay-code-block">
              <code>{currentEvent.diffPreview}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
