import React, { useState, useEffect } from 'react';
import { Activity, Cpu, DollarSign, Database, Flame, Zap, ShieldCheck } from 'lucide-react';

export default function ClusterTelemetryHUD() {
  const [tokenRate, setTokenRate] = useState(1840);
  const [latency, setLatency] = useState(14.2);
  const [cacheHit, setCacheHit] = useState(94.6);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokenRate(Math.floor(1800 + Math.random() * 120));
      setLatency(Number((13.5 + Math.random() * 1.8).toFixed(1)));
      setCacheHit(Number((94.0 + Math.random() * 0.9).toFixed(1)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="telemetry-hud-banner glass-card">
      <div className="telemetry-hud-container">
        <div className="hud-metric-cell">
          <div className="hud-icon c-cyan-bg"><Zap size={16} /></div>
          <div>
            <div className="hud-val">{tokenRate.toLocaleString()} <span className="hud-unit">tok/s</span></div>
            <div className="hud-lbl">Swarm Generation Velocity</div>
          </div>
        </div>

        <div className="hud-cell-divider" />

        <div className="hud-metric-cell">
          <div className="hud-icon c-purple-bg"><Activity size={16} /></div>
          <div>
            <div className="hud-val">{latency} <span className="hud-unit">ms</span></div>
            <div className="hud-lbl">Blackboard IPC Latency</div>
          </div>
        </div>

        <div className="hud-cell-divider" />

        <div className="hud-metric-cell">
          <div className="hud-icon c-green-bg"><Database size={16} /></div>
          <div>
            <div className="hud-val">{cacheHit}%</div>
            <div className="hud-lbl">AST Semantic Cache Hit</div>
          </div>
        </div>

        <div className="hud-cell-divider" />

        <div className="hud-metric-cell">
          <div className="hud-icon c-amber-bg"><DollarSign size={16} /></div>
          <div>
            <div className="hud-val">$0.042</div>
            <div className="hud-lbl">Cost Per Feature Delivered</div>
          </div>
        </div>

        <div className="hud-cell-divider" />

        <div className="hud-metric-cell">
          <div className="hud-icon c-red-bg"><ShieldCheck size={16} /></div>
          <div>
            <div className="hud-val">0.00%</div>
            <div className="hud-lbl">AST Deadlock Collisions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
