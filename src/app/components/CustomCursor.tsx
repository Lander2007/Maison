import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const isHoveringRef = useRef(false);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const updateCursorStyle = useCallback((hovering: boolean, text: string) => {
    if (!cursorDotRef.current) return;
    const dot = cursorDotRef.current;
    if (hovering) {
      dot.style.width = '80px';
      dot.style.height = '80px';
      dot.style.backgroundColor = 'rgba(212, 175, 55, 0.3)';
    } else {
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    }
    if (cursorTextRef.current) {
      cursorTextRef.current.textContent = text;
      cursorTextRef.current.style.opacity = hovering && text ? '1' : '0';
    }
  }, []);

  useEffect(() => {
    // Disable custom cursor on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.('[data-cursor-text]');
      if (target && !isHoveringRef.current) {
        isHoveringRef.current = true;
        const text = target.getAttribute('data-cursor-text') || '';
        updateCursorStyle(true, text);
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.('[data-cursor-text]');
      const related = (e.relatedTarget as HTMLElement)?.closest?.('[data-cursor-text]');
      if (target && !related) {
        isHoveringRef.current = false;
        updateCursorStyle(false, '');
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseout', handleOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [cursorX, cursorY, updateCursorStyle]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <div
        ref={cursorDotRef}
        className="rounded-full flex items-center justify-center"
        style={{
          width: 12,
          height: 12,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          transition: 'width 0.3s ease-out, height 0.3s ease-out, background-color 0.3s ease-out',
        }}
      >
        <span
          ref={cursorTextRef}
          className="text-xs text-white font-medium tracking-wider"
          style={{
            fontFamily: 'var(--font-sans)',
            opacity: 0,
            transition: 'opacity 0.2s ease-out',
          }}
        />
      </div>
    </motion.div>
  );
}
