import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartDrawerProps {
  language: 'en' | 'ar';
}

export function CartDrawer({ language }: CartDrawerProps) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, itemCount, subtotal } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const isRTL = language === 'ar';

  const content = {
    en: {
      title: 'Shopping Bag',
      empty: 'Your bag is empty',
      emptySubtext: 'Explore our collection to find something you love.',
      remove: 'Remove',
      discountLabel: 'Discount Code',
      discountPlaceholder: 'Enter code',
      apply: 'Apply',
      discountSuccess: 'Code applied successfully!',
      discountInvalid: 'Invalid discount code',
      subtotal: 'Subtotal',
      discount: 'Discount',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      items: 'items',
      continueShopping: 'Continue Shopping',
    },
    ar: {
      title: 'حقيبة التسوق',
      empty: 'حقيبتك فارغة',
      emptySubtext: 'استكشف مجموعتنا لتجد شيئًا تحبه.',
      remove: 'إزالة',
      discountLabel: 'رمز الخصم',
      discountPlaceholder: 'أدخل الرمز',
      apply: 'تطبيق',
      discountSuccess: 'تم تطبيق الرمز بنجاح!',
      discountInvalid: 'رمز خصم غير صالح',
      subtotal: 'المجموع الفرعي',
      discount: 'الخصم',
      total: 'الإجمالي',
      checkout: 'المتابعة إلى الدفع',
      items: 'عناصر',
      continueShopping: 'متابعة التسوق',
    },
  };

  const t = content[language];
  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = useCallback(() => {
    if (discountCode.toUpperCase() === 'MAISON10') {
      setDiscountApplied(true);
      setDiscountError('');
    } else {
      setDiscountError(t.discountInvalid);
      setDiscountApplied(false);
    }
  }, [discountCode, t.discountInvalid]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            className="fixed inset-0 z-[9998]"
            style={{
              backgroundColor: 'rgba(10, 10, 10, 0.6)',
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-none sm:max-w-md z-[9999] flex flex-col safe-top safe-bottom`}
            style={{
              backgroundColor: 'var(--luxury-background)',
              borderLeft: isRTL ? 'none' : '1px solid rgba(212, 175, 55, 0.15)',
              borderRight: isRTL ? '1px solid rgba(212, 175, 55, 0.15)' : 'none',
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.15)' }}
            >
              <div className="flex items-center gap-3">
                <h2
                  className="text-xl tracking-wider"
                  style={{
                    fontFamily: isRTL ? 'var(--font-serif-ar)' : 'var(--font-serif)',
                    fontWeight: 300,
                    color: 'var(--luxury-foreground)',
                  }}
                >
                  {t.title}
                </h2>
                {itemCount > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      color: '#d4af37',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {itemCount} {t.items}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCart}
                className="p-2 rounded-full transition-colors duration-300"
                style={{ color: 'var(--luxury-foreground)' }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-4"
                >
                  <ShoppingBag className="w-16 h-16 opacity-20" style={{ color: 'var(--luxury-foreground)' }} />
                  <p
                    className="text-lg"
                    style={{
                      fontFamily: isRTL ? 'var(--font-serif-ar)' : 'var(--font-serif)',
                      fontWeight: 300,
                      color: 'var(--luxury-foreground)',
                    }}
                  >
                    {t.empty}
                  </p>
                  <p
                    className="text-sm opacity-60"
                    style={{
                      fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)',
                      color: 'var(--luxury-foreground)',
                    }}
                  >
                    {t.emptySubtext}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={closeCart}
                    className="mt-4 px-8 py-3 text-sm tracking-widest uppercase"
                    style={{
                      fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#d4af37',
                      backgroundColor: 'transparent',
                    }}
                  >
                    {t.continueShopping}
                  </motion.button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? -30 : 30, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex gap-4 p-3 rounded-sm"
                        style={{
                          border: '1px solid rgba(212, 175, 55, 0.1)',
                          backgroundColor: 'rgba(212, 175, 55, 0.03)',
                        }}
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-sm">
                          <ImageWithFallback
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3
                              className="text-sm truncate"
                              style={{
                                fontFamily: isRTL ? 'var(--font-serif-ar)' : 'var(--font-serif)',
                                fontWeight: 400,
                                color: 'var(--luxury-foreground)',
                              }}
                            >
                              {item.name}
                            </h3>
                            <p
                              className="text-sm mt-1"
                              style={{
                                fontFamily: 'var(--font-sans)',
                                color: '#d4af37',
                              }}
                            >
                              {item.price}
                            </p>
                          </div>

                          {/* Quantity + Remove */}
                          <div className="flex items-center justify-between mt-2">
                            <div
                              className="flex items-center gap-2 rounded-sm"
                              style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }}
                            >
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 transition-colors duration-300 hover:text-[#d4af37]"
                                style={{ color: 'var(--luxury-foreground)' }}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span
                                className="text-xs w-6 text-center"
                                style={{
                                  fontFamily: 'var(--font-sans)',
                                  color: 'var(--luxury-foreground)',
                                }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 transition-colors duration-300 hover:text-[#d4af37]"
                                style={{ color: 'var(--luxury-foreground)' }}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 opacity-50 hover:opacity-100 transition-opacity duration-300"
                              style={{ color: 'var(--luxury-foreground)' }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer (only when items exist) */}
            {items.length > 0 && (
              <div
                className="px-6 py-5 space-y-4"
                style={{ borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}
              >
                {/* Discount Code */}
                <div>
                  <label
                    className="text-xs tracking-widest uppercase mb-2 block opacity-60"
                    style={{
                      fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)',
                      color: 'var(--luxury-foreground)',
                    }}
                  >
                    <Tag className="w-3 h-3 inline mr-1.5" />
                    {t.discountLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value);
                        setDiscountError('');
                      }}
                      placeholder={t.discountPlaceholder}
                      className="flex-1 px-3 py-2 text-sm rounded-sm outline-none transition-all duration-300"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        backgroundColor: 'rgba(212, 175, 55, 0.05)',
                        border: discountError
                          ? '1px solid #f87171'
                          : discountApplied
                          ? '1px solid #4ade80'
                          : '1px solid rgba(212, 175, 55, 0.2)',
                        color: 'var(--luxury-foreground)',
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleApplyDiscount}
                      className="px-4 py-2 text-xs tracking-widest uppercase rounded-sm"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                        color: '#d4af37',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                      }}
                    >
                      {t.apply}
                    </motion.button>
                  </div>
                  {discountError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs mt-1.5"
                      style={{ color: '#f87171', fontFamily: 'var(--font-sans)' }}
                    >
                      {discountError}
                    </motion.p>
                  )}
                  {discountApplied && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs mt-1.5"
                      style={{ color: '#4ade80', fontFamily: 'var(--font-sans)' }}
                    >
                      {t.discountSuccess}
                    </motion.p>
                  )}
                </div>

                {/* Summary */}
                <div className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                  <div className="flex justify-between" style={{ color: 'var(--luxury-foreground)', opacity: 0.7 }}>
                    <span>{t.subtotal}</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {discountApplied && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex justify-between"
                      style={{ color: '#4ade80' }}
                    >
                      <span>{t.discount} (10%)</span>
                      <span>-${discountAmount.toLocaleString()}</span>
                    </motion.div>
                  )}
                  <div
                    className="flex justify-between pt-2 text-base font-medium"
                    style={{
                      borderTop: '1px solid rgba(212, 175, 55, 0.15)',
                      color: 'var(--luxury-foreground)',
                    }}
                  >
                    <span>{t.total}</span>
                    <span style={{ color: '#d4af37' }}>${total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 text-sm tracking-[0.2em] uppercase rounded-sm transition-all duration-500"
                  style={{
                    fontFamily: isRTL ? 'var(--font-sans-ar)' : 'var(--font-sans)',
                    fontWeight: 500,
                    backgroundColor: '#d4af37',
                    color: '#0a0a0a',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  {t.checkout}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
