import { useEffect, useState } from "react";

/** One IntersectionObserver for all section anchors (lighter than N observers). */
export function useActiveSection(
  sectionIds: readonly string[],
  enabled = true,
) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const pickActive = () => {
      let bestId: string | null = null;
      let bestRatio = 0;
      for (const id of sectionIds) {
        const ratio = ratios.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }
      if (bestId) setActiveSection(bestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            ratios.set(id, entry.intersectionRatio);
          } else {
            ratios.delete(id);
          }
        }
        pickActive();
      },
      {
        rootMargin: "-42% 0px -48% 0px",
        threshold: [0, 0.15, 0.35],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, enabled]);

  return activeSection;
}
