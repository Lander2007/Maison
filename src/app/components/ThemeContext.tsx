import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function flashThemeChange() {
  const root = document.documentElement;
  root.classList.add("theme-changing");
  window.setTimeout(() => {
    root.classList.remove("theme-changing");
  }, 120);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("maison-theme") as Theme | null;
      if (stored === "light" || stored === "dark") return stored;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem("maison-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    flashThemeChange();
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyThemeClass(next);
      localStorage.setItem("maison-theme", next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === "dark",
    }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
