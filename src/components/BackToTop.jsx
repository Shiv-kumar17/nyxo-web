import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className="hover-target"
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        ...styles.button,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 28px rgba(14, 165, 233, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.4)';
      }}
    >
      <ArrowUp size={20} color="#ffffff" strokeWidth={2} />
    </button>
  );
}

const styles = {
  button: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 99,
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #0284c7, #6366f1)',
    boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s ease, transform 0.25s ease, box-shadow 0.25s ease',
    padding: 0,
    outline: 'none',
  },
};
