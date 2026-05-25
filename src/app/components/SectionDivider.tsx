import { motion } from "motion/react";
import { useLiteAnimations } from "../hooks/useLiteAnimations";

export function SectionDivider() {
  const lite = useLiteAnimations();

  if (lite) {
    return (
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.3), transparent)",
        }}
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full h-[1px]"
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.3), transparent)",
        transformOrigin: "center",
      }}
    />
  );
}
