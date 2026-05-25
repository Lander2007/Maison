import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MaskRevealImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function MaskRevealImage({ src, alt, className = '' }: MaskRevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const clipPathTop = useTransform(scrollYProgress, [0, 0.5], ['100%', '0%']);
  const clipPathBottom = useTransform(scrollYProgress, [0.5, 1], ['0%', '100%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);

  // Memoize clipPath template to avoid recreating on every render
  const clipPath = useMemo(
    () => `inset(${clipPathTop} 0 ${clipPathBottom} 0)`,
    [clipPathTop, clipPathBottom]
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          clipPath,
          scale,
        }}
        className="w-full h-full"
      >
        <motion.div
          style={{ opacity }}
          className="relative w-full h-full"
        >
          <ImageWithFallback
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
