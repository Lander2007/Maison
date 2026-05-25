import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  LayoutGrid,
  BookOpen,
  ShoppingBag,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useCart } from "./CartContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const LINK_ICONS = {
  collection: LayoutGrid,
  story: BookOpen,
  shop: ShoppingBag,
  contact: Mail,
} as const;

export type NavLinkItem = {
  label: string;
  href: string;
  id: keyof typeof LINK_ICONS;
};

interface MobileNavMenuProps {
  isOpen: boolean;
  isRTL: boolean;
  language: "en" | "ar";
  links: NavLinkItem[];
  activeSection: string | null;
  onClose: () => void;
  onNavigate: (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string,
  ) => void;
  onLanguageChange: (lang: "en" | "ar") => void;
  LanguageSwitcher: React.ComponentType<{
    language: "en" | "ar";
    setLanguage: (lang: "en" | "ar") => void;
    color: string;
  }>;
}

export function MobileNavMenu({
  isOpen,
  isRTL,
  language,
  links,
  activeSection,
  onClose,
  onNavigate,
  onLanguageChange,
  LanguageSwitcher,
}: MobileNavMenuProps) {
  const { itemCount, openCart } = useCart();
  const reducedMotion = usePrefersReducedMotion();

  const panelTransition = reducedMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, damping: 34, stiffness: 380 };

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleEscape]);

  const copy = {
    en: {
      menu: "Menu",
      shopCta: "Shop Collection",
      bag: "View Bag",
      tagline: "Quiet Luxury · 2026",
    },
    ar: {
      menu: "القائمة",
      shopCta: "تسوق المجموعة",
      bag: "عرض الحقيبة",
      tagline: "الرفاهية الهادئة · ٢٠٢٦",
    },
  };
  const t = copy[language];

  return (
    <AnimatePresence>
      {isOpen && (
    <>
      <motion.div
        key="mobile-nav-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.15 : 0.25 }}
        className="fixed inset-0 z-[299] lg:hidden touch-none"
        style={{ backgroundColor: "rgba(10, 10, 10, 0.5)" }}
        onClick={onClose}
        aria-hidden
      />

      <motion.aside
        key="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t.menu}
        initial={{ x: isRTL ? "-100%" : "100%" }}
        animate={{ x: 0 }}
        exit={{ x: isRTL ? "-100%" : "100%" }}
        transition={panelTransition}
        className={`fixed inset-y-0 z-[300] flex flex-col w-[min(100%,360px)] safe-top safe-bottom ${
          isRTL ? "left-0" : "right-0"
        }`}
        style={{
          background: "var(--nav-mobile-bg)",
          borderInlineStart: isRTL
            ? "none"
            : "1px solid var(--nav-border)",
          borderInlineEnd: isRTL
            ? "1px solid var(--nav-border)"
            : "none",
          boxShadow: isRTL
            ? "8px 0 48px rgba(0,0,0,0.15)"
            : "-8px 0 48px rgba(0,0,0,0.15)",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,175,55,0.18) 0%, transparent 65%)",
          }}
        />

        <header
          className="relative flex items-center justify-between gap-3 px-5 py-4 border-b"
          style={{ borderColor: "var(--nav-border)" }}
        >
          <div>
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-1"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--luxury-champagne)",
              }}
            >
              {t.menu}
            </p>
            <span
              className="text-2xl tracking-[0.12em]"
              style={{
                fontFamily: isRTL
                  ? "var(--font-serif-ar)"
                  : "var(--font-serif)",
                fontWeight: 300,
                color: "var(--luxury-foreground)",
              }}
            >
              {language === "ar" ? "ميزون" : "MAISON"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-target flex items-center justify-center rounded-full p-2.5"
            style={{
              color: "var(--luxury-foreground)",
              background: "var(--nav-action-bg)",
              border: "1px solid var(--nav-action-border)",
            }}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" strokeWidth={1.25} />
          </button>
        </header>

        <nav className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          <ul className="flex flex-col gap-1">
            {links.map((link, index) => {
              const Icon = LINK_ICONS[link.id];
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => onNavigate(e, link.href, link.id)}
                    className="flex items-center gap-4 rounded-lg px-3 py-3.5 touch-target transition-colors duration-200"
                    style={{
                      textDecoration: "none",
                      background: isActive
                        ? "rgba(212, 175, 55, 0.12)"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(212, 175, 55, 0.25)"
                        : "1px solid transparent",
                    }}
                  >
                    <span
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: isActive
                          ? "var(--luxury-champagne)"
                          : "var(--nav-action-bg)",
                        border: "1px solid var(--nav-action-border)",
                      }}
                    >
                      <Icon
                        className="w-[18px] h-[18px]"
                        strokeWidth={1.25}
                        style={{
                          color: isActive
                            ? "var(--luxury-midnight)"
                            : "var(--luxury-champagne)",
                        }}
                      />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className="block text-[10px] tabular-nums tracking-widest mb-0.5"
                        style={{
                          fontFamily: "var(--font-sans)",
                          color: "var(--luxury-foreground-muted)",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="block text-xl leading-tight truncate"
                        style={{
                          fontFamily: isRTL
                            ? "var(--font-serif-ar)"
                            : "var(--font-serif)",
                          fontWeight: 300,
                          color: isActive
                            ? "var(--luxury-champagne)"
                            : "var(--luxury-foreground)",
                        }}
                      >
                        {link.label}
                      </span>
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 opacity-40 ${isRTL ? "rotate-180" : ""}`}
                      style={{ color: "var(--luxury-foreground)" }}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer
          className="relative flex flex-col gap-3 px-5 py-5 safe-bottom border-t"
          style={{ borderColor: "var(--nav-border)" }}
        >
          <button
            type="button"
            onClick={() => {
              onClose();
              const shop = document.getElementById("shop");
              shop?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="w-full touch-target py-3.5 rounded-lg text-xs tracking-[0.18em] uppercase font-semibold"
            style={{
              fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
              background: "var(--button-bg)",
              color: "var(--button-text)",
              boxShadow: "var(--button-shadow)",
            }}
          >
            {t.shopCta}
          </button>

          <button
            type="button"
            onClick={() => {
              openCart();
              onClose();
            }}
            className="w-full touch-target py-3 rounded-lg text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2"
            style={{
              fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
              background: "var(--nav-action-bg)",
              border: "1px solid var(--nav-action-border)",
              color: "var(--luxury-foreground)",
            }}
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.25} />
            {t.bag}
            {itemCount > 0 && (
              <span
                className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-semibold flex items-center justify-center"
                style={{
                  background: "var(--luxury-champagne)",
                  color: "var(--luxury-midnight)",
                }}
              >
                {itemCount}
              </span>
            )}
          </button>

          <div className="flex justify-center pt-1">
            <LanguageSwitcher
              language={language}
              setLanguage={onLanguageChange}
              color="var(--luxury-foreground)"
            />
          </div>

          <p
            className="text-[10px] tracking-[0.22em] uppercase text-center"
            style={{
              fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
              color: "var(--luxury-foreground-muted)",
            }}
          >
            {t.tagline}
          </p>
        </footer>
      </motion.aside>
    </>
      )}
    </AnimatePresence>
  );
}
