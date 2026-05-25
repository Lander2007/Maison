import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { StaggeredText } from './components/StaggeredText';
import { SectionDivider } from './components/SectionDivider';
import { MaskRevealImage } from './components/MaskRevealImage';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { CartProvider, useCart } from './components/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { NewsletterSection } from './components/NewsletterSection';
import { BackToTop } from './components/BackToTop';
import { ShopGridSection } from './components/ShopGridSection';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  return (
    <ThemeProvider>
      <CartProvider>
        <AppContent language={language} setLanguage={setLanguage} />
      </CartProvider>
    </ThemeProvider>
  );
}

function AppContent({
  language,
  setLanguage,
}: {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  return (
    <div
      ref={containerRef}
      className="overflow-x-hidden transition-colors duration-700"
      style={{ backgroundColor: 'var(--luxury-background)' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <CustomCursor />
      <Navigation language={language} setLanguage={setLanguage} />
      <CartDrawer language={language} />
      <BackToTop />

      <HeroSection language={language} />
      <SectionDivider />
      <ParallaxGallery language={language} />
      <SectionDivider />
      <NarrativeSection language={language} />
      <SectionDivider />
      <ShopGridSection language={language} />
      <SectionDivider />
      <HorizontalProductShowcase language={language} />
      <SectionDivider />
      <NewsletterSection language={language} />
      <SectionDivider />
      <Footer language={language} />
    </div>
  );
}

/* ============================================================================
   HERO SECTION
   ============================================================================ */

function HeroSection({ language }: { language: 'en' | 'ar' }) {
  const { scrollY } = useScroll();
  const { isDark } = useTheme();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.8]);

  const isRTL = language === 'ar';
  const content = {
    en: {
      title: 'MAISON',
      subtitle: 'Quiet Luxury Collection 2026',
      scroll: 'Scroll to Explore',
    },
    ar: {
      title: 'ميزون',
      subtitle: 'مجموعة الرفاهية الهادئة ٢٠٢٦',
      scroll: 'قم بالتمرير للاستكشاف',
    },
  };

  return (
    <motion.section
      style={{ opacity, scale }}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background — adapts to theme */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
            : 'linear-gradient(135deg, #f5f0e8 0%, #ede6d8 30%, #e8dfd0 60%, #f0ead9 100%)',
        }}
      >
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: isDark ? 0.15 : 0.25,
            backgroundImage: isDark
              ? 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(201, 113, 94, 0.15) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(181, 136, 99, 0.12) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8">
        <StaggeredText
          text={content[language].title}
          className="text-[10vw] md:text-[8vw] lg:text-[7vw] tracking-wider mb-6 block"
          style={{
            fontFamily: isRTL ? 'var(--font-serif-ar)' : 'var(--font-serif)',
            fontWeight: 300,
            letterSpacing: isRTL ? 'normal' : '0.15em',
            color: isDark ? '#fafaf8' : '#1a1a1a',
            transition: 'color 0.7s ease',
          }}
          delay={0.3}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-sm md:text-base tracking-[0.3em] uppercase mb-16"
          style={{
            fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)',
            fontWeight: 300,
            color: isDark ? '#d4af37' : '#9a7b2e',
            transition: 'color 0.7s ease',
          }}
        >
          {content[language].subtitle}
        </motion.p>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <span
            className="text-xs tracking-widest uppercase transition-colors duration-700"
            style={{
              fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)',
              color: isDark ? 'rgba(250, 250, 248, 0.7)' : 'rgba(26, 26, 26, 0.5)',
            }}
          >
            {content[language].scroll}
          </span>
          <ChevronDown className="w-6 h-6 transition-colors duration-700" style={{ color: isDark ? '#d4af37' : '#9a7b2e' }} />
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ============================================================================
   PARALLAX GALLERY — staggered reveal with scroll-driven fade-in
   ============================================================================ */

