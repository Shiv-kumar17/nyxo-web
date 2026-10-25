import React, { useState } from 'react';
import { Terminal, Zap, Sliders, Volume2, VolumeX, Sparkles, FileCode, History } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function Navbar({ onLaunchCluster, onOpenSettings, onOpenExport, onTriggerIntercept }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const handleToggleSound = () => {
    const newState = sound.toggle();
    setIsAudioEnabled(newState);
    if (newState) {
      sound.playSuccess();
    }
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="brand-glyph">
            <div className="core-orbit" />
            <div className="cluster-dot-mini d1" />
            <div className="cluster-dot-mini d2" />
            <div className="cluster-dot-mini d3" />
          </div>
          <span className="brand-name">
            NYXO<span className="brand-accent">.AI</span>
          </span>
          <span className="badge-tag">SWARM CLUSTER v2.4</span>
        </div>

        <div className="nav-links">
          <a href="#mission-control" className="nav-link hover-target">
            <span className="nav-highlight"><Sparkles size={12} /> Studio</span>
          </a>
          <a href="#time-travel" className="nav-link hover-target">
            <span className="nav-highlight-purple"><History size={12} /> Replay</span>
          </a>
          <a href="#cockpit" className="nav-link hover-target">Cockpit</a>
          <a href="#cluster" className="nav-link hover-target">Architecture</a>
          <a href="#benchmark" className="nav-link hover-target">Throughput</a>
        </div>

        <div className="nav-cta">
          {/* Sound Toggle */}
          <button
            className={`btn-icon-nav hover-target ${isAudioEnabled ? 'audio-active' : ''}`}
            onClick={handleToggleSound}
            title={isAudioEnabled ? "Mute UI Audio" : "Enable Synth UI Audio"}
          >
            {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Export Spec YAML */}
          <button
            className="btn-icon-nav hover-target"
            onClick={() => {
              sound.playBeep(650, 0.03);
              onOpenExport();
            }}
            title="Export Production Swarm Blueprint"
          >
            <FileCode size={16} />
          </button>

          {/* Settings Drawer Button */}
          <button
            className="btn btn-secondary hover-target"
            onClick={() => {
              sound.playBeep(600, 0.03);
              onOpenSettings();
            }}
            title="Cluster Orchestration Configuration"
          >
            <Sliders size={15} />
            <span>Settings</span>
          </button>

          <button
            className="btn btn-primary hover-target"
            onClick={() => {
              sound.playLaunch();
              onLaunchCluster();
            }}
          >
            <Zap size={16} />
            <span>Launch Cluster</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
