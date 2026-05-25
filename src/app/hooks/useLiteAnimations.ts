import { useIsMobile } from "../components/ui/use-mobile";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** Mobile / reduced-motion: skip scroll-linked motion and heavy effects. */
export function useLiteAnimations() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  return isMobile || reducedMotion;
}
