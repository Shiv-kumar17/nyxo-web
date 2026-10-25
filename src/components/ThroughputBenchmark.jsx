import React from 'react';

export default function ThroughputBenchmark() {
  return (
    <section className="section-benchmark" id="benchmark">
      <div className="section-header text-center">
        <div className="section-badge">PERFORMANCE MATRIX</div>
        <h2 className="section-title">Linear Agent vs. Nyxo Clustered Swarm</h2>
        <p className="section-subtitle">
          See how parallelizing tasks across 6 specialized agents with shared AST crushes single-agent latency.
        </p>
      </div>

      <div className="benchmark-container glass-card">
        <div className="benchmark-grid">
          <div className="benchmark-col">
            <div className="bench-head single">
              <h4>Traditional Single Agent</h4>
              <div className="bench-time">14m 20s</div>
              <p>Serial execution, repeated context wiping, frequent lock deadlocks</p>
            </div>
            <div className="bench-bars">
              <div className="b-row">
                <span>Spec Planning</span>
                <div className="b-bar"><div className="b-fill red" style={{ width: '25%' }} /></div>
              </div>
              <div className="b-row">
                <span>Backend Code</span>
                <div className="b-bar"><div className="b-fill red" style={{ width: '45%' }} /></div>
              </div>
              <div className="b-row">
                <span>Frontend Code</span>
                <div className="b-bar"><div className="b-fill red" style={{ width: '50%' }} /></div>
              </div>
              <div className="b-row">
                <span>Writing Tests</span>
                <div className="b-bar"><div className="b-fill red" style={{ width: '40%' }} /></div>
              </div>
              <div className="b-row">
                <span>Security Audit</span>
                <div className="b-bar"><div className="b-fill red" style={{ width: '30%' }} /></div>
              </div>
            </div>
          </div>

          <div className="benchmark-vs">VS</div>

          <div className="benchmark-col">
            <div className="bench-head nyxo">
              <h4>Nyxo 6-Agent Clustered Swarm</h4>
              <div className="bench-time highlight">2m 15s</div>
              <p>True concurrent execution, zero context loss, parallel test generation</p>
            </div>
            <div className="bench-bars">
              <div className="b-row">
                <span>Spec Planning</span>
                <div className="b-bar"><div className="b-fill green" style={{ width: '15%' }} /></div>
              </div>
              <div className="b-row">
                <span>Backend + Frontend</span>
                <div className="b-bar"><div className="b-fill green" style={{ width: '28%' }} /></div>
              </div>
              <div className="b-row">
                <span>Concurrent Testing</span>
                <div className="b-bar"><div className="b-fill green" style={{ width: '25%' }} /></div>
              </div>
              <div className="b-row">
                <span>Inline Security Audit</span>
                <div className="b-bar"><div className="b-fill green" style={{ width: '20%' }} /></div>
              </div>
              <div className="b-row">
                <span>Automated Merge</span>
                <div className="b-bar"><div className="b-fill green" style={{ width: '10%' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
