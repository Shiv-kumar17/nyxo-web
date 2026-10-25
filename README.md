# Nyxo.AI — Clustered Multi-Agent Development Environment

> **Parallel AI Engineering. One Unified Context.**

Nyxo deploys a coordinated cluster of 5–6 specialized AI agents working concurrently on the same codebase with zero context collisions, automated AST-level locking, and 6x developmental throughput without hallucination drift.

---

## ⚡ Key Capabilities

- **3D Swarm Topology (Three.js):** Real-time WebGL visualization of the agent cluster with 360° orbit, top-down radar, and close-up core modes.
- **Mission Control Studio:** Prompt-to-execution engine with presets for Stripe Billing, Passkeys/WebAuthn, Redis Pub/Sub, and Vector RAG.
- **Deterministic Time-Travel Debugger:** Scrubber to replay AST lock acquisitions, concurrent git diffs, and arbiter merge decisions.
- **Live Swarm Cockpit:** Real-time telemetry, agent worktree tracker, shared context blackboard, and autonomous merge pipeline.
- **Human-in-the-Loop Intercepts:** Architectural alignment modal for high-stakes technical trade-offs.
- **Cybernetic Audio FX:** Built-in Web Audio API synthesizer for interface feedback with mute toggle.
- **Fluid Magnetic Cursor & Smooth Scroll:** Custom multi-layer spring cursor and Lenis 60fps inertial scrolling.

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **3D Graphics:** [Three.js](https://threejs.org/)
- **Animations:** [GSAP (GreenSock)](https://greensock.com/gsap/) + ScrollTrigger
- **Smooth Scroll:** [Lenis](https://github.com/darkroomengineering/lenis)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling:** Custom Obsidian Cyber-Glassmorphism CSS

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Shiv-kumar17/nyxo-web.git
cd nyxo-web

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 Architecture Overview

```
                      ┌──────────────────────┐
                      │   Lead Orchestrator  │
                      └──────────┬───────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │  Shared State Blackboard IPC   │
                 └───────────────┬───────────────┘
                                 │
     ┌──────────────┬────────────┼────────────┬──────────────┐
     │              │            │            │              │
┌────┴─────┐ ┌──────┴─────┐ ┌────┴─────┐ ┌────┴─────┐ ┌──────┴──────┐
│Architect │ │ Core Backend│ │ Frontend │ │ QA / Fuzz│ │Security / CVE│
└────┬─────┘ └──────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬──────┘
     │              │            │            │              │
     └──────────────┴────────────┼────────────┴──────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │ Autonomous Merge Arbiter    │
                  └──────────────┬──────────────┘
                                 │
                   Main Branch (Trunk Fast-Fwd)
```

---

## 📜 License

MIT © 2026 Nyxo.AI
