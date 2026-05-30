import { useState, useCallback, memo } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ShoppingBag, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { StaggeredText } from "./StaggeredText";
import { useLiteAnimations } from "../hooks/useLiteAnimations";

interface ShopItem {
  id: number;
  url: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  price: string;
  priceAr: string;
  priceValue: number;
  badge?: string;
  badgeAr?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 101,
    url: "https://images.unsplash.com/photo-1575202332411-b01fe9ace7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Leather Handbag",
    nameAr: "حقيبة يد جلدية",
    category: "Bags",
    categoryAr: "حقائب",
    price: "$2,800",
    priceAr: "٢٨٠٠ $",
    priceValue: 2800,
    badge: "Bestseller",
    badgeAr: "الأكثر مبيعاً",
  },
  {
    id: 102,
    url: "https://images.unsplash.com/photo-1589363460779-cd717d2ed8fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Signature Tote",
    nameAr: "حقيبة مميزة",
    category: "Bags",
    categoryAr: "حقائب",
    price: "$3,200",
    priceAr: "٣٢٠٠ $",
    priceValue: 3200,
  },
  {
    id: 103,
    url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Gold Timepiece",
    nameAr: "ساعة ذهبية",
    category: "Watches",
    categoryAr: "ساعات",
    price: "$12,500",
    priceAr: "١٢٥٠٠ $",
    priceValue: 12500,
    badge: "Limited",
    badgeAr: "محدود",
  },
  {
    id: 104,
    // original image returned 404; replaced with a working jewellery image
    url: "https://images.unsplash.com/photo-1590156118125-0968476e3157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Pearl Necklace",
    nameAr: "عقد لؤلؤ",
    category: "Jewellery",
    categoryAr: "مجوهرات",
    price: "$7,800",
    priceAr: "٧٨٠٠ $",
    priceValue: 7800,
    badge: "New",
    badgeAr: "جديد",
  },
  {
    id: 105,
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Diamond Ring",
    nameAr: "خاتم الماس",
    category: "Jewellery",
    categoryAr: "مجوهرات",
    price: "$4,500",
    priceAr: "٤٥٠٠ $",
    priceValue: 4500,
  },
  {
    id: 106,
    url: "https://images.unsplash.com/photo-1604506847073-4a8e18e07d92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Silk Shirt",
    nameAr: "قميص حريري",
    category: "Apparel",
    categoryAr: "ملابس",
    price: "$980",
    priceAr: "٩٨٠ $",
    priceValue: 980,
  },
  {
    id: 107,
    url: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Cashmere Overcoat",
    nameAr: "معطف كشمير",
    category: "Apparel",
    categoryAr: "ملابس",
    price: "$5,200",
    priceAr: "٥٢٠٠ $",
    priceValue: 5200,
    badge: "New",
    badgeAr: "جديد",
  },
  {
    id: 108,
    url: "https://images.unsplash.com/photo-1549439602-43ebca2327af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Evening Pumps",
    nameAr: "أحذية مسائية",
    category: "Shoes",
    categoryAr: "أحذية",
    price: "$1,450",
    priceAr: "١٤٥٠ $",
    priceValue: 1450,
  },
  {
    id: 109,
    url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Silk Scarf",
    nameAr: "وشاح حريري",
    category: "Accessories",
    categoryAr: "إكسسوارات",
    price: "$680",
    priceAr: "٦٨٠ $",
    priceValue: 680,
  },
  {
    id: 110,
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Quilted Clutch",
    nameAr: "حقيبة مبطنة",
    category: "Bags",
    categoryAr: "حقائب",
    price: "$1,950",
    priceAr: "١٩٥٠ $",
    priceValue: 1950,
  },
  {
    id: 111,
    url: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Suede Loafers",
    nameAr: "حذاء جلد مدبوغ",
    category: "Shoes",
    categoryAr: "أحذية",
    price: "$1,100",
    priceAr: "١١٠٠ $",
    priceValue: 1100,
  },
  {
    id: 112,
    url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    name: "Structured Blazer",
    nameAr: "بليزر هيكلي",
    category: "Apparel",
    categoryAr: "ملابس",
    price: "$2,200",
    priceAr: "٢٢٠٠ $",
    priceValue: 2200,
    badge: "Bestseller",
    badgeAr: "الأكثر مبيعاً",
  },
];

