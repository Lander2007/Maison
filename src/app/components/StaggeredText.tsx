import { memo, useMemo } from 'react';
import { motion } from 'motion/react';

interface StaggeredTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

// Split text into words instead of individual characters for fewer animated elements
export const StaggeredText = memo(function StaggeredText({ text, className = '', style = {}, delay = 0 }: StaggeredTextProps) {
  const words = useMemo(() => text.split(' ').filter(Boolean), [text]);

  const container = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: delay },
    },
  }), [delay]);

  const child = useMemo(() => ({
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }), []);

  return (
    <motion.span
      style={style}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={child} style={{ display: 'inline-block', marginRight: '0.25em' }}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
});
