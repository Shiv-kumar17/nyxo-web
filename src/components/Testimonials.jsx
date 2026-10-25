import React, { useState, useEffect, useCallback } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Nyxo cut our feature delivery time from days to hours. The parallel agent swarm is unlike anything I've used before.",
    name: "Sarah Chen",
    role: "Staff Engineer",
    company: "Vercel",
    initials: "SC",
    gradient: "linear-gradient(135deg, #00e5ff, #7c4dff)",
  },
  {
    quote: "The AST-aware locking is genius. We had zero merge conflicts across 6 agents working on the same monorepo.",
    name: "Marcus Rivera",
    role: "CTO",
    company: "Raycast",
    initials: "MR",
    gradient: "linear-gradient(135deg, #7c4dff, #ff6ec7)",
  },
  {
    quote: "It's like having a senior engineering pod that never sleeps. The shared blackboard context eliminates the hallucination drift we saw with other tools.",
    name: "Anika Patel",
    role: "VP Engineering",
    company: "Linear",
    initials: "AP",
    gradient: "linear-gradient(135deg, #ff6ec7, #00e5ff)",
  },
  {
    quote: "We deployed a full OAuth2 PKCE stack in 12 minutes. Manually it would have taken our team 2 days.",
    name: "James Okafor",
    role: "Lead Architect",
    company: "Supabase",
    initials: "JO",
    gradient: "linear-gradient(135deg, #00e5ff, #76ff03)",
  },
];

const styles = {
  section: {
    padding: '120px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '999px',
    border: '1px solid rgba(0, 229, 255, 0.25)',
    background: 'rgba(0, 229, 255, 0.06)',
    color: '#00e5ff',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '20px',
  },
  title: {
    fontSize: 'clamp(28px, 4vw, 44px)',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '56px',
    textAlign: 'center',
    letterSpacing: '-0.02em',
  },
  carouselWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '700px',
    minHeight: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: (isActive) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '48px 40px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
    transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: isActive ? 'auto' : 'none',
    boxSizing: 'border-box',
  }),
  quoteIcon: {
    color: 'rgba(0, 229, 255, 0.35)',
    marginBottom: '24px',
  },
  quoteText: {
    fontSize: '18px',
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.85)',
    fontStyle: 'italic',
    marginBottom: '32px',
    fontWeight: 400,
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  avatar: (gradient) => ({
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    color: '#ffffff',
    flexShrink: 0,
    letterSpacing: '0.5px',
  }),
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  authorName: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#ffffff',
    lineHeight: 1.3,
  },
  authorRole: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.45)',
    lineHeight: 1.4,
  },
  dotsContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '40px',
  },
  dot: (isActive) => ({
    width: isActive ? '28px' : '10px',
    height: '10px',
    borderRadius: '999px',
    background: isActive ? '#00e5ff' : 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive ? '0 0 14px rgba(0, 229, 255, 0.4)' : 'none',
  }),
};

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(advance, 5000);
    return () => clearInterval(interval);
  }, [advance]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section style={styles.section}>
      <span style={styles.badge}>TRUSTED BY ENGINEERS</span>
      <h2 style={styles.title}>What Engineers Are Saying</h2>

      <div style={styles.carouselWrapper}>
        {testimonials.map((t, i) => (
          <div key={i} style={styles.card(i === activeIndex)}>
            <Quote size={36} style={styles.quoteIcon} />
            <p style={styles.quoteText}>"{t.quote}"</p>
            <div style={styles.authorRow}>
              <div style={styles.avatar(t.gradient)}>
                {t.initials}
              </div>
              <div style={styles.authorInfo}>
                <span style={styles.authorName}>{t.name}</span>
                <span style={styles.authorRole}>
                  {t.role}, {t.company}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.dotsContainer}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            style={styles.dot(i === activeIndex)}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