const CATEGORIES = {
  en: [
    "All",
    "Bags",
    "Jewellery",
    "Watches",
    "Apparel",
    "Shoes",
    "Accessories",
  ],
  ar: ["الكل", "حقائب", "مجوهرات", "ساعات", "ملابس", "أحذية", "إكسسوارات"],
};

interface ShopGridSectionProps {
  language: "en" | "ar";
}

export function ShopGridSection({ language }: ShopGridSectionProps) {
  const lite = useLiteAnimations();
  const isRTL = language === "ar";
  const [activeCategory, setActiveCategory] = useState(0); // 0 = All

  const categories = CATEGORIES[language];
  const categoryKeys = CATEGORIES.en; // used for filtering

  const filtered =
    activeCategory === 0
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter(
          (item) => item.category === categoryKeys[activeCategory],
        );

  const content = {
    en: { title: "Shop", subtitle: "Curated pieces, timeless elegance" },
    ar: { title: "المتجر", subtitle: "قطع مختارة بأناقة خالدة" },
  };

  return (
    <section
      id="shop"
      className="py-14 sm:py-20 md:py-32 px-4 md:px-12 lg:px-24"
      style={{ backgroundColor: "var(--luxury-background)" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-14"
      >
        <StaggeredText
          text={content[language].title}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-4 block"
          style={{
            fontFamily: isRTL ? "var(--font-serif-ar)" : "var(--font-serif)",
            fontWeight: 300,
            letterSpacing: isRTL ? "normal" : "0.05em",
            color: "var(--luxury-foreground)",
          }}
        />
        <p
          className="text-sm tracking-[0.2em] uppercase"
          style={{
            fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
            color: "#d4af37",
          }}
        >
          {content[language].subtitle}
        </p>
      </motion.div>

      {/* Category Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-2 mb-10 sm:mb-14 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:overflow-visible"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((cat, i) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(i)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0 snap-start px-5 py-2.5 text-xs tracking-[0.15em] uppercase rounded-full transition-all duration-400 touch-target"
            style={{
              fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
              backgroundColor:
                activeCategory === i ? "#d4af37" : "rgba(212,175,55,0.08)",
              color:
                activeCategory === i ? "#0a0a0a" : "var(--luxury-foreground)",
              border:
                activeCategory === i
                  ? "1px solid #d4af37"
                  : "1px solid rgba(212,175,55,0.2)",
              fontWeight: activeCategory === i ? 600 : 400,
              boxShadow:
                activeCategory === i
                  ? "0 4px 16px rgba(212,175,55,0.3)"
                  : "none",
            }}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
        {filtered.map((item, index) => (
          <ShopCard
            key={item.id}
            item={item}
            language={language}
            index={index}
            lite={lite}
          />
        ))}
      </div>
    </section>
  );
}

const ShopCard = memo(function ShopCard({
  item,
  language,
  index,
  lite,
}: {
  item: ShopItem;
  language: "en" | "ar";
  index: number;
  lite: boolean;
}) {
  const { addItem, lastAddedId } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const isRTL = language === "ar";
  const justAdded = lastAddedId === item.id;

  const name = isRTL ? item.nameAr : item.name;
  const category = isRTL ? item.categoryAr : item.category;
  const price = isRTL ? item.priceAr : item.price;
  const badge = isRTL ? item.badgeAr : item.badge;

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      addItem({
        id: item.id,
        name,
        price,
        priceValue: item.priceValue,
        url: item.url,
      });
    },
    [addItem, item, name, price],
  );

  const imgUrl = lite ? item.url.replace(/w=800/, "w=480") : item.url;

  const cardInner = (
    <>
      {/* Image Container */}
      <div
        className="relative overflow-hidden rounded-sm mb-4"
        style={{
          aspectRatio: "3/4",
          border: "1px solid rgba(212,175,55,0.12)",
        }}
      >
        {/* Badge */}
        {badge && (
          <div
            className="absolute top-3 z-10 px-3 py-1 text-[10px] tracking-widest uppercase rounded-sm"
            style={{
              [isRTL ? "right" : "left"]: "12px",
              backgroundColor:
                badge === "New" || badge === "جديد"
                  ? "var(--pill-active-bg)"
                  : "rgba(10,10,10,0.75)",
              color:
                badge === "New" || badge === "جديد"
                  ? "var(--pill-active-text)"
                  : "var(--luxury-foreground)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
            }}
          >
            {badge}
          </div>
        )}

        <div className="w-full h-full">
          <ImageWithFallback
            src={imgUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hover / touch overlay */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 hidden sm:flex items-end justify-center pb-6"
          style={{ background: "var(--luxury-overlay)" }}
        >
          <motion.button
            animate={{ y: isHovered ? 0 : 16, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2.5 rounded-sm text-xs tracking-[0.15em] uppercase transition-all duration-300"
            style={{
              backgroundColor: justAdded ? "#4ade80" : "var(--button-bg)",
              color: "var(--button-text)",
              fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
              fontWeight: 600,
              boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {justAdded
              ? isRTL
                ? "تمت الإضافة ✓"
                : "Added ✓"
              : isRTL
                ? "أضف إلى الحقيبة"
                : "Add to Bag"}
          </motion.button>
        </motion.div>

        {/* Mobile: always-visible add button */}
        <button
          type="button"
          onClick={handleAdd}
          className="sm:hidden absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 py-2.5 rounded-sm text-[10px] tracking-[0.12em] uppercase"
          style={{
            backgroundColor: justAdded ? "#4ade80" : "var(--luxury-champagne)",
            color: "var(--luxury-midnight)",
            fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
            fontWeight: 600,
          }}
        >
          <ShoppingBag className="w-3 h-3" />
          {justAdded
            ? isRTL
              ? "تم ✓"
              : "Added ✓"
            : isRTL
              ? "أضف"
              : "Add"}
        </button>
      </div>

      {/* Text Info */}
      <div className="flex flex-col gap-0.5 sm:gap-1 px-0.5 sm:px-1">
        <span
          className="text-[10px] tracking-[0.2em] uppercase"
          style={{
            fontFamily: isRTL ? "var(--font-sans-ar)" : "var(--font-sans)",
            color: "var(--luxury-champagne)",
            opacity: 0.8,
          }}
        >
          {category}
        </span>
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-xs sm:text-sm md:text-base leading-snug line-clamp-2"
            style={{
              fontFamily: isRTL ? "var(--font-serif-ar)" : "var(--font-serif)",
              fontWeight: 400,
              color: "var(--luxury-foreground)",
            }}
          >
            {name}
          </h3>
          <span
            className="text-sm flex-shrink-0"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              color: "var(--luxury-foreground)",
              opacity: 0.85,
            }}
          >
            {price}
          </span>
        </div>

        {/* Rating dots */}
        <div className="flex items-center gap-0.5 mt-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-2.5 h-2.5"
              style={{
                fill: i < 4 ? "#d4af37" : "transparent",
                color: "#d4af37",
                opacity: i < 4 ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  if (lite) {
    return (
      <div
        className="group flex flex-col"
        style={{ cursor: "pointer" }}
        data-cursor-text="SHOP"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {cardInner}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.65,
        delay: (index % 4) * 0.09,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group flex flex-col"
      style={{ cursor: "pointer" }}
      data-cursor-text="SHOP"
    >
      {cardInner}
    </motion.div>
  );
});
