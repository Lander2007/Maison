import { memo, useMemo } from "react";
import { motion } from "motion/react";
import { useLiteAnimations } from "../hooks/useLiteAnimations";

interface StaggeredTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export const StaggeredText = memo(function StaggeredText({
  text,
  className = "",
  style = {},
  delay = 0,
}: StaggeredTextProps) {
  const lite = useLiteAnimations();

  if (lite) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  return (
    <StaggeredTextAnimated
      text={text}
      className={className}
      style={style}
      delay={delay}
    />
  );
});

function StaggeredTextAnimated({
  text,
  className,
  style,
  delay,
}: StaggeredTextProps) {
  const words = useMemo(() => text.split(" ").filter(Boolean), [text]);

  const container = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: delay },
      },
    }),
    [delay],
  );

  const child = useMemo(
    () => ({
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
      },
      hidden: {
        opacity: 0,
        y: 12,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
      },
    }),
    [],
  );

  return (
    <motion.span
      style={style}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
