import React, { useEffect, useRef, useState } from 'react';

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

/**
 * TextScramble — A text scramble / decode effect component.
 * Characters are progressively revealed from left to right, while
 * un-revealed characters cycle through random glyphs.
 */
export default function TextScramble({
  text = '',
  speed = 50,
  delay = 0,
  className = '',
}) {
  const [displayNodes, setDisplayNodes] = useState(() =>
    text.split('').map(() => ({
      char: randomChar(),
      resolved: false,
    }))
  );

  const resolvedCount = useRef(0);
  const intervalRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    // Reset on text change
    resolvedCount.current = 0;

    // Start with fully scrambled text
    setDisplayNodes(
      text.split('').map(() => ({
        char: randomChar(),
        resolved: false,
      }))
    );

    delayRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        resolvedCount.current += 1;

        setDisplayNodes(
          text.split('').map((realChar, i) => {
            if (i < resolvedCount.current) {
              return { char: realChar, resolved: true };
            }
            return { char: randomChar(), resolved: false };
          })
        );

        if (resolvedCount.current >= text.length) {
          clearInterval(intervalRef.current);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(delayRef.current);
      clearInterval(intervalRef.current);
    };
  }, [text, speed, delay]);

  return (
    <span className={className} aria-label={text}>
      {displayNodes.map((node, i) => (
        <span
          key={i}
          style={{
            color: node.resolved ? '#f8fafc' : 'rgba(56, 189, 248, 0.7)',
            transition: node.resolved ? 'color 0.15s ease' : 'none',
          }}
        >
          {node.char}
        </span>
      ))}
    </span>
  );
}

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}
