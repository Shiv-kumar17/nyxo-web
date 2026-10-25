import React, { useRef, useState, useCallback } from 'react';

/**
 * TiltCard — A wrapper component that adds 3D perspective tilt on mouse hover
 * with a glare/shine effect that follows the cursor.
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.02,
}) {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [transform, setTransform] = useState('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalised position from -1 to 1
        const normalX = (e.clientX - centerX) / (rect.width / 2);
        const normalY = (e.clientY - centerY) / (rect.height / 2);

        // tiltX → rotateY (horizontal cursor movement rotates around Y axis)
        // tiltY → rotateX (vertical cursor movement rotates around X axis, inverted)
        const tiltX = normalX * maxTilt;
        const tiltY = -normalY * maxTilt;

        // Glare follows cursor as a percentage of the card dimensions
        const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;

        setTransform(
          `perspective(800px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(${scale})`
        );
        setGlarePos({ x: mouseXPercent, y: mouseYPercent });
      });
    },
    [maxTilt, scale]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsHovering(false);
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
    setGlarePos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: isHovering ? 'none' : 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}

      {/* Glare / shine overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          opacity: isHovering ? 1 : 0,
          transition: 'opacity 0.35s ease',
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}
