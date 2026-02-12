// KOMPONEN PROMO SECTION - TAMPIL DI BAWAH TOMBOL CHECKOUT
import { Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPromoAktif, type PromoFirebase } from '../database/promo';

interface PromoSectionProps {
  subtotal: number;
  onPromoApplied: (diskon: number, promo: PromoFirebase) => void;
}

export function PromoSection({ subtotal, onPromoApplied }: PromoSectionProps) {
  const [promo, setPromo] = useState<PromoFirebase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load promo aktif dari Firebase
    getPromoAktif()
      .then((promoData) => {
        setPromo(promoData);
        
        // Hitung diskon otomatis
        if (promoData && subtotal > 0) {
          const diskon = Math.floor((subtotal * promoData.persen) / 100);
          onPromoApplied(diskon, promoData);
        } else {
          onPromoApplied(0, null as any);
        }
      })
      .catch(error => {
        console.warn('Promo feature disabled:', error.message);
        setPromo(null);
        onPromoApplied(0, null as any);
      });
  }, [subtotal]);

  // Jika promo tidak aktif, tidak tampil apapun
  if (!promo || loading) return null;

  const diskon = Math.floor((subtotal * promo.persen) / 100);

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
      <div className="flex items-start gap-3">
        <Tag className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-emerald-800 mb-1">
            ✓ Promo diterapkan
          </p>
          <p className="text-sm text-emerald-700 mb-2">
            {promo.teks}
          </p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-emerald-600">Diskon {promo.persen}%:</span>
            <span className="font-bold text-emerald-800">
              - Rp {diskon.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}