function ParallaxGallery({ language }: { language: 'en' | 'ar' }) {
  const collectionImages = [
    {
      url: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3Nzk3MTgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Editorial fashion portrait',
    },
    {
      url: 'https://images.unsplash.com/photo-1664076458686-3449062080ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3Nzk3MTgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Elegant dress collection',
    },
    {
      url: 'https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3Nzk3MTgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Minimalist fashion',
    },
    {
      url: 'https://images.unsplash.com/flagged/photo-1570733117311-d990c3816c47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3Nzk3MTgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Contemporary fashion',
    },
    {
      url: 'https://images.unsplash.com/photo-1779406275908-1dabe4083373?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3Nzk3MTgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Luxury styling',
    },
    {
      url: 'https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3Nzk3MTgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Timeless elegance',
    },
  ];

  const isRTL = language === 'ar';
  const content = {
    en: { title: 'The Collection', season: 'Spring / Summer 2026' },
    ar: { title: 'المجموعة', season: 'ربيع / صيف ٢٠٢٦' },
  };

  return (
    <section
      id="collection"
      className="py-32 px-4 md:px-12 lg:px-24 transition-colors duration-700"
      style={{ backgroundColor: 'var(--luxury-background)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-24"
      >
        <StaggeredText
          text={content[language].title}
          className="text-5xl md:text-7xl lg:text-8xl mb-6 block"
          style={{
            fontFamily: isRTL ? 'var(--font-serif-ar)' : 'var(--font-serif)',
            fontWeight: 300,
            letterSpacing: isRTL ? 'normal' : '0.05em',
            color: 'var(--luxury-foreground)',
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-[#d4af37] tracking-[0.2em] uppercase text-sm"
          style={{ fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)' }}
        >
          {content[language].season}
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-12 gap-4 md:gap-8 auto-rows-[300px] md:auto-rows-[400px]">
        {collectionImages.map((image, index) => (
          <ParallaxImage key={index} image={image} index={index} />
        ))}
      </div>
    </section>
  );
}

const ParallaxImage = memo(function ParallaxImage({
  image,
  index,
}: {
  image: { url: string; alt: string };
  index: number;
}) {
  const layouts = [
    'col-span-12 md:col-span-7 row-span-2',
    'col-span-12 md:col-span-5 row-span-1',
    'col-span-12 md:col-span-5 row-span-2',
    'col-span-12 md:col-span-7 row-span-1',
    'col-span-12 md:col-span-6 row-span-1',
    'col-span-12 md:col-span-6 row-span-2',
  ];

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 80, scale: 0.95 }
      }
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`relative overflow-hidden ${layouts[index % layouts.length]} group`}
      data-cursor-text="VIEW"
    >
      <MaskRevealImage src={image.url} alt={image.alt} className="w-full h-full" />
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 via-[#d4af37]/10 to-transparent pointer-events-none"
      />
    </motion.div>
  );
});

/* ============================================================================
   NARRATIVE SECTION — sticky parallax images that slide over each other
   ============================================================================ */

function NarrativeSection({ language }: { language: 'en' | 'ar' }) {
  const lifestyleImages = [
    'https://images.unsplash.com/photo-1593528625646-d705402054ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMGxpZmVzdHlsZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzc5NzE4MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1557161622-5f50ca344787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxoaWdoJTIwZmFzaGlvbiUyMGxpZmVzdHlsZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzc5NzE4MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1653159057664-3823f35568f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxoaWdoJTIwZmFzaGlvbiUyMGxpZmVzdHlsZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzc5NzE4MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1681028442065-6d1a85eea2ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxoaWdoJTIwZmFzaGlvbiUyMGxpZmVzdHlsZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzc5NzE4MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  const isRTL = language === 'ar';
  const content = {
    en: {
      title: ['Crafted for the', 'Discerning Few'],
      paragraphs: [
        'Every piece tells a story of meticulous craftsmanship and timeless design. We believe in the power of restraint, where less becomes infinitely more.',
        'Our collection embodies the essence of quiet luxury—understated elegance that speaks volumes through its silence.',
        'Sourced from the finest materials and crafted by master artisans, each garment is an investment in enduring style.',
      ],
    },
    ar: {
      title: ['مصنوعة من أجل', 'القلة المميزة'],
      paragraphs: [
        'كل قطعة تروي قصة من الحرفية الدقيقة والتصميم الخالد. نؤمن بقوة التقييد، حيث يصبح الأقل أكثر بكثير.',
        'تجسد مجموعتنا جوهر الرفاهية الهادئة - الأناقة المتواضعة التي تتحدث كثيرًا من خلال صمتها.',
        'من مصادر أجود المواد ومصنوعة من قبل حرفيين بارعين، كل قطعة هي استثمار في الأسلوب الدائم.',
      ],
    },
  };

  return (
    <section
      id="story"
      ref={containerRef}
      className="min-h-screen py-32 transition-colors duration-700"
      style={{
        background: 'var(--luxury-narrative-bg, linear-gradient(135deg, var(--luxury-background) 0%, var(--luxury-background-alt, #f5f5f3) 100%))',
      }}
    >
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Sticky Text Column */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <StaggeredText
              text={`${content[language].title[0]} ${content[language].title[1]}`}
              className="text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight block"
              style={{
                fontFamily: isRTL ? 'var(--font-serif-ar)' : 'var(--font-serif)',
                fontWeight: 300,
                color: 'var(--luxury-foreground)',
              }}
            />
            <div
              className="space-y-6"
              style={{
                fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)',
                color: 'var(--luxury-foreground-muted)',
              }}
            >
              {content[language].paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="text-lg leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Sticky Parallax Images — each card sticks and the next slides over it */}
          <div className="space-y-0">
            {lifestyleImages.map((image, index) => (
              <StickyParallaxImage key={index} src={image} index={index} total={lifestyleImages.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const StickyParallaxImage = memo(function StickyParallaxImage({
  src,
  index,
  total,
}: {
  src: string;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  // Each card sticks at a slightly lower position, creating the overlap effect
  const stickyTop = 100 + index * 20;

  return (
    <div
      ref={ref}
      className="sticky mb-[-60px] last:mb-0"
      style={{
        top: `${stickyTop}px`,
        zIndex: index + 1,
        height: index === total - 1 ? 'auto' : undefined,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 60, scale: 0.92 }
        }
        transition={{
          duration: 0.8,
          delay: index * 0.08,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="relative aspect-[3/4] overflow-hidden rounded-sm"
        data-cursor-text="EXPLORE"
        style={{
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <MaskRevealImage
          src={src}
          alt={`Lifestyle image ${index + 1}`}
          className="w-full h-full"
        />
        {/* Dark mode glow effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 dark-glow-overlay transition-opacity duration-700"
          style={{
            boxShadow: 'inset 0 0 60px rgba(212, 175, 55, 0.08)',
          }}
        />
      </motion.div>
    </div>
  );
});

/* ============================================================================
   HORIZONTAL PRODUCT SHOWCASE — with "add to bag" functionality
   ============================================================================ */

function HorizontalProductShowcase({ language }: { language: 'en' | 'ar' }) {
  const productsData = {
    en: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1575202332411-b01fe9ace7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGRldGFpbHxlbnwxfHx8fDE3Nzk3MTgyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'Leather Handbag',
        price: '$2,800',
        priceValue: 2800,
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1589363460779-cd717d2ed8fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGRldGFpbHxlbnwxfHx8fDE3Nzk3MTgyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'Signature Tote',
        price: '$3,200',
        priceValue: 3200,
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1604506847073-4a8e18e07d92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGRldGFpbHxlbnwxfHx8fDE3Nzk3MTgyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'Silk Shirt',
        price: '$980',
        priceValue: 980,
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1590156118125-0968476e3157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGRldGFpbHxlbnwxfHx8fDE3Nzk3MTgyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'Diamond Ring',
        price: '$4,500',
        priceValue: 4500,
      },
      {
        id: 5,
        url: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxoaWdoJTIwZmFzaGlvbiUyMGxpZmVzdHlsZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzc5NzE4MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'Evening Pumps',
        price: '$1,450',
        priceValue: 1450,
      },
      {
        id: 6,
        url: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'Cashmere Overcoat',
        price: '$5,200',
        priceValue: 5200,
      },
      {
        id: 7,
        url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'Gold Timepiece',
        price: '$12,500',
        priceValue: 12500,
      },
      {
        id: 8,
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'Quilted Clutch',
        price: '$1,950',
        priceValue: 1950,
      },
      {
        id: 9,
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'Silk Scarf',
        price: '$680',
        priceValue: 680,
      },
      {
        id: 10,
        url: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'Pearl Necklace',
        price: '$7,800',
        priceValue: 7800,
      },
    ],
    ar: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1575202332411-b01fe9ace7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGRldGFpbHxlbnwxfHx8fDE3Nzk3MTgyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'حقيبة يد جلدية',
        price: '٢٨٠٠ $',
        priceValue: 2800,
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1589363460779-cd717d2ed8fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGRldGFpbHxlbnwxfHx8fDE3Nzk3MTgyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'حقيبة مميزة',
        price: '٣٢٠٠ $',
        priceValue: 3200,
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1604506847073-4a8e18e07d92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGRldGFpbHxlbnwxfHx8fDE3Nzk3MTgyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'قميص حريري',
        price: '٩٨٠ $',
        priceValue: 980,
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1590156118125-0968476e3157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMGRldGFpbHxlbnwxfHx8fDE3Nzk3MTgyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'خاتم الماس',
        price: '٤٥٠٠ $',
        priceValue: 4500,
      },
      {
        id: 5,
        url: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxoaWdoJTIwZmFzaGlvbiUyMGxpZmVzdHlsZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzc5NzE4MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        name: 'أحذية مسائية',
        price: '١٤٥٠ $',
        priceValue: 1450,
      },
      {
        id: 6,
        url: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'معطف كشمير',
        price: '٥٢٠٠ $',
        priceValue: 5200,
      },
      {
        id: 7,
        url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'ساعة ذهبية',
        price: '١٢٥٠٠ $',
        priceValue: 12500,
      },
      {
        id: 8,
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'حقيبة مبطنة',
        price: '١٩٥٠ $',
        priceValue: 1950,
      },
      {
        id: 9,
        url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'وشاح حريري',
        price: '٦٨٠ $',
        priceValue: 680,
      },
      {
        id: 10,
        url: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        name: 'عقد لؤلؤ',
        price: '٧٨٠٠ $',
        priceValue: 7800,
      },
    ],
  };

  const products = productsData[language];
  const isRTL = language === 'ar';

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], isRTL ? ['-50%', '0%'] : ['0%', '-50%']);

  const content = {
    en: { title: 'Signature Pieces', cta: 'Add to Bag' },
    ar: { title: 'القطع المميزة', cta: 'أضف إلى الحقيبة' },
  };

  return (
    <section
      ref={containerRef}
      className="py-32 overflow-hidden relative transition-colors duration-700"
      style={{ backgroundColor: 'var(--luxury-background)' }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--luxury-champagne) 5%, transparent), transparent)',
        }}
      />

      <div className="mb-20 px-4 md:px-12 lg:px-24 relative z-10">
        <StaggeredText
          text={content[language].title}
          className="text-4xl md:text-6xl lg:text-7xl text-center block"
          style={{
            fontFamily: isRTL ? 'var(--font-serif-ar)' : 'var(--font-serif)',
            fontWeight: 300,
            letterSpacing: isRTL ? 'normal' : '0.05em',
            color: 'var(--luxury-foreground)',
          }}
        />
      </div>

      <motion.div style={{ x }} className="flex gap-8 px-4 md:px-12 relative z-10">
        {[...products, ...products].map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
            language={language}
            ctaText={content[language].cta}
          />
        ))}
      </motion.div>
    </section>
  );
}

const ProductCard = memo(function ProductCard({
  product,
  language,
  ctaText,
}: {
  product: { id: number; url: string; name: string; price: string; priceValue: number };
  language: 'en' | 'ar';
  ctaText: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const isRTL = language === 'ar';

  const handleHoverStart = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        priceValue: product.priceValue,
        url: product.url,
      });
    },
    [addItem, product]
  );

  return (
    <motion.div
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className="relative flex-shrink-0 w-[400px] md:w-[500px] h-[600px] md:h-[700px] cursor-pointer group"
      data-cursor-text="SHOP"
    >
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ border: '1px solid var(--showcase-card-border)' }}
      >
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full h-full"
        >
          <ImageWithFallback
            src={product.url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
          style={{ background: 'var(--showcase-card-overlay)' }}
        />

        <motion.div
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute bottom-12 left-8 right-8"
          style={{ color: 'var(--luxury-offwhite)' }}
        >
          <h3
            className="text-3xl mb-3"
            style={{
              fontFamily: isRTL ? 'var(--font-serif-ar)' : 'var(--font-serif)',
              fontWeight: 300,
            }}
          >
            {product.name}
          </h3>
          <p
            className="text-xl tracking-wider mb-5"
            style={{
              fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)',
              fontWeight: 300,
              color: 'var(--luxury-champagne)',
            }}
          >
            {product.price}
          </p>

          {/* Add to Bag button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className="px-6 py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm"
            style={{
              fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)',
              fontWeight: 500,
              backgroundColor: 'var(--luxury-champagne)',
              color: 'var(--luxury-midnight)',
              boxShadow: '0 2px 12px rgba(212, 175, 55, 0.3)',
            }}
          >
            {ctaText}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
});

/* ============================================================================
   FOOTER — theme-aware
   ============================================================================ */

function Footer({ language }: { language: 'en' | 'ar' }) {
  const isRTL = language === 'ar';
  const content = {
    en: {
      brand: 'MAISON',
      tagline:
        'Redefining luxury through timeless design and exceptional craftsmanship.',
      explore: 'Explore',
      exploreLinks: ['Collections', 'About', 'Stores', 'Contact'],
      connect: 'Connect',
      connectLinks: ['Instagram', 'Pinterest', 'Newsletter'],
      copyright: '© 2026 MAISON. All rights reserved.',
    },
    ar: {
      brand: 'ميزون',
      tagline:
        'إعادة تعريف الرفاهية من خلال التصميم الخالد والحرفية الاستثنائية.',
      explore: 'استكشف',
      exploreLinks: ['المجموعات', 'عن الشركة', 'المتاجر', 'اتصل بنا'],
      connect: 'تواصل',
      connectLinks: ['إنستجرام', 'بينترست', 'النشرة الإخبارية'],
      copyright: '© ٢٠٢٦ ميزون. جميع الحقوق محفوظة.',
    },
  };

  return (
    <footer
      id="contact"
      className="py-20 px-4 md:px-12 lg:px-24 transition-colors duration-700"
      style={{ backgroundColor: 'var(--luxury-background)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-3xl mb-6"
              style={{
                fontFamily: isRTL
                  ? 'var(--font-serif-ar)'
                  : 'var(--font-serif)',
                fontWeight: 300,
                color: 'var(--luxury-foreground)',
              }}
            >
              {content[language].brand}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="leading-relaxed"
              style={{
                fontFamily: isRTL
                  ? 'var(--font-sans-ar)'
                  : 'var(--font-sans)',
                color: 'var(--luxury-foreground-muted)',
              }}
            >
              {content[language].tagline}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <h4
              className="text-sm tracking-widest uppercase mb-4 text-[#d4af37]"
              style={{
                fontFamily: isRTL
                  ? 'var(--font-sans-ar)'
                  : 'var(--font-sans)',
              }}
            >
              {content[language].explore}
            </h4>
            <ul
              className="space-y-3"
              style={{
                fontFamily: isRTL
                  ? 'var(--font-sans-ar)'
                  : 'var(--font-sans)',
                color: 'var(--luxury-foreground-muted)',
              }}
            >
              {content[language].exploreLinks.map((link, index) => (
                <li
                  key={index}
                  className="hover:text-[#d4af37] transition-colors duration-500 cursor-pointer"
                >
                  {link}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <h4
              className="text-sm tracking-widest uppercase mb-4 text-[#d4af37]"
              style={{
                fontFamily: isRTL
                  ? 'var(--font-sans-ar)'
                  : 'var(--font-sans)',
              }}
            >
              {content[language].connect}
            </h4>
            <ul
              className="space-y-3"
              style={{
                fontFamily: isRTL
                  ? 'var(--font-sans-ar)'
                  : 'var(--font-sans)',
                color: 'var(--luxury-foreground-muted)',
              }}
            >
              {content[language].connectLinks.map((link, index) => (
                <li
                  key={index}
                  className="hover:text-[#d4af37] transition-colors duration-500 cursor-pointer"
                >
                  {link}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="pt-8 text-center"
          style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}
        >
          <p
            className="text-sm"
            style={{
              fontFamily: isRTL
                ? 'var(--font-sans-ar)'
                : 'var(--font-sans)',
              color: 'var(--luxury-foreground-muted)',
              opacity: 0.6,
            }}
          >
            {content[language].copyright}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
