import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqItems = [
  {
    question: "How do 6 agents share context without token overflow?",
    answer:
      "Nyxo uses a Shared Blackboard architecture instead of passing raw conversation tokens between agents. The blackboard maintains a semantic AST graph, type definitions, and architectural decisions as structured data — not conversational text. Each agent receives only the delta diffs relevant to its current task, keeping token usage under 32% of the context window.",
  },
  {
    question: "What happens when two agents edit the same file?",
    answer:
      "Nyxo implements AST-level fine-grained locking, not file-level locks. Agent 2 can safely modify a function body in user.ts while Agent 3 adds a new interface to the same file. The Merge Arbiter runs continuous AST diff analysis to guarantee zero conflicts on integration.",
  },
  {
    question: "Can I customize the agent roles and cluster size?",
    answer:
      "Absolutely. The nyxo.config.ts file lets you define custom agent roles, set cluster size from 2-8 agents, configure worktree strategies, and adjust blackboard sync intervals. Presets like fullstack-swarm, api-backend, and frontend-spa are available out of the box.",
  },
  {
    question: "How does the merge arbiter prevent regressions?",
    answer:
      "Before any agent's worktree branch is merged into the main trunk, the Arbiter Gate runs a full pipeline: AST structural diff analysis, automated test suite execution, property-based fuzz testing, and security vulnerability scanning. If any gate fails, the merge is blocked and the authoring agent is notified to fix the issue.",
  },
  {
    question: "What languages and frameworks does Nyxo support?",
    answer:
      "Nyxo's AST engine supports TypeScript, JavaScript, Python, Go, Rust, and Java out of the box. Framework-specific presets are available for React, Next.js, FastAPI, Gin, and Actix. The plugin system allows adding custom language support via tree-sitter grammars.",
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
  container: {
    width: '100%',
    maxWidth: '800px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  item: (isLast) => ({
    borderBottom: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
  }),
  questionButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '22px 28px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.2s ease',
  },
  questionText: (isOpen) => ({
    fontSize: '16px',
    fontWeight: 600,
    color: isOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
    lineHeight: 1.5,
    flex: 1,
    transition: 'color 0.3s ease',
  }),
  iconWrapper: (isOpen) => ({
    flexShrink: 0,
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isOpen ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
    transition: 'all 0.3s ease',
  }),
  answerWrapper: (isOpen, measuredHeight) => ({
    maxHeight: isOpen ? `${measuredHeight}px` : '0px',
    overflow: 'hidden',
    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
  answerInner: {
    padding: '0 28px 24px',
  },
  answerText: {
    fontSize: '15px',
    lineHeight: 1.75,
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
};

function AccordionItem({ item, index, isOpen, onToggle, isLast }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const measureHeight = useCallback(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    measureHeight();
    window.addEventListener('resize', measureHeight);
    return () => window.removeEventListener('resize', measureHeight);
  }, [measureHeight]);

  // Re-measure when content becomes visible
  useEffect(() => {
    if (isOpen) {
      measureHeight();
    }
  }, [isOpen, measureHeight]);

  return (
    <div style={styles.item(isLast)}>
      <button
        style={styles.questionButton}
        onClick={() => onToggle(index)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        aria-expanded={isOpen}
      >
        <span style={styles.questionText(isOpen)}>{item.question}</span>
        <span style={styles.iconWrapper(isOpen)}>
          {isOpen ? (
            <Minus size={16} color="#00e5ff" />
          ) : (
            <Plus size={16} color="rgba(255, 255, 255, 0.45)" />
          )}
        </span>
      </button>
      <div
        ref={contentRef}
        style={styles.answerWrapper(isOpen, height)}
      >
        <div style={styles.answerInner}>
          <p style={styles.answerText}>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section style={styles.section}>
      <span style={styles.badge}>FREQUENTLY ASKED</span>
      <h2 style={styles.title}>Questions & Answers</h2>

      <div style={styles.container}>
        {faqItems.map((item, i) => (
          <AccordionItem
            key={i}
            item={item}
            index={i}
            isOpen={openIndex === i}
            onToggle={handleToggle}
            isLast={i === faqItems.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
