import { X, Tag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { subscribePromoBanners } from '../../database/promoBanner';
import type { PromoBannerData } from '../../types';

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [promos, setPromos] = useState<PromoBannerData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribePromoBanners((items) => {
      setPromos(items);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const activePromos = useMemo(
    () => promos.filter((promo) => promo.isActive),
    [promos]
  );

  useEffect(() => {
    if (currentIndex >= activePromos.length) {
      setCurrentIndex(0);
    }
  }, [activePromos.length, currentIndex]);

  useEffect(() => {
    if (!isVisible || activePromos.length <= 1) return;
    const intervalId = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activePromos.length);
    }, 2000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activePromos.length, isVisible]);

  const activePromo = activePromos[currentIndex] || null;

  if (!isVisible || !activePromo) {
    return null;
  }

  return (
    <div
      className="text-white"
      style={{
        backgroundColor: activePromo.backgroundColor,
        color: activePromo.textColor
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Tag className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm md:text-base">{activePromo.text}</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
