import { useEffect, useState } from "react";

/** RAF-throttled scroll flag — only updates state when crossing the threshold. */
export function useNavScrolled(threshold = 40) {
  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > threshold,
  );

  useEffect(() => {
    let scrolled = window.scrollY > threshold;

    const onScroll = () => {
      const next = window.scrollY > threshold;
      if (next === scrolled) return;
      scrolled = next;
      setIsScrolled(next);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isScrolled;
}
