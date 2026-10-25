import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  GitBranch,
  Box,
  Terminal,
  Cloud,
  Database,
  Shield,
  Layers,
  Puzzle,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const integrations = [
  {
    icon: GitBranch,
    name: 'GitHub / GitLab',
    desc: 'Native Git worktree management with PR auto-generation',
    color: '#06b6d4', // cyan
  },
  {
    icon: Box,
    name: 'Docker',
    desc: "Isolated test containers for each agent's verification pipeline",
    color: '#a855f7', // purple
  },
  {
    icon: Terminal,
    name: 'VS Code / Cursor',
    desc: 'IDE sidecar companion with live agent telemetry panel',
    color: '#10b981', // emerald
  },
  {
    icon: Cloud,
    name: 'Vercel / Netlify',
    desc: "Auto-deploy preview branches from each agent's worktree",
    color: '#f59e0b', // amber
  },
  {
    icon: Database,
    name: 'PostgreSQL / Redis',
    desc: 'Shared blackboard state persistence and IPC transport layer',
    color: '#06b6d4',
  },
  {
    icon: Shield,
    name: 'Snyk / SonarQube',
    desc: 'Continuous security scanning wired into the Arbiter Gate',
    color: '#a855f7',
  },
  {
    icon: Layers,
    name: 'GitHub Actions',
    desc: 'CI/CD pipeline triggers on every arbiter merge commit',
    color: '#10b981',
  },
  {
    icon: Puzzle,
    name: 'Custom Plugins',
    desc: 'Extend agent capabilities with tree-sitter grammars & tools',
    color: '#f59e0b',
  },
];

export default function Integrations() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge + heading animations
      gsap.from('.integrations-badge', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('.integrations-title', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from('.integrations-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: 0.25,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Card stagger animation
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.5,
          delay: 0.1 * i,
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="integrations" style={styles.section}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <span className="integrations-badge" style={styles.badge}>
            ECOSYSTEM & INTEGRATIONS
          </span>
          <h2 className="integrations-title" style={styles.title}>
            Works With Your{' '}
            <span style={styles.titleAccent}>Entire Stack</span>
          </h2>
          <p className="integrations-subtitle" style={styles.subtitle}>
            Nyxo plugs into your existing tools, CI/CD pipelines, and IDEs with
            zero-config setup.
          </p>
        </div>

        {/* Grid */}
        <div style={styles.grid}>
          {integrations.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                ref={(el) => (cardsRef.current[index] = el)}
                className="hover-target"
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = `${item.color}66`;
                  e.currentTarget.style.boxShadow = `0 8px 32px ${item.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    ...styles.iconWrap,
                    background: `${item.color}18`,
                  }}
                >
                  <Icon size={22} color={item.color} strokeWidth={1.8} />
                </div>
                <h3 style={styles.cardName}>{item.name}</h3>
                <p style={styles.cardDesc}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 1024px) {
          #integrations .integrations-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          #integrations .integrations-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

const styles = {
  section: {
    position: 'relative',
    padding: '7rem 1.5rem',
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3.5rem',
  },
  badge: {
    display: 'inline-block',
    padding: '0.35rem 1rem',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: '#38bdf8',
    background: 'rgba(14, 165, 233, 0.1)',
    border: '1px solid rgba(14, 165, 233, 0.2)',
    marginBottom: '1.25rem',
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: 700,
    color: '#f0f6fc',
    lineHeight: 1.2,
    margin: '0 0 1rem',
  },
  titleAccent: {
    background: 'linear-gradient(135deg, #0ea5e9, #818cf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.05rem',
    color: '#8b949e',
    maxWidth: '560px',
    margin: '0 auto',
    lineHeight: 1.7,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.25rem',
    className: 'integrations-grid',
  },
  card: {
    padding: '1.5rem',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: 'transform 0.25s ease, border-color 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default',
  },
  iconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  cardName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#e6edf3',
    margin: '0 0 0.5rem',
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: '#8b949e',
    lineHeight: 1.6,
    margin: 0,
  },
};
