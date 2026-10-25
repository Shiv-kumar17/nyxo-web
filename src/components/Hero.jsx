import React, { useEffect, useRef } from 'react';
import { Cpu, Play, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import SwarmClusterCanvas from './SwarmClusterCanvas';

export default function Hero({ onInitCluster, onOpenMissionControl, activeAgentId, onSelectAgent }) {
  const heroRef = useRef(null);
  const throughputCounterRef = useRef(null);
  const astCounterRef = useRef(null);
  const latencyCounterRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = [
        { ref: throughputCounterRef, target: 5.8, decimals: 1 },
        { ref: astCounterRef, target: 100, decimals: 0 },
        { ref: latencyCounterRef, target: 18, decimals: 0 },
      ];

      counters.forEach(({ ref, target, decimals }) => {
        if (!ref.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            if (ref.current) {
              ref.current.textContent = decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val);
            }
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <header className="hero-section" ref={heroRef}>
      <div className="hero-container">
        <div className="hero-content">
          <div className="status-pill hover-target">
            <span className="status-indicator-live" />
            <span className="status-text">6-Agent Swarm Synchronized &bull; Shared AST Active</span>
          </div>

          <h1 className="hero-title">
            Parallel AI Engineering.<br />
            <span className="gradient-text">One Unified Context.</span>
          </h1>

          <p className="hero-description">
            Nyxo deploys a coordinated cluster of specialized AI agents working concurrently on the same codebase. 
            Zero context collisions, automated AST-level merging, and 6x developmental throughput without hallucination drift.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg hover-target" onClick={onInitCluster}>
              <Cpu size={18} />
              <span>Initialize 6-Agent Cluster</span>
            </button>
            <button className="btn btn-outline btn-lg hover-target" onClick={onOpenMissionControl}>
              <Sparkles size={18} />
              <span>Open Swarm Studio</span>
            </button>
          </div>

          <div className="hero-metrics">
            <div className="metric-item">
              <div>
                <span className="metric-value" ref={throughputCounterRef}>0</span>
                <span className="metric-suffix">x</span>
              </div>
              <span className="metric-label">Concurrent Throughput</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <div>
                <span className="metric-value" ref={astCounterRef}>0</span>
                <span className="metric-suffix">%</span>
              </div>
              <span className="metric-label">AST Lock Integrity</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <div>
                <span className="metric-value" ref={latencyCounterRef}>0</span>
                <span className="metric-suffix">ms</span>
              </div>
              <span className="metric-label">State Broadcast Latency</span>
            </div>
          </div>
        </div>

        {/* 3D Clustered Swarm Visualizer */}
        <SwarmClusterCanvas activeAgentId={activeAgentId} onSelectAgent={onSelectAgent} />
      </div>
    </header>
  );
}
