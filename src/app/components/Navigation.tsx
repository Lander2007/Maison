import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "./CartContext";

interface NavigationProps {
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
}

const navLinks = {
  en: [
    { label: "Collections", href: "#collection", id: "collection" },
    { label: "Story", href: "#story", id: "story" },
    { label: "Shop", href: "#shop", id: "shop" },
    { label: "Contact", href: "#contact", id: "contact" },
  ],
  ar: [
    { label: "المجموعات", href: "#collection", id: "collection" },
    { label: "قصتنا", href: "#story", id: "story" },
    { label: "المتجر", href: "#shop", id: "shop" },
    { label: "اتصل بنا", href: "#contact", id: "contact" },
  ],
};

const SECTION_IDS = ["collection", "story", "shop", "contact"] as const;

export const Navigation = memo(function Navigation({
  language,
  setLanguage,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  const isRTL = language === "ar";
  const links = navLinks[language];
  const leftLinks = links.slice(0, 2);
  const rightLinks = links.slice(2);

  const navColor = isScrolled
    ? "var(--luxury-foreground)"
    : "var(--nav-text-top)";
  const handleBagClick = useCallback(() => {
    openCart();
    setShowMobileMenu(false);
  }, [openCart]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string,
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSection(id);
    setShowMobileMenu(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-[200]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Champagne accent line — visible when scrolled */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px origin-center"
          style={{ background: "var(--nav-accent-line)" }}
          initial={false}
          animate={{ scaleX: isScrolled ? 1 : 0, opacity: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />

        <nav
          className="transition-all duration-700"
          style={{
            backgroundColor: isScrolled
              ? "var(--nav-bg-scrolled)"
              : "var(--nav-bg-top)",
            backdropFilter: isScrolled ? "blur(20px) saturate(160%)" : "none",
            borderBottom: isScrolled
              ? "1px solid var(--nav-border)"
              : "1px solid transparent",
            boxShadow: isScrolled ? "var(--nav-shadow-scrolled)" : "none",
          }}
        >
          <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-14">
            <div
              className={`flex items-center justify-between transition-all duration-700 ${
                isScrolled ? "h-[64px] md:h-[68px]" : "h-[72px] md:h-[80px]"
              }`}
            >
              {/* Desktop — left links */}
              <div className="hidden lg:flex items-center gap-10 flex-1">
                {leftLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    {...link}
                    isActive={activeSection === link.id}
                    color={navColor}
                    isRTL={isRTL}
                    onClick={(e) => handleNavClick(e, link.href, link.id)}
                  />
                ))}
              </div>

              {/* Logo — centered on desktop */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex flex-col items-center gap-1 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label="Scroll to top"
              >
                <span
                  className="text-xl md:text-2xl tracking-[0.2em] transition-all duration-500 group-hover:tracking-[0.25em]"
                  style={{
                    fontFamily: isRTL
                      ? "var(--font-serif-ar)"
                      : "var(--font-serif)",
                    fontWeight: 300,
                    color: navColor,
                  }}
                >
                  {language === "ar" ? "ميزون" : "MAISON"}
                </span>
                <span
                  className="w-8 h-px transition-all duration-500 group-hover:w-12"
                  style={{
                    backgroundColor: "var(--luxury-champagne)",
                    opacity: isScrolled ? 1 : 0.6,
                  }}
                />
              </button>

              {/* Desktop — right links + actions */}
              <div className="hidden lg:flex items-center justify-end gap-10 flex-1">
                {rightLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    {...link}
                    isActive={activeSection === link.id}
                    color={navColor}
                    isRTL={isRTL}
                    onClick={(e) => handleNavClick(e, link.href, link.id)}
                    highlight={link.id === "shop"}
                  />
                ))}

                <div
                  className="flex items-center gap-1.5 pl-4 ml-2"
                  style={{ borderLeft: "1px solid var(--nav-border)" }}
                >
                  <LanguageSwitcher
                    language={language}
                    setLanguage={setLanguage}
                    color={navColor}
                  />
                  <NavIconWrap>
                    <ThemeToggle />
                  </NavIconWrap>
                  <NavIconWrap>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={handleBagClick}
                      className="relative p-2"
                      style={{ color: navColor }}
                      data-cursor-text="BAG"
                      aria-label="Shopping bag"
                    >
                      <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.25} />
                      <CartBadge count={itemCount} />
                    </motion.button>
                  </NavIconWrap>
                </div>
              </div>

              {/* Mobile actions */}
              <div className="flex lg:hidden items-center gap-1">
                <NavIconWrap compact>
                  <ThemeToggle />
                </NavIconWrap>
                <NavIconWrap compact>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={handleBagClick}
                    className="relative p-2"
                    style={{ color: navColor }}
                    aria-label="Shopping bag"
                  >
                    <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.25} />
                    <CartBadge count={itemCount} />
                  </motion.button>
                </NavIconWrap>
                <NavIconWrap compact>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setShowMobileMenu(true)}
                    className="p-2"
                    style={{ color: navColor }}
                    aria-label="Open menu"
                  >
                    <Menu className="w-[18px] h-[18px]" strokeWidth={1.25} />
                  </motion.button>
                </NavIconWrap>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[300] flex flex-col"
            style={{ background: "var(--nav-mobile-bg)" }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 70%)",
              }}
            />

            <div
              className="relative flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid var(--nav-border)" }}
            >
              <div className="flex flex-col">
                <span
                  className="text-2xl tracking-[0.15em]"
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
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMobileMenu(false)}
                className="p-2.5 rounded-full"
                style={{
                  color: "var(--luxury-foreground)",
                  background: "var(--nav-action-bg)",
                  border: "1px solid var(--nav-action-border)",
                }}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" strokeWidth={1.25} />
              </motion.button>
            </div>

            <nav className="relative flex-1 flex flex-col justify-center px-10 gap-2">
              {links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.08 + index * 0.06,
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="group flex items-baseline gap-4 py-3"
                  style={{ textDecoration: "none" }}
                  onClick={(e) => handleNavClick(e, link.href, link.id)}
                >
                  <span
                    className="text-xs tabular-nums tracking-widest"
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: "var(--luxury-champagne)",
                      opacity: activeSection === link.id ? 1 : 0.4,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-3xl md:text-4xl transition-colors duration-300"
                    style={{
                      fontFamily: isRTL
                        ? "var(--font-serif-ar)"
                        : "var(--font-serif)",
                      fontWeight: 300,
                      color:
                        activeSection === link.id
                          ? "var(--luxury-champagne)"
                          : "var(--luxury-foreground)",
                    }}
                  >
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative flex flex-col items-center gap-5 px-8 py-8"
              style={{ borderTop: "1px solid var(--nav-border)" }}
            >
              <LanguageSwitcher
                language={language}
                setLanguage={(lang) => {
                  setLanguage(lang);
                  setShowMobileMenu(false);
                }}
                color="var(--luxury-foreground)"
              />
              <p
                className="text-[10px] tracking-[0.25em] uppercase text-center"
                style={{
                  fontFamily: isRTL
                    ? "var(--font-sans-ar)"
                    : "var(--font-sans)",
                  color: "var(--luxury-foreground-muted)",
                }}
              >
                {language === "ar"
                  ? "الرفاهية الهادئة · ٢٠٢٦"
                  : "Quiet Luxury · 2026"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

Navigation.displayName = "Navigation";

function NavLink({
  label,
  href,
  isActive,
  color,
  isRTL,
  onClick,
  highlight = false,
}: {
  label: string;
  href: string;
  isActive: boolean;
  color: string;
  isRTL: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  highlight?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="relative text-[11px] tracking-[0.22em] uppercase transition-all duration-400 group"
      style={{
        fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
        fontWeight: isActive || highlight ? 500 : 400,
        color: isActive ? "var(--luxury-champagne)" : color,
        opacity: isActive ? 1 : highlight ? 0.95 : 0.7,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.color = "var(--nav-link-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.color = color;
      }}
    >
      {label}
      <motion.span
        className="absolute -bottom-1.5 left-0 h-px"
        style={{ backgroundColor: "var(--luxury-champagne)" }}
        initial={false}
        animate={{ width: isActive ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <span
        className="absolute -bottom-1.5 left-0 w-0 h-px group-hover:w-full transition-all duration-500"
        style={{
          backgroundColor: "var(--luxury-champagne)",
          opacity: isActive ? 0 : 0.5,
        }}
      />
    </a>
  );
}

function NavIconWrap({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full transition-colors duration-500 ${
        compact ? "p-0.5" : ""
      }`}
      style={{
        background: "var(--nav-action-bg)",
        border: "1px solid var(--nav-action-border)",
      }}
    >
      {children}
    </div>
  );
}

function CartBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key="badge"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="absolute -top-0.5 -right-0.5 rounded-full flex items-center justify-center text-[9px] font-semibold"
          style={{
            backgroundColor: "var(--luxury-champagne)",
            color: "var(--luxury-midnight)",
            fontFamily: "var(--font-sans)",
            minWidth: "17px",
            height: "17px",
            boxShadow: "0 2px 8px rgba(212,175,55,0.45)",
          }}
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function LanguageSwitcher({
  language,
  setLanguage,
  color,
}: {
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-full px-1 py-0.5"
      style={{
        background: "var(--nav-action-bg)",
        border: "1px solid var(--nav-action-border)",
      }}
    >
      {(["en", "ar"] as const).map((lang) => (
        <motion.button
          key={lang}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLanguage(lang)}
          className="relative px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase rounded-full"
          style={{
            fontFamily: "var(--font-sans)",
            color: language === lang ? "var(--luxury-midnight)" : color,
            backgroundColor:
              language === lang ? "var(--luxury-champagne)" : "transparent",
            fontWeight: language === lang ? 600 : 400,
            opacity: language === lang ? 1 : 0.55,
            border: "none",
            cursor: "pointer",
            transition: "all 0.35s ease",
          }}
        >
          {lang}
        </motion.button>
      ))}
    </div>
  );
}
