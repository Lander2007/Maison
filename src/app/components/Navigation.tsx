import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useCart } from "./CartContext";
import { useIsMobile } from "./ui/use-mobile";
import { useNavScrolled } from "../hooks/useNavScrolled";
import { useActiveSection } from "../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useLiteAnimations } from "../hooks/useLiteAnimations";
import { MobileNavMenu, type NavLinkItem } from "./MobileNavMenu";

interface NavigationProps {
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
}

const SECTION_IDS = ["collection", "story", "shop", "contact"] as const;

const navLinks: Record<"en" | "ar", NavLinkItem[]> = {
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

export const Navigation = memo(function Navigation({
  language,
  setLanguage,
}: NavigationProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [clickedSection, setClickedSection] = useState<string | null>(null);
  const isScrolled = useNavScrolled(32);
  const lite = useLiteAnimations();
  const observedSection = useActiveSection(SECTION_IDS, !lite);
  const activeSection = lite ? clickedSection : observedSection;
  const { itemCount, openCart } = useCart();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const isRTL = language === "ar";
  const links = navLinks[language];
  const leftLinks = links.slice(0, 2);
  const rightLinks = links.slice(2);

  const showBarBackground = isScrolled || isMobile || showMobileMenu;

  const navColor = showBarBackground
    ? "var(--luxury-foreground)"
    : "var(--nav-text-top)";

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  const handleBagClick = useCallback(() => {
    openCart();
    setShowMobileMenu(false);
  }, [openCart]);

  const handleNavClick = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement>,
      href: string,
      id: string,
    ) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setClickedSection(id);
      setShowMobileMenu(false);
    },
    [],
  );

  const closeMobileMenu = useCallback(() => setShowMobileMenu(false), []);
  const openMobileMenu = useCallback(() => setShowMobileMenu(true), []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[200] safe-top nav-bar ${
          showBarBackground ? "nav-bar--solid" : ""
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div
          className="nav-bar__accent"
          aria-hidden
          style={{
            transform: showBarBackground ? "scaleX(1)" : "scaleX(0)",
            opacity: showBarBackground ? 1 : 0,
          }}
        />

        <nav className="nav-bar__inner mx-auto max-w-7xl px-4 sm:px-5 md:px-10 lg:px-14 safe-x">
          <div
            className={`flex items-center justify-between transition-[height] duration-300 ${
              showBarBackground
                ? "h-[56px] sm:h-[64px] md:h-[68px]"
                : "h-[60px] sm:h-[72px] md:h-[80px]"
            }`}
          >
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

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex flex-col items-start lg:items-center gap-0.5 lg:gap-1 lg:absolute lg:left-1/2 lg:-translate-x-1/2 touch-target -ms-1 lg:ms-0"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Scroll to top"
            >
              <span
                className="text-lg sm:text-xl md:text-2xl tracking-[0.18em] sm:tracking-[0.2em] transition-all duration-500 group-hover:tracking-[0.25em]"
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
                className="hidden sm:block w-8 h-px transition-all duration-500 group-hover:w-12"
                style={{
                  backgroundColor: "var(--luxury-champagne)",
                  opacity: showBarBackground ? 1 : 0.6,
                }}
              />
            </button>

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
                className="flex items-center gap-1.5 ps-4 ms-2"
                style={{ borderInlineStart: "1px solid var(--nav-border)" }}
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
                  <button
                    type="button"
                    onClick={handleBagClick}
                    className="relative p-2 touch-target flex items-center justify-center"
                    style={{ color: navColor }}
                    data-cursor-text="BAG"
                    aria-label="Shopping bag"
                  >
                    <ShoppingBag
                      className="w-[18px] h-[18px]"
                      strokeWidth={1.25}
                    />
                    <CartBadge count={itemCount} reducedMotion={reducedMotion} />
                  </button>
                </NavIconWrap>
              </div>
            </div>

            <div className="flex lg:hidden items-center gap-1.5 ms-auto">
              <NavIconWrap compact>
                <ThemeToggle />
              </NavIconWrap>
              <NavIconWrap compact>
                <button
                  type="button"
                  onClick={handleBagClick}
                  className="relative touch-target flex items-center justify-center min-w-[44px] min-h-[44px]"
                  style={{ color: navColor }}
                  aria-label="Shopping bag"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.25} />
                  <CartBadge count={itemCount} reducedMotion={reducedMotion} />
                </button>
              </NavIconWrap>
              <NavIconWrap compact>
                <button
                  type="button"
                  onClick={
                    showMobileMenu ? closeMobileMenu : openMobileMenu
                  }
                  className="touch-target flex items-center justify-center min-w-[44px] min-h-[44px]"
                  style={{ color: navColor }}
                  aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                  aria-expanded={showMobileMenu}
                >
                  {showMobileMenu ? (
                    <X className="w-5 h-5" strokeWidth={1.25} />
                  ) : (
                    <Menu className="w-5 h-5" strokeWidth={1.25} />
                  )}
                </button>
              </NavIconWrap>
            </div>
          </div>
        </nav>
      </header>

      <MobileNavMenu
        isOpen={showMobileMenu}
        isRTL={isRTL}
        language={language}
        links={links}
        activeSection={activeSection}
        onClose={closeMobileMenu}
        onNavigate={handleNavClick}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          setShowMobileMenu(false);
        }}
        LanguageSwitcher={LanguageSwitcher}
      />
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
      className="relative text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 group"
      style={{
        fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
        fontWeight: isActive || highlight ? 500 : 400,
        color: isActive ? "var(--luxury-champagne)" : color,
        opacity: isActive ? 1 : highlight ? 0.95 : 0.7,
        textDecoration: "none",
      }}
    >
      {label}
      <span
        className="absolute -bottom-1.5 left-0 h-px transition-all duration-400"
        style={{
          backgroundColor: "var(--luxury-champagne)",
          width: isActive ? "100%" : "0%",
        }}
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
      className={`flex items-center justify-center rounded-full ${
        compact ? "" : ""
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

function CartBadge({
  count,
  reducedMotion,
}: {
  count: number;
  reducedMotion: boolean;
}) {
  if (count <= 0) return null;

  if (reducedMotion) {
    return (
      <span
        className="absolute -top-0.5 -end-0.5 rounded-full flex items-center justify-center text-[9px] font-semibold"
        style={{
          backgroundColor: "var(--luxury-champagne)",
          color: "var(--luxury-midnight)",
          fontFamily: "var(--font-sans)",
          minWidth: "17px",
          height: "17px",
        }}
      >
        {count}
      </span>
    );
  }

  return (
    <AnimatePresence>
      <motion.span
        key="badge"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="absolute -top-0.5 -end-0.5 rounded-full flex items-center justify-center text-[9px] font-semibold"
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
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          className="relative px-2.5 py-1.5 text-[10px] tracking-[0.15em] uppercase rounded-full touch-target min-h-[36px]"
          style={{
            fontFamily: "var(--font-sans)",
            color: language === lang ? "var(--luxury-midnight)" : color,
            backgroundColor:
              language === lang ? "var(--luxury-champagne)" : "transparent",
            fontWeight: language === lang ? 600 : 400,
            opacity: language === lang ? 1 : 0.55,
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.25s ease, color 0.25s ease",
          }}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
