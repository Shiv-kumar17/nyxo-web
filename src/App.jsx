import React, { useState } from 'react';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClusterTelemetryHUD from './components/ClusterTelemetryHUD';
import SwarmMissionControl from './components/SwarmMissionControl';
import TimeTravelDebugger from './components/TimeTravelDebugger';
import Cockpit from './components/Cockpit';
import ArchitectureCore from './components/ArchitectureCore';
import DevExperience from './components/DevExperience';
import ThroughputBenchmark from './components/ThroughputBenchmark';
import Footer from './components/Footer';
import ClusterConfigDrawer from './components/ClusterConfigDrawer';
import HumanInTheLoopModal from './components/HumanInTheLoopModal';
import ExportConfigModal from './components/ExportConfigModal';
import { ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from './utils/soundEffects';
import { useLenis } from './hooks/useLenis';

export default function App() {
  // Initialize Lenis smooth scroll
  useLenis();

  const [activeAgentId, setActiveAgentId] = useState('arch');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isInterceptOpen, setIsInterceptOpen] = useState(false);
  const [interceptResolved, setInterceptResolved] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenIntercept = () => {
    sound.playLock();
    setIsInterceptOpen(true);
  };

  const handleDecisionMade = (decisionId) => {
    setInterceptResolved(true);
  };

  return (
    <div className="nyxo-app">
      {/* Fluid Magnetic Cursor */}
      <CustomCursor />

      {/* Ambient Lighting & Grid */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />
      <div className="grid-overlay" />

      {/* Navigation */}
      <Navbar
        onLaunchCluster={() => scrollToSection('mission-control')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Hero with 3D Canvas Swarm & Controls */}
      <Hero
        onInitCluster={() => scrollToSection('mission-control')}
        onOpenMissionControl={() => scrollToSection('mission-control')}
        activeAgentId={activeAgentId}
        onSelectAgent={setActiveAgentId}
      />

      {/* NEW: Live Cluster Telemetry HUD Banner */}
      <ClusterTelemetryHUD />

      {/* Live Intercept Floating Notification Banner */}
      <div className="intercept-floating-banner">
        <div className="intercept-banner-content glass-card hover-target" onClick={handleOpenIntercept}>
          <div className="i-icon"><ShieldAlert size={16} /></div>
          <div className="i-text">
            {interceptResolved ? (
              <span className="text-green">
                ✔ Human Architectural Consensus Applied: Redis Centralized Revocation
              </span>
            ) : (
              <span>
                <strong>Swarm Intercept Alert:</strong> Architect requests alignment on Token Revocation Strategy
              </span>
            )}
          </div>
          <button className="i-btn">
            {interceptResolved ? "Review Consensus" : "Resolve Decision"} <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Autonomous Swarm Prompt Studio / Mission Control */}
      <SwarmMissionControl />

      {/* NEW: Time-Travel Execution Replay Scrubber */}
      <TimeTravelDebugger />

      {/* Live Interactive Cockpit Simulator */}
      <Cockpit
        activeAgentId={activeAgentId}
        onSelectAgent={setActiveAgentId}
      />

      {/* Clustered Swarm Architecture Core */}
      <ArchitectureCore />

      {/* Developer Experience & CLI */}
      <DevExperience />

      {/* Throughput Matrix Benchmark */}
      <ThroughputBenchmark />

      {/* Footer */}
      <Footer onStartFree={() => scrollToSection('mission-control')} />

      {/* Cluster Settings Drawer Modal */}
      <ClusterConfigDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Human-in-the-Loop Intercept Modal */}
      <HumanInTheLoopModal
        isOpen={isInterceptOpen}
        onClose={() => setIsInterceptOpen(false)}
        onDecisionMade={handleDecisionMade}
      />

      {/* Export Config Modal */}
      <ExportConfigModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
