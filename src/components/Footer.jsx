import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

export default function Footer({ onStartFree }) {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-card glass-card text-center">
          <h2 className="footer-title">Ready to 6x Your Engineering Velocity?</h2>
          <p className="footer-desc">
            Experience the power of a coordinated AI swarm sharing one unified context.
          </p>
          <div className="footer-buttons">
            <button className="btn btn-primary btn-lg hover-target" onClick={onStartFree}>
              <Sparkles size={18} />
              <span>Start Free with Nyxo CLI</span>
            </button>
            <a href="#cockpit" className="btn btn-outline btn-lg hover-target">
              <BookOpen size={18} />
              <span>Read Architecture Whitepaper</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="f-brand">
            NYXO<span>.AI</span> &copy; 2026 Clustered Multi-Agent Autonomous Development
          </div>
          <div className="f-links">
            <a href="#" className="hover-target">Privacy Policy</a>
            <a href="#" className="hover-target">Terms of Service</a>
            <a href="#" className="hover-target">GitHub Swarm Engine</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
