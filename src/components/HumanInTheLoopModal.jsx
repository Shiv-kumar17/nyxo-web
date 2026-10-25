import React, { useState } from 'react';
import { AlertCircle, Check, X, ShieldAlert, Cpu, ArrowRight, Zap } from 'lucide-react';
import { sound } from '../utils/soundEffects';

const OPTIONS = [
  {
    id: 'redis',
    title: 'Redis Centralized Blacklist',
    recommended: true,
    desc: 'Store revoked token JTI signatures in Redis with TTL matching JWT expiration. Immediate revocation, +2ms lookup latency.',
    impact: 'Backend adds Redis dependency. Zero client changes.',
  },
  {
    id: 'rotation',
    title: 'Short-Lived JWT + Refresh Rotation',
    recommended: false,
    desc: 'Issue 5-minute access tokens with single-use refresh token exchange. Fully stateless verification.',
    impact: 'Client UI adds automatic Axios token refresh interceptor.',
  },
  {
    id: 'bloom',
    title: 'Probabilistic Bloom Filter Cache',
    recommended: false,
    desc: 'Keep in-memory compressed bloom filter of revoked IDs on every API worker node.',
    impact: 'Ultra-low memory (1.2 MB/100k tokens), 0.001% false positive rate.',
  },
];

export default function HumanInTheLoopModal({ isOpen, onClose, onDecisionMade }) {
  const [selectedOption, setSelectedOption] = useState('redis');
  const [isApplied, setIsApplied] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    sound.playSuccess();
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
      if (onDecisionMade) onDecisionMade(selectedOption);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="decision-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="decision-modal-header">
          <div className="d-header-left">
            <span className="d-alert-icon"><ShieldAlert size={20} /></span>
            <div>
              <div className="d-title">Human-in-the-Loop Intercept</div>
              <div className="d-subtitle">Cluster Lead Architect requires architectural trade-off alignment</div>
            </div>
          </div>
          <button className="drawer-close-btn hover-target" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="decision-modal-body">
          <div className="decision-context-box">
            <div className="d-context-label">DECISION CONTEXT:</div>
            <p>
              While implementing OAuth2 RFC 7636 token lifecycle, <strong>Agent 01 (Architect)</strong> and <strong>Agent 02 (Backend)</strong> require consensus on the <strong>Token Revocation Strategy</strong> before locking <code>services/auth/token.go</code>.
            </p>
          </div>

          <div className="decision-options-list">
            {OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className={`decision-option-card hover-target ${selectedOption === opt.id ? 'active' : ''}`}
                onClick={() => {
                  sound.playBeep(600, 0.03);
                  setSelectedOption(opt.id);
                }}
              >
                <div className="d-opt-header">
                  <div className="d-opt-title-group">
                    <span className="d-radio-circle">
                      {selectedOption === opt.id && <span className="d-radio-inner" />}
                    </span>
                    <span className="d-opt-name">{opt.title}</span>
                  </div>
                  {opt.recommended && <span className="d-rec-badge">RECOMMENDED</span>}
                </div>
                <p className="d-opt-desc">{opt.desc}</p>
                <div className="d-opt-impact">
                  <span className="d-impact-tag">Impact:</span> {opt.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="decision-modal-footer">
          <button className="btn btn-secondary hover-target" onClick={onClose}>
            Delegate to Swarm Arbiter
          </button>
          <button
            className="btn btn-primary hover-target"
            onClick={handleConfirm}
            disabled={isApplied}
          >
            {isApplied ? (
              <>
                <Check size={16} />
                <span>Decision Broadcasted!</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>Apply Architectural Decision</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
