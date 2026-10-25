import React, { useState, useEffect } from 'react';
import { 
  Rocket, Sparkles, CheckCircle2, Play, GitBranch, Shield, 
  Terminal, FileCode, Cpu, ArrowRight, RefreshCw, Lock, AlertTriangle
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

const PRESETS = [
  {
    title: "Stripe Billing & Webhooks",
    prompt: "Implement Stripe Checkout session with webhook signing and idempotent subscription fulfillment",
    files: ["api/billing.go", "client/Checkout.tsx", "tests/billing_test.go"],
  },
  {
    title: "Passkey & WebAuthn Auth",
    prompt: "Migrate traditional password authentication to FIDO2 / WebAuthn biometric passkeys with fallback",
    files: ["auth/webauthn.rs", "components/PasskeyPrompt.tsx", "tests/auth_fuzz.rs"],
  },
  {
    title: "Redis Real-Time Pub/Sub",
    prompt: "Build high-concurrency WebSocket notification broker backed by Redis cluster and heartbeat recovery",
    files: ["broker/hub.go", "hooks/useSocket.ts", "tests/load_test.k6.js"],
  },
  {
    title: "Vector Search RAG Engine",
    prompt: "Construct hybrid BM25 + pgvector retrieval pipeline with semantic cache and re-ranking",
    files: ["rag/retriever.py", "db/vector_schema.sql", "tests/eval_rag.py"],
  },
];

const SAMPLE_DIFFS = {
  "api/billing.go": `package billing

import (
+	"crypto/subtle"
+	"github.com/stripe/stripe-go/v74"
+	"github.com/stripe/stripe-go/v74/webhook"
)

// IssueCheckoutSession dispatches an ephemeral checkout instance
func (s *Service) IssueCheckoutSession(customerID string) (*stripe.CheckoutSession, error) {
+	params := &stripe.CheckoutSessionParams{
+		Mode: stripe.String(string(stripe.CheckoutSessionModeSubscription)),
+		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
+		Customer: stripe.String(customerID),
+		SuccessURL: stripe.String(s.cfg.AppURL + "/success?session_id={CHECKOUT_SESSION_ID}"),
+	}
+	return checkout.New(params)
}

// HandleWebhook verifies HMAC-SHA256 signature and prevents replay
func (s *Service) HandleWebhook(payload []byte, sigHeader string) error {
+	event, err := webhook.ConstructEvent(payload, sigHeader, s.cfg.SigningSecret)
+	if err != nil {
+		return ErrInvalidSignature
+	}
+	return s.processIdempotentEvent(event.ID, event.Type, event.Data.Raw)
}`,

  "client/Checkout.tsx": `import React, { useState } from 'react';
+import { loadStripe } from '@stripe/stripe-js';
+import { useSwarmContext } from '@/hooks/useSwarm';

export const CheckoutModal: React.FC<{ planId: string }> = ({ planId }) => {
+  const [loading, setLoading] = useState(false);
+  const { sessionToken } = useSwarmContext();

+  const handleCheckout = async () => {
+    setLoading(true);
+    const res = await fetch('/api/billing/checkout-session', {
+      method: 'POST',
+      headers: { 'Authorization': \`Bearer \${sessionToken}\` },
+      body: JSON.stringify({ planId })
+    });
+    const { sessionId } = await res.json();
+    const stripe = await loadStripe(process.env.VITE_STRIPE_KEY);
+    await stripe?.redirectToCheckout({ sessionId });
+  };

  return (
    <button onClick={handleCheckout} disabled={loading} className="btn-pay">
      {loading ? "Redirecting..." : "Upgrade to Pro Swarm"}
    </button>
  );
};`,

  "tests/billing_test.go": `package tests

import (
+	"testing"
+	"github.com/stretchr/testify/assert"
+	"billing"
)

func TestWebhookIdempotency(t *testing.T) {
+	svc := billing.NewMockService()
+	mockPayload := []byte(\`{"id":"evt_123","type":"customer.subscription.created"}\`)
+	sig := svc.GenerateMockSignature(mockPayload)
+
+	// First event processing must succeed
+	err := svc.HandleWebhook(mockPayload, sig)
+	assert.NoError(t, err)
+
+	// Replay attack with same event ID must reject idempotently
+	replayErr := svc.HandleWebhook(mockPayload, sig)
+	assert.Equal(t, billing.ErrDuplicateEventIgnored, replayErr)
}`,
};

export default function SwarmMissionControl() {
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 to 5
  const [activeTab, setActiveTab] = useState('diff'); // 'diff', 'dag', 'locks', 'tests'
  const [selectedFile, setSelectedFile] = useState("api/billing.go");

  const steps = [
    { label: "Decomposing DAG", agent: "Architect", color: "c-arch" },
    { label: "Spawning Worktrees", agent: "Orchestrator", color: "c-doc" },
    { label: "AST Locks & Coding", agent: "Backend & UI", color: "c-back" },
    { label: "Matrix Fuzz Tests", agent: "QA Automator", color: "c-test" },
    { label: "Security & Arbiter", agent: "Reviewer & Arbiter", color: "c-sec" },
    { label: "Swarm Merged to Main", agent: "Cluster Complete", color: "c-front" },
  ];

  const handleRunSwarm = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(1);
    sound.playLaunch();

    const timeouts = [
      setTimeout(() => { setCurrentStep(2); sound.playLock(); }, 1200),
      setTimeout(() => { setCurrentStep(3); sound.playBeep(750, 0.08); }, 2800),
      setTimeout(() => { setCurrentStep(4); sound.playBeep(900, 0.08); }, 4400),
      setTimeout(() => { setCurrentStep(5); sound.playSuccess(); setIsRunning(false); }, 6000),
    ];

    return () => timeouts.forEach(clearTimeout);
  };

  const handleSelectPreset = (p) => {
    sound.playBeep(600, 0.03);
    setPrompt(p.prompt);
    setSelectedFile(p.files[0] || "api/billing.go");
  };

  return (
    <section className="section-mission-control" id="mission-control">
      <div className="section-header text-center">
        <div className="section-badge">MISSION CONTROL</div>
        <h2 className="section-title">Autonomous Swarm Prompt Studio</h2>
        <p className="section-subtitle">
          Input any high-level product goal. Watch 6 specialized agents concurrently break it down into AST locks, code, tests, and auto-merge.
        </p>
      </div>

      <div className="mission-container glass-card">
        {/* Preset Selector */}
        <div className="preset-bar">
          <span className="preset-label"><Sparkles size={14} /> Quick Presets:</span>
          <div className="preset-chips">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                className={`preset-chip hover-target ${prompt === p.prompt ? 'active' : ''}`}
                onClick={() => handleSelectPreset(p)}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Form */}
        <div className="prompt-input-wrapper">
          <div className="prompt-icon"><Terminal size={20} /></div>
          <input
            type="text"
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your feature or system requirement here..."
          />
          <button
            className={`btn btn-primary btn-dispatch hover-target ${isRunning ? 'running' : ''}`}
            onClick={handleRunSwarm}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <RefreshCw size={16} className="spin-icon" />
                <span>Executing Swarm...</span>
              </>
            ) : (
              <>
                <Rocket size={16} />
                <span>Dispatch Swarm</span>
              </>
            )}
          </button>
        </div>

        {/* 5-Step Pipeline Stepper */}
        <div className="swarm-stepper">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx && isRunning;
            return (
              <div
                key={idx}
                className={`step-card ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
              >
                <div className="step-indicator">
                  {isCompleted ? <CheckCircle2 size={16} /> : <span>0{idx + 1}</span>}
                </div>
                <div className="step-info">
                  <div className="step-label">{step.label}</div>
                  <div className={`step-agent ${step.color}`}>● {step.agent}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mission Control Multi-View Tabs */}
        <div className="mission-tabs-header">
          <div className="mission-tabs">
            <button
              className={`m-tab hover-target ${activeTab === 'diff' ? 'active' : ''}`}
              onClick={() => { sound.playBeep(650, 0.02); setActiveTab('diff'); }}
            >
              <FileCode size={14} /> Concurrent Code Diffs
            </button>
            <button
              className={`m-tab hover-target ${activeTab === 'dag' ? 'active' : ''}`}
              onClick={() => { sound.playBeep(650, 0.02); setActiveTab('dag'); }}
            >
              <GitBranch size={14} /> Interactive Swarm DAG
            </button>
            <button
              className={`m-tab hover-target ${activeTab === 'locks' ? 'active' : ''}`}
              onClick={() => { sound.playBeep(650, 0.02); setActiveTab('locks'); }}
            >
              <Lock size={14} /> Real-Time AST Locks
            </button>
            <button
              className={`m-tab hover-target ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => { sound.playBeep(650, 0.02); setActiveTab('tests'); }}
            >
              <Shield size={14} /> Continuous QA & Security
            </button>
          </div>
          <div className="m-status-tag">
            <span className="dot-live" /> 6 Isolated Worktrees
          </div>
        </div>

        {/* Tab 1: Live Code Diff Viewer */}
        {activeTab === 'diff' && (
          <div className="diff-viewer">
            <div className="diff-file-sidebar">
              <div className="diff-sidebar-title">CHANGED FILES (4)</div>
              {Object.keys(SAMPLE_DIFFS).map((file) => (
                <div
                  key={file}
                  className={`diff-file-item hover-target ${selectedFile === file ? 'active' : ''}`}
                  onClick={() => { sound.playBeep(550, 0.02); setSelectedFile(file); }}
                >
                  <FileCode size={14} />
                  <span>{file}</span>
                  <span className="diff-badge-add">+28</span>
                </div>
              ))}
            </div>
            <div className="diff-content">
              <div className="diff-header">
                <span>{selectedFile}</span>
                <span className="diff-tag">Branch: <code>agent/worktree-parallel</code></span>
              </div>
              <pre className="diff-code">
                <code>
                  {SAMPLE_DIFFS[selectedFile] || "// No diffs selected"}
                </code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Swarm DAG */}
        {activeTab === 'dag' && (
          <div className="dag-viewer">
            <div className="dag-diagram">
              <div className="dag-node node-arch">
                <div className="dag-node-badge">STAGE 1</div>
                <h4>Architect Agent</h4>
                <p>Task DAG Decomposer</p>
                <div className="dag-subtag">Emits 3 Sub-Tasks</div>
              </div>

              <div className="dag-branch-arrow">
                <div className="branch-line" />
                <div className="branch-line" />
                <div className="branch-line" />
              </div>

              <div className="dag-parallel-cluster">
                <div className="dag-node node-back">
                  <div className="dag-node-badge">PARALLEL</div>
                  <h4>Backend Agent</h4>
                  <p>Implements OAuth & Token Logic</p>
                  <div className="dag-lock-notice"><Lock size={12} /> Lock: <code>auth/jwt.rs</code></div>
                </div>

                <div className="dag-node node-front">
                  <div className="dag-node-badge">PARALLEL</div>
                  <h4>Frontend Agent</h4>
                  <p>Binds Reactive Auth Hooks</p>
                  <div className="dag-lock-notice">Worktree: <code>client/auth</code></div>
                </div>

                <div className="dag-node node-test">
                  <div className="dag-node-badge">PARALLEL</div>
                  <h4>QA & Fuzz Agent</h4>
                  <p>Property & Regression Suite</p>
                  <div className="dag-lock-notice">Running 40 tests</div>
                </div>
              </div>

              <div className="dag-merge-arrow">➔</div>

              <div className="dag-node node-arbiter">
                <div className="dag-node-badge">STAGE 3</div>
                <h4>Merge Arbiter</h4>
                <p>AST Diff Consolidation</p>
                <div className="dag-status-clean">✔ Trunk Fast-Forwarded</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AST Locks Table */}
        {activeTab === 'locks' && (
          <div className="locks-table-wrapper">
            <table className="locks-table">
              <thead>
                <tr>
                  <th>Target File</th>
                  <th>Symbol / Scope</th>
                  <th>Holding Agent</th>
                  <th>Lock Type</th>
                  <th>State</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>services/billing.go</code></td>
                  <td><code>IssueCheckoutSession()</code></td>
                  <td><span className="legend-chip c-back">● Backend</span></td>
                  <td>Write (AST Block)</td>
                  <td><span className="badge-lock-active">ACTIVE</span></td>
                  <td>1.4s</td>
                </tr>
                <tr>
                  <td><code>services/billing.go</code></td>
                  <td><code>HandleWebhook()</code></td>
                  <td><span className="legend-chip c-test">● QA Automator</span></td>
                  <td>Read (AST Spec)</td>
                  <td><span className="badge-lock-shared">SHARED</span></td>
                  <td>0.8s</td>
                </tr>
                <tr>
                  <td><code>client/src/App.tsx</code></td>
                  <td><code>&lt;AuthProvider /&gt;</code></td>
                  <td><span className="legend-chip c-front">● UI Engineer</span></td>
                  <td>Write (JSX Node)</td>
                  <td><span className="badge-lock-released">RELEASED</span></td>
                  <td>3.1s</td>
                </tr>
                <tr>
                  <td><code>docs/openapi.json</code></td>
                  <td><code>/v1/billing/checkout</code></td>
                  <td><span className="legend-chip c-doc">● Release Agent</span></td>
                  <td>Write (Contract)</td>
                  <td><span className="badge-lock-active">SYNCING</span></td>
                  <td>0.4s</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Continuous QA & Security Matrix */}
        {activeTab === 'tests' && (
          <div className="tests-matrix-wrapper">
            <div className="test-cards-grid">
              <div className="test-summary-card">
                <div className="test-stat-num text-green">100%</div>
                <div className="test-stat-label">Test Pass Rate</div>
                <div className="test-stat-meta">58 tests passed / 0 failures</div>
              </div>
              <div className="test-summary-card">
                <div className="test-stat-num text-cyan">94.8%</div>
                <div className="test-stat-label">Branch Coverage</div>
                <div className="test-stat-meta">+4.2% from previous commit</div>
              </div>
              <div className="test-summary-card">
                <div className="test-stat-num text-purple">0</div>
                <div className="test-stat-label">CVE Vulnerabilities</div>
                <div className="test-stat-meta">OWASP Top 10 Clean</div>
              </div>
              <div className="test-summary-card">
                <div className="test-stat-num text-yellow">12ms</div>
                <div className="test-stat-label">Fuzz Engine Latency</div>
                <div className="test-stat-meta">10,000 synthetic permutations</div>
              </div>
            </div>

            <div className="test-log-terminal">
              <div className="test-log-line text-green">✔ PASS: tests/billing_test.go:TestWebhookIdempotency (1.2ms)</div>
              <div className="test-log-line text-green">✔ PASS: tests/billing_test.go:TestReplayAttackRejection (0.8ms)</div>
              <div className="test-log-line text-green">✔ PASS: tests/auth_fuzz.rs:fuzz_pkce_entropy_bounds (2.4ms)</div>
              <div className="test-log-line text-green">✔ PASS: client/src/components/Checkout.test.tsx (4.1ms)</div>
              <div className="test-log-line text-cyan">ℹ AUDIT: Static Analysis found 0 buffer overflows or unsafe memory dereferences</div>
              <div className="test-log-line text-purple">✨ VERIFIED: Merge Arbiter approval token generated [SIG: e83b2...a1f]</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
