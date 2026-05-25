import { useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { Check, AlertCircle, Send } from "lucide-react";

interface NewsletterSectionProps {
  language: "en" | "ar";
}

type ValidationState = "idle" | "valid" | "invalid" | "submitted";

export function NewsletterSection({ language }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<ValidationState>("idle");
  const [isFocused, setIsFocused] = useState(false);

  const isRTL = language === "ar";

  const content = useMemo(
    () => ({
      en: {
        title: "Stay in the World of MAISON",
        subtitle:
          "Subscribe to receive exclusive previews, private invitations, and curated stories from our atelier.",
        placeholder: "Enter your email address",
        subscribe: "Subscribe",
        success: "Welcome to MAISON. Check your inbox for a confirmation.",
        error: "Please enter a valid email address",
      },
      ar: {
        title: "ابقَ في عالم ميزون",
        subtitle:
          "اشترك لتلقي معاينات حصرية ودعوات خاصة وقصص مختارة من مشغلنا.",
        placeholder: "أدخل بريدك الإلكتروني",
        subscribe: "اشترك",
        success: "مرحبًا بك في ميزون. تحقق من بريدك الوارد للتأكيد.",
        error: "يرجى إدخال عنوان بريد إلكتروني صالح",
      },
    }),
    [],
  );

  const t = content[language];

  const validateEmail = useCallback((value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);
      if (state === "submitted") return;
      if (value === "") {
        setState("idle");
      } else if (validateEmail(value)) {
        setState("valid");
      } else {
        setState("invalid");
      }
    },
    [state, validateEmail],
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (state === "submitted") return;
    if (email && !validateEmail(email)) {
      setState("invalid");
    }
  }, [email, state, validateEmail]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateEmail(email)) {
        setState("submitted");
      } else {
        setState("invalid");
      }
    },
    [email, validateEmail],
  );

  // Validation/UI state handled by CSS variables and data attributes for theme consistency
  const validationAttr = state === "idle" ? "idle" : state;

  return (
    <section className="relative py-32 px-4 md:px-12 lg:px-24 overflow-hidden transition-colors duration-700">
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: "var(--newsletter-bg)" }}
      />

      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: "var(--newsletter-orbs)" }}
      />

      <div
        className="relative z-10 max-w-3xl mx-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <h2
            className="text-5xl md:text-6xl lg:text-7xl mb-6 font-light tracking-tight"
            style={{
              fontFamily: isRTL ? "var(--font-serif-ar)" : "var(--font-serif)",
              letterSpacing: isRTL ? "normal" : "0.02em",
              background: "var(--newsletter-title-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.title}
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto"
            style={{
              fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
              fontWeight: 300,
              color: "var(--newsletter-subtitle-color)",
              letterSpacing: "0.3px",
            }}
          >
            {t.subtitle}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative flex flex-col items-center w-full"
        >
          {/* Glassmorphic form container */}
          <div
            className="w-full max-w-2xl p-2 rounded-2xl"
            style={{
              background: "var(--newsletter-form-bg)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--newsletter-form-border)",
              boxShadow: "var(--newsletter-form-shadow)",
            }}
          >
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t.subscribe}
                </label>
                <input
                  type="email"
                  id="newsletter-email"
                  value={email}
                  onChange={handleChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={handleBlur}
                  placeholder={t.placeholder}
                  disabled={state === "submitted"}
                  className="w-full px-6 py-4 md:py-5 text-base rounded-xl outline-none transition-all duration-300 border"
                  style={{
                    fontFamily: isRTL
                      ? "var(--font-sans-ar)"
                      : "var(--font-sans)",
                    fontWeight: 300,
                    backgroundColor: "var(--newsletter-input-bg)",
                    color: "var(--input-text)",
                    borderColor: "var(--newsletter-form-border)",
                    fontSize: "1rem",
                    letterSpacing: "0.2px",
                  }}
                  aria-invalid={state === "invalid"}
                  data-validation={validationAttr}
                  aria-describedby={
                    state === "invalid"
                      ? "newsletter-error"
                      : state === "submitted"
                        ? "newsletter-success"
                        : undefined
                  }
                />
                {/* Validation icon with smooth animation */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity:
                      state === "valid" ||
                      state === "invalid" ||
                      state === "submitted"
                        ? 1
                        : 0,
                    scale:
                      state === "valid" ||
                      state === "invalid" ||
                      state === "submitted"
                        ? 1
                        : 0.5,
                  }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-6" : "right-6"}`}
                >
                  {(state === "valid" || state === "submitted") && (
                    <motion.div
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Check
                        className="w-5 h-5"
                        style={{ color: "var(--success-color)" }}
                      />
                    </motion.div>
                  )}
                  {state === "invalid" && (
                    <AlertCircle
                      className="w-5 h-5"
                      style={{ color: "var(--error-color)" }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Modern gradient subscribe button */}
              <motion.button
                type="submit"
                disabled={state === "submitted"}
                whileHover={state !== "submitted" ? { scale: 1.02, y: -2 } : {}}
                whileTap={state !== "submitted" ? { scale: 0.98 } : {}}
                className={`px-7 py-4 md:py-5 text-sm md:text-base tracking-wide uppercase rounded-xl font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0`}
                style={{
                  fontFamily: isRTL
                    ? "var(--font-sans-ar)"
                    : "var(--font-sans)",
                  fontWeight: 600,
                  background:
                    state === "submitted"
                      ? "var(--button-success-bg)"
                      : "var(--button-bg)",
                  color: "var(--button-text)",
                  boxShadow:
                    state === "submitted"
                      ? "var(--button-success-shadow)"
                      : "var(--button-shadow)",
                  border: "none",
                  cursor: state === "submitted" ? "default" : "pointer",
                  opacity: state === "submitted" ? 0.9 : 1,
                }}
              >
                {state === "submitted" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {t.subscribe}
              </motion.button>
            </div>
          </div>

          {/* Validation messages */}
          <div className="h-8 mt-5 w-full text-center">
            <motion.p
              id="newsletter-error"
              initial={false}
              animate={{
                opacity: state === "invalid" ? 1 : 0,
                y: state === "invalid" ? 0 : -5,
              }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium"
              style={{
                color: "var(--error-color)",
                fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
                letterSpacing: "0.2px",
              }}
              aria-live="polite"
            >
              {t.error}
            </motion.p>
            <motion.p
              id="newsletter-success"
              initial={false}
              animate={{
                opacity: state === "submitted" ? 1 : 0,
                y: state === "submitted" ? 0 : -5,
              }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium"
              style={{
                color: "var(--success-color)",
                fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
                letterSpacing: "0.2px",
              }}
              aria-live="polite"
            >
              {t.success}
            </motion.p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
