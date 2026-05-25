import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY >= window.innerHeight);
          ticking = false;
        });
      }
    };

    const check = () => {
      setIsVisible(window.scrollY >= window.innerHeight);
    };
    check();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="back-to-top fixed z-[100] w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center touch-target"
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          }}
          data-cursor-text="TOP"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" style={{ color: '#d4af37' }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
