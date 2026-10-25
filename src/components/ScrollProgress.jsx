import React, { useEffect, useRef, useState } from 'react';

export default function ScrollProgress() {
  const [width, setWidth] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setWidth(pct);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial measurement
    updateProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div style={styles.track}>
      <div
        style={{
          ...styles.bar,
          width: `${width}%`,
        }}
      />
    </div>
  );
}

const styles = {
  track: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
    zIndex: 200,
    background: 'transparent',
    pointerEvents: 'none',
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #c084fc)',
    transition: 'width 0.15s ease-out',
    willChange: 'width',
  },
};
