import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

const DOT_COLORS = ['#06b6d4', '#8b5cf6', '#c084fc'];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const overlayRef = useRef(null);
  const rafId = useRef(null);
  const startTime = useRef(null);

  const LOAD_DURATION = 2000; // ms

  // Simulate loading progress over ~2 seconds
  useEffect(() => {
    const tick = (now) => {
      if (!startTime.current) startTime.current = now;
      const elapsed = now - startTime.current;
      const pct = Math.min(elapsed / LOAD_DURATION, 1);
      setProgress(pct);

      if (pct < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Exit animation when loading completes
  useEffect(() => {
    if (!done) return;

    const timer = setTimeout(() => {
      gsap.to(overlayRef.current, {
        yPercent: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });
    }, 300); // slight pause before exit

    return () => clearTimeout(timer);
  }, [done, onComplete]);

  const pctDisplay = Math.round(progress * 100);

  return (
    <div ref={overlayRef} style={styles.overlay}>
      {/* Orbit glyph */}
      <div style={styles.glyphWrap}>
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          style={styles.svg}
        >
          <ellipse
            cx="30"
            cy="30"
            rx="26"
            ry="10"
            stroke="url(#preloaderGrad)"
            strokeWidth="1.5"
            style={styles.orbitRing}
          />
          <defs>
            <linearGradient id="preloaderGrad" x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting dots */}
        {DOT_COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              ...styles.dotContainer,
              animationDelay: `${(i * -0.533).toFixed(3)}s`,
            }}
          >
            <div
              style={{
                ...styles.dot,
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Brand name */}
      <div style={styles.brandName}>NYXO.AI</div>

      {/* Progress bar */}
      <div style={styles.barTrack}>
        <div
          style={{
            ...styles.barFill,
            width: `${pctDisplay}%`,
          }}
        />
      </div>

      {/* Status text */}
      <div style={styles.statusText}>
        {done ? 'CLUSTER READY' : 'INITIALIZING SWARM CLUSTER...'}
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
@keyframes preloaderOrbitSpin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes preloaderDotOrbit {
  0%   { transform: rotate(0deg) translateX(28px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(28px) rotate(-360deg); }
}
`;

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    background: '#08090d',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    willChange: 'transform, opacity',
  },
  glyphWrap: {
    position: 'relative',
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    animation: 'preloaderOrbitSpin 3s linear infinite',
  },
  orbitRing: {
    opacity: 0.9,
  },
  dotContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    animation: 'preloaderDotOrbit 1.6s linear infinite',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  },
  brandName: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 700,
    fontSize: '1.5rem',
    color: '#ffffff',
    letterSpacing: '0.15em',
    marginTop: 4,
  },
  barTrack: {
    width: 220,
    height: 4,
    borderRadius: 2,
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #c084fc)',
    transition: 'width 0.1s linear',
  },
  statusText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    color: '#94a3b8',
    letterSpacing: '0.08em',
  },
};
